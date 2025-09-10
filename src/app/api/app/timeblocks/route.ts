import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timeblocks } from "@/db/schema/timeblocks";
import { eq, and, gte, lte } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// GET /api/app/timeblocks - Get user's timeblocks
export const GET = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Optional date range filtering
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    let query = db
      .select()
      .from(timeblocks)
      .where(eq(timeblocks.userId, userId))
      .orderBy(timeblocks.startTime);
    
    // Apply date range filter if provided
    if (startDate) {
      query = query.where(and(eq(timeblocks.userId, userId), gte(timeblocks.startTime, new Date(startDate))));
    }
    if (endDate) {
      query = query.where(and(eq(timeblocks.userId, userId), lte(timeblocks.endTime, new Date(endDate))));
    }
    
    const userTimeblocks = await query;
    
    return NextResponse.json({ timeblocks: userTimeblocks });
  } catch (error) {
    console.error("Error fetching timeblocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeblocks" },
      { status: 500 }
    );
  }
});

// POST /api/app/timeblocks - Create a new timeblock
export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const body = await request.json();
    
    const {
      title,
      description,
      startTime,
      endTime,
      classId,
      assignmentId,
      type = "study",
      isRecurring = false,
      recurringPattern,
    } = body;
    
    // Validate required fields
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, startTime, and endTime are required" },
        { status: 400 }
      );
    }
    
    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }
    
    // Create timeblock
    const newTimeblock = await db
      .insert(timeblocks)
      .values({
        userId,
        title,
        description,
        startTime: start,
        endTime: end,
        classId,
        assignmentId,
        type,
        isRecurring,
        recurringPattern,
      })
      .returning();
    
    return NextResponse.json({ timeblock: newTimeblock[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating timeblock:", error);
    return NextResponse.json(
      { error: "Failed to create timeblock" },
      { status: 500 }
    );
  }
});
