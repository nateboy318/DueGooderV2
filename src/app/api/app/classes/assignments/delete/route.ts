import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export const DELETE = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { classId, assignmentId } = await request.json();

    if (!classId || !assignmentId) {
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

    // Remove assignment from class
    classes[classIndex].assignments = classes[classIndex].assignments.filter(
      (assignment: any) => assignment.id !== assignmentId
    );

    // Update database
    await db
      .update(users)
      .set({ classes })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
});
