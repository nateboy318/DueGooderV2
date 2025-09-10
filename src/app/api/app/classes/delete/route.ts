import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

export const DELETE = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { classId } = await request.json();

    if (!classId) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }

    // Get user's current classes
    const user = await db
      .select({ classes: users.classes })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const classes = user[0].classes || [];
    
    // Remove the specific class
    const updatedClasses = classes.filter((cls: any) => cls.id !== classId);

    // Update database
    await db
      .update(users)
      .set({ classes: updatedClasses })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
});
