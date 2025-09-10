import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import ICAL from "ical.js";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { CLASS_COLORS } from "@/lib/colors";
import { generateClassId } from "@/lib/utils/slug";


interface ParsedClass {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
  assignments: {
    id: string;
    name: string;
    dueDate: string;
    description?: string;
    completed: boolean;
  }[];
}

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;

    const { canvasUrl } = await request.json();
    
    if (!canvasUrl) {
      return NextResponse.json({ error: "Canvas URL is required" }, { status: 400 });
    }

    // Fetch ICS file from the provided URL
    const icsResponse = await fetch(canvasUrl);
    if (!icsResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch ICS file" }, { status: 400 });
    }
    
    const icsData = await icsResponse.text();
    
    // Parse ICS data
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");
    
    // Calculate cutoff date (1 week ago)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Extract assignments and categorize by class
    const classMap = new Map<string, ParsedClass>();
    let colorIndex = 0; // Track which color to assign next
    
    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent);
      let summary = event.summary;
      const dueDate = event.startDate.toJSDate();
      
      // Skip assignments older than 1 week
      if (dueDate < oneWeekAgo) return;
      
      // Extract class name from summary in brackets
      let className = "Unknown Class";
      const match = summary.match(/\[(.*?)\]/);
      if (match) {
        className = match[1].trim();
        // Remove the bracketed class name from the summary
        summary = summary.replace(/\s*\[.*?\]\s*/, "").trim();
      }
      
      // Get or create class
      if (!classMap.has(className)) {
        // Assign color cyclically to ensure each class gets a different color
        const colorId = colorIndex % CLASS_COLORS.length;
        classMap.set(className, {
          id: generateClassId(className),
          name: className,
          colorHex: CLASS_COLORS[colorId].hex,
          emoji: "📚", // Basic placeholder emoji for now
          assignments: []
        });
        colorIndex++; // Move to next color for next class
      }
      
      const classData = classMap.get(className)!;
      classData.assignments.push({
        id: event.uid || Math.random().toString(36).substr(2, 9),
        name: summary,
        dueDate: dueDate.toISOString(),
        description: event.description || "",
        completed: false
      });
    });
    
    const parsedClasses = Array.from(classMap.values());

    // Update user's classes in database
    await db
      .update(users)
      .set({ classes: parsedClasses })
      .where(eq(users.id, userId));

    // Create Google Calendar events for each class
    try {
      const calendarResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/app/canvas/create-calendar-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`,
        },
        body: JSON.stringify({ classes: parsedClasses }),
      });

      if (!calendarResponse.ok) {
        console.error("Failed to create calendar events:", await calendarResponse.text());
      }
    } catch (error) {
      console.error("Error creating calendar events:", error);
      // Don't fail the import if calendar creation fails
    }

    const totalAssignments = parsedClasses.reduce((sum, cls) => sum + cls.assignments.length, 0);

    return NextResponse.json({
      success: true,
      classesCount: parsedClasses.length,
      assignmentsCount: totalAssignments,
      message: "Canvas classes imported successfully"
    });

  } catch (error) {
    console.error("Canvas import error:", error);
    return NextResponse.json(
      { error: "Failed to import Canvas data" },
      { status: 500 }
    );
  }
});

