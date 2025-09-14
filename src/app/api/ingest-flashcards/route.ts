import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { flashcardSets, flashcards } from "@/db/schema/flashcards";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    question: "Q&A format for concepts and facts",
    vocab: "Vocabulary terms with definitions",
    definition: "Key terms that need explanation",
    example: "Examples that illustrate concepts",
    formula: "Mathematical formulas and equations",
    concept: "Core concepts and theories",
  };
  return descriptions[type] || "Educational content";
}

async function generateDescription(files: Array<{name: string, content: string, type: string}>, setName: string) {
  const combinedContent = files
    .map(file => `File: ${file.name}\nType: ${file.type}\nContent:\n${file.content}`)
    .join('\n\n---\n\n');
  
  const completion = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: `You are an expert at analyzing study materials and creating concise descriptions.
        
        Based on the provided study materials, generate a single, clear sentence that describes the main subject or topic covered.
        The description should be educational and informative, suitable for a student to understand what the flashcard set covers.
        
        Examples:
        - "Flashcards covering key terms and definitions from human anatomy."
        - "Study materials for organic chemistry reactions and mechanisms."
        - "Vocabulary and concepts from World War II history."
        
        Return ONLY the description sentence, nothing else.`
      },
      {
        role: "user",
        content: `Study materials for "${setName}":\n\n${combinedContent}`
      }
    ],
    max_completion_tokens: 100,
  });
  
  return completion.choices[0]?.message?.content?.trim() || `Study materials for ${setName}`;
}

async function processFlashcardsSync(setId: number, files: Array<{name: string, content: string, type: string}>, maxCards: number, types: string[]) {
  // Combine all file contents
  const combinedContent = files
    .map(file => `File: ${file.name}\nType: ${file.type}\nContent:\n${file.content}`)
    .join('\n\n---\n\n');
  
  // Call OpenAI to generate flashcards
  const stream = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: `You are an expert at creating educational flashcards from study materials. 
        
        Analyze the provided study materials and create flashcards that will help students learn effectively.
        
        Create EXACTLY ${maxCards} flashcards using ONLY these specified types:
        ${types.map(type => `- "${type}": ${getTypeDescription(type)}`).join('\n')}
        
        STRICT TYPE ENFORCEMENT:
        - You MUST use ONLY the types listed above - no other types are allowed
        - Every flashcard must have a "type" field that matches exactly one of the specified types
        - If only one type is specified, ALL flashcards must use that type
        - If multiple types are specified, you MUST distribute flashcards across ALL types
        
        MANDATORY TYPE BALANCE:
        - When multiple types are selected, distribute cards as evenly as possible across all types
        - Example: If 15 cards requested with 3 types, create 5 cards of each type
        - Example: If 16 cards requested with 3 types, create 6-5-5 or 6-6-4 distribution
        - Count your cards per type to ensure balanced distribution
        
        EXACT CARD COUNT REQUIREMENT:
        - You MUST create exactly ${maxCards} flashcards - no more, no less
        - If content seems limited, still create the full amount by:
          * Breaking down complex concepts into multiple cards
          * Asking the same concept from different angles
          * Creating variations of similar questions
          * Rephrasing and restructuring information
        - Never return fewer than ${maxCards} cards
        
        CONTENT PRIORITIZATION:
        - Prioritize core concepts, key definitions, and high-yield facts most likely to appear on exams
        - If there are multiple details, group related ones into a single flashcard rather than scattering them
        - Focus on the most important and frequently tested concepts first
        
        FLASHCARD QUALITY RULES:
        - Each flashcard must be self-contained so it can stand alone without referring back to the study materials
        - Questions must be concise, unambiguous, and avoid multi-part prompts unless necessary
        - Answers must be factual, complete, and free of filler words
        - Include a balance of basic recall cards and higher-order thinking cards (e.g., 'Why does X happen?' or 'Compare X and Y')
        - Do not repeat the same fact across multiple flashcards unless worded for a different level of understanding
        
        JSON FORMAT REQUIREMENTS:
        - Return ONLY the raw JSON array with no explanations, comments, or extra text
        - Validate that the output is parseable JSON before returning
        - Use this exact structure (no markdown formatting):
        
        [
          {
            "question": "What is the primary function of mitochondria?",
            "answer": "They produce ATP through cellular respiration.",
            "type": "question"
          },
          {
            "question": "Define mitosis",
            "answer": "A process of cell division that results in two genetically identical daughter cells.",
            "type": "vocab"
          }
        ]
        
        Create ${maxCards} high-quality flashcards that cover the most important concepts from the materials.`
      },
      {
        role: "user",
        content: `Please create flashcards from these study materials:\n\n${combinedContent}`
      }
    ],
    max_completion_tokens: 2000,
    stream: true,
  });
  
  // Collect the streaming response
  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullResponse += content;
    }
  }
  
  if (!fullResponse) {
    throw new Error("No response from OpenAI");
  }
  
  // Parse the JSON response (handle markdown code blocks)
  let flashcardsData;
  try {
    // Remove markdown code blocks if present
    let jsonString = fullResponse.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    flashcardsData = JSON.parse(jsonString);
  } catch (parseError) {
    console.error("Failed to parse OpenAI response:", fullResponse);
    console.error("Parse error:", parseError);
    throw new Error("Invalid JSON response from OpenAI");
  }
  
  // Validate the structure
  if (!Array.isArray(flashcardsData)) {
    throw new Error("OpenAI response is not an array");
  }
  
  // Insert flashcards into database
  const flashcardsToInsert = flashcardsData.map((card: any) => ({
    setId,
    question: card.question || "",
    answer: card.answer || "",
    type: card.type || "question",
  }));
  
  if (flashcardsToInsert.length > 0) {
    await db.insert(flashcards).values(flashcardsToInsert);
  }
  
  return {
    success: true,
    setId,
    flashcardsCreated: flashcardsToInsert.length,
  };
}

const ingestFlashcardsSchema = z.object({
  name: z.string().min(1, "Flashcard set name is required"),
  maxCards: z.number().min(5).max(25).default(15),
  types: z.array(z.string()).min(1, "At least one flashcard type is required"),
  classId: z.string().nullable().optional(),
  files: z.array(z.object({
    name: z.string(),
    content: z.string(),
    type: z.string(),
  })).min(1, "At least one file is required"),
});

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;
    const body = await request.json();
    
    // Validate request body
    const validatedData = ingestFlashcardsSchema.parse(body);
    const { name, maxCards, types, classId, files } = validatedData;
    
    // Generate description from files
    let description: string;
    try {
      description = await generateDescription(files, name);
    } catch (error) {
      console.error("Error generating description:", error);
      description = `Study materials for ${name}`;
    }
    
    // Create flashcard set in database
    const newFlashcardSet = await db
      .insert(flashcardSets)
      .values({
        studentId: userId,
        name,
        description,
        maxCards,
        classId: classId,
      })
      .returning();
    
    if (!newFlashcardSet[0]) {
      return NextResponse.json(
        { error: "Failed to create flashcard set" },
        { status: 500 }
      );
    }
    
    // Process files and generate flashcards synchronously
    try {
      await processFlashcardsSync(newFlashcardSet[0].id, files, maxCards, types);
    } catch (error) {
      console.error("Error processing flashcards:", error);
      // Continue anyway - the set was created
    }
    
    return NextResponse.json(
      { 
        message: "Flashcard set created successfully",
        setId: newFlashcardSet[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create flashcard set" },
      { status: 500 }
    );
  }
});
