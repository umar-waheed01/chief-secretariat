/**
 * AI service layer — isolated from UI and route logic.
 * One call per input; validate against schema; fallback to Inbox + Unsure on failure.
 */
import OpenAI from "openai";
import { CLASSIFICATION_SYSTEM_PROMPT, PROMPT_VERSION } from "@/lib/ai/prompt";
import {
  validateClassificationPayload,
  type ClassificationResult,
} from "@/lib/ai/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ClassifyOutput {
  success: true;
  result: ClassificationResult;
  raw: unknown;
  promptVersion: string;
}

export interface ClassifyFallback {
  success: false;
  promptVersion: string;
}

export type ClassifyResponse = ClassifyOutput | ClassifyFallback;

/**
 * Send raw text once to OpenAI; return validated result or fallback.
 * Caller must persist inbox item in both cases (fallback = Inbox + Unsure).
 */
export async function classify(rawText: string): Promise<ClassifyResponse> {
  const promptVersion = PROMPT_VERSION;
  const userMessage =
    "Output JSON only, no markdown or explanation. Raw note:\n\n" + rawText;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CLASSIFICATION_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return { success: false, promptVersion };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { success: false, promptVersion };
    }

    const result = validateClassificationPayload(parsed);
    if (result) {
      return { success: true, result, raw: parsed, promptVersion };
    }
    return { success: false, promptVersion };
  } catch {
    return { success: false, promptVersion };
  }
}
