import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { classId, colorHex } = await request.json();

    if (!classId || !colorHex) {
      return NextResponse.json({ error: "Class ID and color hex are required" }, { status: 400 });
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
    
    // Update the specific class color
    const updatedClasses = classes.map((cls: any) => 
      cls.id === classId ? { ...cls, colorHex } : cls
    );

    // Update database
    await db
      .update(users)
      .set({ classes: updatedClasses })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: "Class color updated successfully"
    });

  } catch (error) {
    console.error("Error updating class color:", error);
    return NextResponse.json(
      { error: "Failed to update class color" },
      { status: 500 }
    );
  }
});
