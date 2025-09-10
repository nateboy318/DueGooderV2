import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { classId, assignmentId, name, dueDate, description } = await request.json();

    if (!classId || !assignmentId || !name || !dueDate) {
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

    // Find and update assignment
    const assignmentIndex = classes[classIndex].assignments.findIndex(
      (assignment: any) => assignment.id === assignmentId
    );

    if (assignmentIndex === -1) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Update assignment
    const updatedAssignment = {
      ...classes[classIndex].assignments[assignmentIndex],
      name,
      dueDate: new Date(dueDate).toISOString(),
      description: description || ""
    };

    // Remove assignment from current position
    classes[classIndex].assignments.splice(assignmentIndex, 1);

    // Insert assignment in correct date order
    const assignments = classes[classIndex].assignments;
    const newDueDate = new Date(updatedAssignment.dueDate);
    
    // Find the correct insertion index
    let insertIndex = assignments.length;
    for (let i = 0; i < assignments.length; i++) {
      const assignmentDueDate = new Date(assignments[i].dueDate);
      if (newDueDate < assignmentDueDate) {
        insertIndex = i;
        break;
      }
    }
    
    // Insert the updated assignment at the correct position
    assignments.splice(insertIndex, 0, updatedAssignment);

    // Update database
    await db
      .update(users)
      .set({ classes })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error editing assignment:", error);
    return NextResponse.json(
      { error: "Failed to edit assignment" },
      { status: 500 }
    );
  }
});
