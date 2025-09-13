import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timeblocks } from "@/db/schema/timeblocks";
import { eq } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// Get all timeblocks for a user (optionally for a week)
export const GET = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { searchParams } = new URL(request.url);
    const weekStartParam = searchParams.get("weekStart");
    const weekEndParam = searchParams.get("weekEnd");

    const userTimeblocks = await db
      .select()
      .from(timeblocks)
      .where(eq(timeblocks.userId, userId))
      .orderBy(timeblocks.startTime);
    return NextResponse.json({ timeblocks: userTimeblocks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch timeblocks" }, { status: 500 });
  }
});

// Create a new timeblock
export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const body = await request.json();
    const timeblockData = body.timeblock;
    if (!timeblockData) {
      return NextResponse.json({ error: "Missing timeblock data" }, { status: 400 });
    }
    const newTimeblock = await db.insert(timeblocks).values({
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
    }).returning();
    return NextResponse.json({ timeblock: newTimeblock[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create timeblock" }, { status: 500 });
  }
});
