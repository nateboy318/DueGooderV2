import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { classId, name, dueDate, description } = await request.json();

    if (!classId || !name || !dueDate) {
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

    // Create new assignment
    const newAssignment = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      dueDate: new Date(dueDate).toISOString(),
      description: description || "",
      completed: false
    };

    // Insert assignment in correct date order
    const assignments = classes[classIndex].assignments;
    const newDueDate = new Date(newAssignment.dueDate);
    
    // Find the correct insertion index
    let insertIndex = assignments.length;
    for (let i = 0; i < assignments.length; i++) {
      const assignmentDueDate = new Date(assignments[i].dueDate);
      if (newDueDate < assignmentDueDate) {
        insertIndex = i;
        break;
      }
    }
    
    // Insert the new assignment at the correct position
    assignments.splice(insertIndex, 0, newAssignment);

    // Update database
    await db
      .update(users)
      .set({ classes })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, assignment: newAssignment });

  } catch (error) {
    console.error("Error adding assignment:", error);
    return NextResponse.json(
      { error: "Failed to add assignment" },
      { status: 500 }
    );
  }
});
