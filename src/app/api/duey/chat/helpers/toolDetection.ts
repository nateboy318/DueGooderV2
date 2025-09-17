import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AI-powered intent detection for user messages. Returns the detected tool as a string (e.g., 'timeblocks', 'flashcards', 'none').
 * Uses OpenAI to classify the user's intent/tool.
 */
import { toolIntentClassifierPrompt } from "@/duey-engine/prompt/tool-prompt/tool-picker";

export async function detectToolIntentAI(contextWindow: {role: string, content: string}[]): Promise<string> {
  // Prepare OpenAI messages: prepend system prompt, then add recent context
  const openaiMessages = [
    { role: "system", content: toolIntentClassifierPrompt + "\n\nClassify the user's intent based on the recent conversation context, not just the last message. If the user is confirming or clarifying a previous tool suggestion, inherit the tool from context." },
    ...contextWindow.map(m => ({ role: m.role, content: m.content })) as any
  ];
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: openaiMessages,
    max_tokens: 10,
    temperature: 0.5,
  });
  const tool = completion.choices[0]?.message?.content?.trim().toLowerCase();
  return tool === "timeblocks" || tool === "flashcards" ? tool : "none";
}

export function detectToolIntent(message: string) {
  return { tool: 'none', isTimeblockIntent: false, cleanedMessage: message };
}
