// Minimal initial tool intent detection for new tasks only
import OpenAI from "openai";
import { toolIntentClassifierPrompt } from "@/duey-engine/prompt/tool-prompt/tool-picker";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import type { ChatCompletionMessageParam } from "openai/resources/chat";

export async function detectInitialToolIntent(message: string): Promise<"none" | "timeblocks" | "flashcards"> {
  const openaiMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: toolIntentClassifierPrompt },
    { role: "user", content: message }
  ];
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: openaiMessages,
    max_tokens: 10,
    temperature: 0.3,
  });
  const tool = completion.choices[0]?.message?.content?.trim().toLowerCase();
  console.log('Tool detected:', tool);
  return tool === "timeblocks" || tool === "flashcards" ? tool : "none";
}


