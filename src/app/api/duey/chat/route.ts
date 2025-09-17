import { NextRequest, NextResponse } from "next/server";
import { dueySystemPrompt } from "@/duey-engine/prompt/main";
import { timeblockToolPrompt } from "@/duey-engine/prompt/tool-prompt/timeblock";
import { getCurrentDateString } from "@/duey-engine/prompt/helpers/getCurrentDateString";
import { detectInitialToolIntent } from "./helpers/toolDetection";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { timeblocks } from "@/db/schema/timeblocks";
import { eq } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 60; // 60 requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

function formatClassesForPrompt(classes: any[], nowIso: string): string {
  const now = new Date(nowIso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

  let prompt = "## Current Class Schedule and Assignments\n\n";
  prompt += `**Current Date/Time:** ${now.toLocaleString('en-US', { timeZone: 'America/Kentucky/Louisville' })}\n`;
  prompt += `**Week Range:** ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}\n\n`;

  if (!classes || classes.length === 0) {
    return prompt + "No classes found in user's account.\n";
  }

  classes.forEach((classData, index) => {
    prompt += `### ${classData.emoji} ${classData.name}\n`;
    prompt += `**Class ID:** ${classData.id}\n`;
    prompt += `**Color:** ${classData.colorHex}\n\n`;

    if (!classData.assignments || classData.assignments.length === 0) {
      prompt += "No assignments for this class.\n\n";
      return;
    }

    // Sort assignments by due date
    const sortedAssignments = [...classData.assignments].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    prompt += "**Assignments:**\n";
    sortedAssignments.forEach((assignment) => {
      const dueDate = new Date(assignment.dueDate);
      const isOverdue = dueDate < today;
      const isToday = dueDate.toDateString() === today.toDateString();
      const isThisWeek = dueDate >= weekStart && dueDate <= weekEnd;
      
      let status = "";
      if (isOverdue) status = "🔴 OVERDUE";
      else if (isToday) status = "🟡 DUE TODAY";
      else if (isThisWeek) status = "🟠 DUE THIS WEEK";
      else status = "⚪ DUE LATER";

      prompt += `- **${assignment.name}** (${assignment.dueDate}) ${status}\n`;
      if (assignment.description) {
        prompt += `  - Description: ${assignment.description}\n`;
      }
      prompt += `  - Completed: ${assignment.completed ? 'Yes' : 'No'}\n`;
    });
    prompt += "\n";
  });

  return prompt;
}

function formatTimeblocksForPrompt(timeblocks: any[], nowIso: string): string {
  const now = new Date(nowIso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  let prompt = "## Current Timeblocks\n\n";
  
  if (!timeblocks || timeblocks.length === 0) {
    return prompt + "No timeblocks scheduled.\n\n";
  }

  // Filter timeblocks for this week
  const thisWeekTimeblocks = timeblocks.filter(tb => {
    const startTime = new Date(tb.startTime);
    return startTime >= weekStart && startTime <= weekEnd;
  });

  if (thisWeekTimeblocks.length === 0) {
    return prompt + "No timeblocks scheduled for this week.\n\n";
  }

  // Sort by start time
  const sortedTimeblocks = thisWeekTimeblocks.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  sortedTimeblocks.forEach((timeblock) => {
    const startTime = new Date(timeblock.startTime);
    const endTime = new Date(timeblock.endTime);
    const isToday = startTime.toDateString() === today.toDateString();
    const isPast = startTime < now;
    
    let status = "";
    if (isPast) status = "✅ COMPLETED";
    else if (isToday) status = "🟡 TODAY";
    else status = "⚪ UPCOMING";

    prompt += `- **${timeblock.title}** (${startTime.toLocaleString()} - ${endTime.toLocaleString()}) ${status}\n`;
    if (timeblock.description) {
      prompt += `  - Description: ${timeblock.description}\n`;
    }
    prompt += `  - Type: ${timeblock.type}\n`;
    if (timeblock.classId) {
      prompt += `  - Class ID: ${timeblock.classId}\n`;
    }
    prompt += "\n";
  });

  return prompt;
}

async function createTimeblock(userId: string, timeblockData: any) {
  try {
    const newTimeblock = await db
      .insert(timeblocks)
      .values({
        userId,
        title: timeblockData.title,
        description: timeblockData.description,
        startTime: new Date(timeblockData.startTime),
        endTime: new Date(timeblockData.endTime),
        classId: timeblockData.classId,
        assignmentId: timeblockData.assignmentId,
        type: timeblockData.type || "study",
        isRecurring: timeblockData.isRecurring || false,
        recurringPattern: timeblockData.recurringPattern,
      })
      .returning();
    
    return newTimeblock[0];
  } catch (error) {
    console.error("Error creating timeblock:", error);
    throw error;
  }
}

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages, options = {}, timezone, pendingTool, pendingTask } = body;
    const userTimezone = timezone || "UTC";

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Limit messages to prevent context overflow
    const limitedMessages = messages.slice(-20);
    const totalChars = limitedMessages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
    if (totalChars > 6000) {
      return NextResponse.json(
        { error: "Message content too long" },
        { status: 400 }
      );
    }

    // Get user's classes
    const user = await db
      .select({ classes: users.classes })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const classes = user[0].classes || [];
    const nowIso = new Date().toISOString();

    const userTimeblocks = await db
      .select()
      .from(timeblocks)
      .where(eq(timeblocks.userId, userId))
      .orderBy(timeblocks.startTime);

  
    let tool = "none";
    let systemPrompt = "";
    const today = getCurrentDateString(userTimezone);

    if (pendingTool && pendingTool !== "none" && pendingTask) {
      // Tool is pending: lock to tool prompt
      tool = pendingTool;
      systemPrompt = pendingTool === "timeblocks"
        ? timeblockToolPrompt(
            userTimezone,
            formatClassesForPrompt(classes, nowIso),
            formatTimeblocksForPrompt(userTimeblocks, nowIso)
          )
        : pendingTool === "flashcards"
          ? "[Flashcard tool prompt goes here]"
          : dueySystemPrompt(
              userTimezone,
              formatClassesForPrompt(classes, nowIso),
              formatTimeblocksForPrompt(userTimeblocks, nowIso)
            );
      console.log("[Duey Chat] Tool locked (pending):", tool);
      console.log("[Duey Chat] Using prompt:", pendingTool === "timeblocks" ? "timeblockToolPrompt" : pendingTool === "flashcards" ? "flashcardToolPrompt" : "dueySystemPrompt");
    } else {
      // No tool pending: run detection
      const contextWindow = limitedMessages.slice(-5);
      tool = await detectInitialToolIntent(contextWindow[contextWindow.length - 1]?.content || "");
      console.log("[Duey Chat] Tool detected (AI intent):", tool);
      console.log("[Duey Chat] Using prompt:", tool === "timeblocks" ? "timeblockToolPrompt" : tool === "flashcards" ? "flashcardToolPrompt" : "dueySystemPrompt");
      systemPrompt = tool === "timeblocks"
        ? timeblockToolPrompt(
            userTimezone,
            formatClassesForPrompt(classes, nowIso),
            formatTimeblocksForPrompt(userTimeblocks, nowIso)
          )
        : tool === "flashcards"
          ? "[Flashcard tool prompt goes here]"
          : dueySystemPrompt(
              userTimezone,
              formatClassesForPrompt(classes, nowIso),
              formatTimeblocksForPrompt(userTimeblocks, nowIso)
            );
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...limitedMessages
    ];

    // Call OpenAI with streaming
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: openaiMessages as any,
      max_tokens: options.maxTokens || 600,
      temperature: options.temperature || 0.3,
      stream: true,
    });

    // Create streaming response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const streamResponse = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              // Stream each chunk as it arrives (for progressive display)
              const data = `data: ${JSON.stringify({ content, streaming: true })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          const doneData = `data: ${JSON.stringify({ content: fullResponse, done: true, tool })}\n\n`;
          controller.enqueue(encoder.encode(doneData));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorData = `data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(streamResponse, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Duey chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
});
