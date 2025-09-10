import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    console.log("Update name API called");
    const userId = context.session.user.id;
    const { classId, newName, newEmoji } = await request.json();
    
    console.log("Request data:", { classId, newName, newEmoji });

    if (!classId || !newName) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "Class ID and new name are required" }, { status: 400 });
    }

    // Get user's current classes
    console.log("Fetching user classes for userId:", userId);
    const user = await db
      .select({ classes: users.classes })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const classes = user[0].classes || [];
    console.log("Current classes:", classes.length);
    
    // Update the specific class name and emoji
    const updatedClasses = classes.map((cls: any) => 
      cls.id === classId ? { ...cls, name: newName, emoji: newEmoji || cls.emoji } : cls
    );
    
    console.log("Updated classes:", updatedClasses.length);

    // Update database
    console.log("Updating database...");
    await db
      .update(users)
      .set({ classes: updatedClasses })
      .where(eq(users.id, userId));

    console.log("Database updated successfully");
    return NextResponse.json({ success: true, message: "Class name and emoji updated successfully" });
  } catch (error) {
    console.error("Error updating class name:", error);
    return NextResponse.json({ error: "Failed to update class name" }, { status: 500 });
  }
});
