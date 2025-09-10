import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { classId, assignmentId, completed } = await request.json();

    if (!classId || !assignmentId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user's classes
    const user = await db
      .select({ classes: users.classes })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const classes = user[0].classes || [];
    const classIndex = classes.findIndex((cls: any) => cls.id === classId);

    if (classIndex === -1) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Find and update assignment completion status
    const assignmentIndex = classes[classIndex].assignments.findIndex(
      (assignment: any) => assignment.id === assignmentId
    );

    if (assignmentIndex === -1) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Update assignment completion status
    classes[classIndex].assignments[assignmentIndex].completed = completed;

    // Update database
    await db
      .update(users)
      .set({ classes })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error toggling assignment completion:", error);
    return NextResponse.json(
      { error: "Failed to toggle assignment completion" },
      { status: 500 }
    );
  }
});
