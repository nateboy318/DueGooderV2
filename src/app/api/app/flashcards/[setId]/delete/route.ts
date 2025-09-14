import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { flashcardSets } from "@/db/schema/flashcards";
import { eq, and } from "drizzle-orm";

export const DELETE = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { setId } = await context.params;
    
    if (!setId || isNaN(Number(setId))) {
      return NextResponse.json(
        { error: "Invalid set ID" },
        { status: 400 }
      );
    }
    
    // Verify the set belongs to the user and delete it
    const deletedSet = await db
      .delete(flashcardSets)
      .where(
        and(
          eq(flashcardSets.id, Number(setId)),
          eq(flashcardSets.studentId, userId)
        )
      )
      .returning();
    
    if (!deletedSet.length) {
      return NextResponse.json(
        { error: "Flashcard set not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: "Flashcard set deleted successfully",
      deletedSet: deletedSet[0]
    });
  } catch (error) {
    console.error("Error deleting flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard set" },
      { status: 500 }
    );
  }
});
