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
    let rawBody = '';
  try {
    rawBody = await request.text();
        // Re-create the request object with the raw body for downstream .json() parsing
    request = new NextRequest(request.url, { method: request.method, headers: request.headers, body: rawBody });
  } catch (err) {
      }
  try {
    const userId = context.session.user.id;
    let body;
    try {
      body = await request.json();
    } catch (err) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    // Support both single and multiple timeblock creation
    const single = body.timeblock;
    const multiple = body.timeblocks;
    if (!single && !multiple) {
            return NextResponse.json({ error: "Missing timeblock data" }, { status: 400 });
    }

    let createdTimeblocks: any[] = [];
    if (multiple && Array.isArray(multiple)) {
      // Batch insert
      const values = multiple.map(tb => ({
        userId,
        title: tb.title,
        description: tb.description,
        startTime: new Date(tb.startTime),
        endTime: new Date(tb.endTime),
        classId: tb.classId,
        assignmentId: tb.assignmentId,
        type: tb.type || "study",
        isRecurring: tb.isRecurring || false,
        recurringPattern: tb.recurringPattern,
      }));
      createdTimeblocks = await db.insert(timeblocks).values(values).returning();
    } else if (single) {
      // Single insert
      const [created] = await db.insert(timeblocks).values({
        userId,
        title: single.title,
        description: single.description,
        startTime: new Date(single.startTime),
        endTime: new Date(single.endTime),
        classId: single.classId,
        assignmentId: single.assignmentId,
        type: single.type || "study",
        isRecurring: single.isRecurring || false,
        recurringPattern: single.recurringPattern,
      }).returning();
      createdTimeblocks = [created];
    }
    return NextResponse.json({ timeblocks: createdTimeblocks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create timeblock" }, { status: 500 });
  }
});
