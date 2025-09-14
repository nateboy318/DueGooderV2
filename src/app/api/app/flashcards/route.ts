import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { flashcardSets, flashcards } from "@/db/schema/flashcards";
import { eq, desc, count, sql } from "drizzle-orm";

export const GET = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    
    // Get flashcard sets with card counts and types
    const setsWithCounts = await db
      .select({
        id: flashcardSets.id,
        name: flashcardSets.name,
        description: flashcardSets.description,
        maxCards: flashcardSets.maxCards,
        classId: flashcardSets.classId,
        createdAt: flashcardSets.createdAt,
        cardCount: count(flashcards.id),
        types: sql<string[]>`coalesce(array_agg(distinct ${flashcards.type}) filter (where ${flashcards.type} is not null), '{}')`,
      })
      .from(flashcardSets)
      .leftJoin(flashcards, eq(flashcardSets.id, flashcards.setId))
      .where(eq(flashcardSets.studentId, userId))
      .groupBy(flashcardSets.id, flashcardSets.name, flashcardSets.description, flashcardSets.maxCards, flashcardSets.classId, flashcardSets.createdAt)
      .orderBy(desc(flashcardSets.createdAt));
    
    return NextResponse.json({ sets: setsWithCounts });
  } catch (error) {
    console.error("Error fetching flashcard sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard sets" },
      { status: 500 }
    );
  }
});
