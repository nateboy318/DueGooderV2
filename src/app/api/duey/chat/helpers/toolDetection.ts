import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AI-powered intent detection for user messages. Returns the detected tool as a string (e.g., 'timeblocks', 'flashcards', 'none').
 * Uses OpenAI to classify the user's intent/tool.
 */
import { toolIntentClassifierPrompt } from "@/duey-engine/prompt/tool-prompt/tool-picker";

export async function detectToolIntentAI(message: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: toolIntentClassifierPrompt },
      { role: "user", content: message }
    ],
    max_tokens: 10,
    temperature:0.5,
  });
  const tool = completion.choices[0]?.message?.content?.trim().toLowerCase();
  return tool === "timeblocks" || tool === "flashcards" ? tool : "none";
}

export function detectToolIntent(message: string) {
  return { tool: 'none', isTimeblockIntent: false, cleanedMessage: message };
}
