import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { flashcardSets, flashcards } from "@/db/schema/flashcards";
import { eq, and } from "drizzle-orm";

export const GET = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const { setId } = await context.params;
    
    if (!setId || isNaN(Number(setId))) {
      return NextResponse.json(
        { error: "Invalid set ID" },
        { status: 400 }
      );
    }
    
    // Verify the set belongs to the user
    const set = await db
      .select()
      .from(flashcardSets)
      .where(
        and(
          eq(flashcardSets.id, Number(setId)),
          eq(flashcardSets.studentId, userId)
        )
      )
      .limit(1);
    
    if (!set.length) {
      return NextResponse.json(
        { error: "Flashcard set not found" },
        { status: 404 }
      );
    }
    
    // Get all flashcards for this set
    const setFlashcards = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.setId, Number(setId)))
      .orderBy(flashcards.id);
    
    return NextResponse.json({ 
      set: set[0],
      flashcards: setFlashcards 
    });
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard set" },
      { status: 500 }
    );
  }
});
