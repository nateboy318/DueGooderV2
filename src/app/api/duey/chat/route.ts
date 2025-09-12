import { NextRequest, NextResponse } from "next/server";
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
    const { messages, options = {}, timezone } = body;
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

    // Get user's classes and timeblocks
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

    // Get user's timeblocks for this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const userTimeblocks = await db
      .select()
      .from(timeblocks)
      .where(eq(timeblocks.userId, userId))
      .orderBy(timeblocks.startTime);

    // Create system prompt
    const systemPrompt = `You are Duey, an agentic academic assistant. Help students prioritize their workload and manage their time effectively.

**Style:**
- Be direct and practical
- Use bullet points for lists
- Focus on today and this week
- Keep responses brief but helpful
- Be proactive in suggesting timeblocks

**Timezone:**
- All times referenced by the user are in their local timezone: ${userTimezone}.
- When you generate a timeblock, always interpret the requested time as ${userTimezone} local time.
- Output all times as ISO 8601 UTC (ending with 'Z'). For example, 2:00pm ${userTimezone} should be output as its corresponding UTC time.

**Capabilities:**
- Analyze assignments and suggest study timeblocks
- Create timeblocks automatically when appropriate
- Help with time management and scheduling
- Prioritize urgent items (due today/this week) first
- Sort by: exams/projects > quizzes > homework
- Suggest 25-50 minute work blocks

**Timeblock Creation:**
When suggesting study time, you can create timeblocks by responding with:
\`\`\`json
{
  "action": "create_timeblock",
  "timeblock": {
    "title": "Study for Math Exam",
    "description": "Review chapters 5-7 and practice problems",
    "startTime": "2024-01-15T14:00:00Z",
    "endTime": "2024-01-15T15:30:00Z",
    "type": "study",
    "classId": "optional-class-id"
  }
}
\`\`\`

**Current context:**
${formatClassesForPrompt(classes, nowIso)}
${formatTimeblocksForPrompt(userTimeblocks, nowIso)}

Respond concisely. Use markdown formatting for lists and emphasis. When appropriate, suggest and create timeblocks for effective study sessions.`;

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
    let timeblockCreated = false;
    
    const streamResponse = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          
          // Check if response contains timeblock creation request
          const timeblockMatch = fullResponse.match(/```json\s*{\s*"action":\s*"create_timeblock"[\s\S]*?}\s*```/);
          if (timeblockMatch && !timeblockCreated) {
            try {
              const jsonMatch = timeblockMatch[0].match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsedTimeblockData = JSON.parse(jsonMatch[0]);
                if (parsedTimeblockData.action === "create_timeblock" && parsedTimeblockData.timeblock) {
                  const newTimeblock = await createTimeblock(userId, parsedTimeblockData.timeblock);
                  timeblockCreated = true;
                  
                  // Send timeblock creation confirmation
                  const timeblockResponseData = `data: ${JSON.stringify({ 
                    timeblockCreated: true, 
                    timeblock: newTimeblock 
                  })}\n\n`;
                  controller.enqueue(encoder.encode(timeblockResponseData));
                }
              }
            } catch (parseError) {
              console.error("Error parsing timeblock creation:", parseError);
            }
          }
          
          // Send completion signal
          const doneData = `data: ${JSON.stringify({ done: true })}\n\n`;
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
