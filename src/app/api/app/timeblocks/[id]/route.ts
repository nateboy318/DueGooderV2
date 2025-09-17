import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timeblocks } from "@/db/schema/timeblocks";
import { eq, and } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// GET /api/app/timeblocks/[id] - Get specific timeblock
export const GET = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const params = await context.params;
    const timeblockId = params.id as string;
    
    const timeblock = await db
      .select()
      .from(timeblocks)
      .where(and(
        eq(timeblocks.id, timeblockId),
        eq(timeblocks.userId, userId)
      ))
      .limit(1);
    
    if (!timeblock.length) {
      return NextResponse.json(
        { error: "Timeblock not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ timeblock: timeblock[0] });
  } catch (error) {
    console.error("Error fetching timeblock:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeblock" },
      { status: 500 }
    );
  }
});

// PUT /api/app/timeblocks/[id] - Update timeblock
export const PUT = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const params = await context.params;
    const timeblockId = params.id as string;
    const body = await request.json();
    
    const {
      title,
      description,
      startTime,
      endTime,
      classId,
      assignmentId,
      type,
      completed,
    } = body;
    
    // Validate time range if provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (start >= end) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 }
        );
      }
    }
    
    // Update timeblock
    const updatedTimeblock = await db
      .update(timeblocks)
      .set({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(classId !== undefined && { classId }),
        ...(assignmentId !== undefined && { assignmentId }),
        ...(type && { type }),
        ...(completed !== undefined && { completed }),
        updatedAt: new Date(),
      })
      .where(and(
        eq(timeblocks.id, timeblockId),
        eq(timeblocks.userId, userId)
      ))
      .returning();
    
    if (!updatedTimeblock.length) {
      return NextResponse.json(
        { error: "Timeblock not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ timeblock: updatedTimeblock[0] });
  } catch (error) {
    console.error("Error updating timeblock:", error);
    return NextResponse.json(
      { error: "Failed to update timeblock" },
      { status: 500 }
    );
  }
});

// DELETE /api/app/timeblocks/[id] - Delete timeblock
export const DELETE = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const params = await context.params;
    const timeblockId = params.id as string;
    
    const deletedTimeblock = await db
      .delete(timeblocks)
      .where(and(
        eq(timeblocks.id, timeblockId),
        eq(timeblocks.userId, userId)
      ))
      .returning();
    
    if (!deletedTimeblock.length) {
      return NextResponse.json(
        { error: "Timeblock not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Timeblock deleted successfully" });
  } catch (error) {
    console.error("Error deleting timeblock:", error);
    return NextResponse.json(
      { error: "Failed to delete timeblock" },
      { status: 500 }
    );
  }
});
