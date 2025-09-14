import { inngest } from "../client";
import { db } from "@/db";
import { flashcards } from "@/db/schema/flashcards";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProcessFlashcardsEvent {
  data: {
    setId: number;
    userId: string;
    files: Array<{
      name: string;
      content: string;
      type: string;
    }>;
  };
}

export const processFlashcards = inngest.createFunction(
  { id: "process-flashcards" },
  { event: "flashcards/process-files" },
  async ({ event }: ProcessFlashcardsEvent) => {
    const { setId, userId, files } = event.data;
    
    try {
      // Combine all file contents
      const combinedContent = files
        .map(file => `File: ${file.name}\nType: ${file.type}\nContent:\n${file.content}`)
        .join('\n\n---\n\n');
      
      // Call OpenAI to generate flashcards
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at creating educational flashcards from study materials. 
            
            Analyze the provided study materials and create flashcards that will help students learn effectively.
            
            Create different types of flashcards:
            - "question": Q&A format for concepts and facts
            - "vocab": Vocabulary terms with definitions
            - "definition": Key terms that need explanation
            - "example": Examples that illustrate concepts
            
            Return ONLY a valid JSON array with this exact structure:
            [
              {
                "question": "What is...?",
                "answer": "The answer is...",
                "type": "question"
              },
              {
                "question": "Define photosynthesis",
                "answer": "The process by which plants convert light energy into chemical energy",
                "type": "vocab"
              }
            ]
            
            Create 10-20 high-quality flashcards that cover the most important concepts from the materials.`
          },
          {
            role: "user",
            content: `Please create flashcards from these study materials:\n\n${combinedContent}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });
      
      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }
      
      // Parse the JSON response
      let flashcardsData;
      try {
        flashcardsData = JSON.parse(response);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", response);
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
      
      await db.insert(flashcards).values(flashcardsToInsert);
      
      return {
        success: true,
        setId,
        flashcardsCreated: flashcardsToInsert.length,
      };
    } catch (error) {
      console.error("Error processing flashcards:", error);
      
      // You might want to update the flashcard set status or notify the user
      // For now, we'll just log the error
      throw error;
    }
  }
);
