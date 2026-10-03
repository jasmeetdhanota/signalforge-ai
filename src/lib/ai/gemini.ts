import "server-only";

import { GoogleGenAI } from "@google/genai";

export const REQUEST_THEMES = [
  "Analytics",
  "Workflow",
  "Integrations",
  "Mobile",
  "Collaboration",
] as const;

export type SuggestedTheme = (typeof REQUEST_THEMES)[number];

export interface ExistingRequestForAnalysis {
  id: string;
  title: string;
  description: string;
  theme: string;
}

export interface RequestAnalysis {
  customerNeed: string;
  suggestedTheme: SuggestedTheme;
  reasoning: string;
  confidence: number;
  relatedRequests: {
    requestId: string;
    reasoning: string;
    confidence: number;
  }[];
}

interface AnalyzeRequestInput {
  title: string;
  description: string;
  existingRequests: ExistingRequestForAnalysis[];
}

interface GeminiApiError {
  status?: number;
}

const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-3.7-flash"] as const;

const MAX_ATTEMPTS_PER_MODEL = 3;
const BASE_DELAY_MS = 1000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Gemini API key.");
  }

  return new GoogleGenAI({ apiKey });
}

function isRetryableGeminiError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const status = (error as GeminiApiError).status;

  return (
    status === 408 || status === 429 || (status !== undefined && status >= 500)
  );
}

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function generateWithModel(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              customerNeed: {
                type: "string",
              },
              suggestedTheme: {
                type: "string",
                enum: [...REQUEST_THEMES],
              },
              reasoning: {
                type: "string",
              },
              confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
              },
              relatedRequests: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    requestId: {
                      type: "string",
                    },
                    reasoning: {
                      type: "string",
                    },
                    confidence: {
                      type: "number",
                      minimum: 0,
                      maximum: 1,
                    },
                  },
                  required: ["requestId", "reasoning", "confidence"],
                  additionalProperties: false,
                },
              },
            },
            required: [
              "customerNeed",
              "suggestedTheme",
              "reasoning",
              "confidence",
              "relatedRequests",
            ],
            additionalProperties: false,
          },
        },
      });
    } catch (error) {
      const retryable = isRetryableGeminiError(error);

      if (!retryable) {
        throw error;
      }

      if (attempt === MAX_ATTEMPTS_PER_MODEL) {
        throw error;
      }

      const exponentialDelay = BASE_DELAY_MS * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 500);
      const delayMs = exponentialDelay + jitter;

      console.warn(
        `${model} failed on attempt ${attempt}. Retrying in ${delayMs}ms.`,
      );

      await wait(delayMs);
    }
  }

  throw new Error(`${model} failed after all retry attempts.`);
}

async function generateWithFallback(ai: GoogleGenAI, prompt: string) {
  let lastError: unknown;

  for (const model of GEMINI_MODELS) {
    try {
      return await generateWithModel(ai, model, prompt);
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error)) {
        throw error;
      }

      const hasAnotherModel = model !== GEMINI_MODELS[GEMINI_MODELS.length - 1];

      if (hasAnotherModel) {
        console.warn(
          `${model} remains unavailable. Falling back to the next Gemini model.`,
        );
      }
    }
  }

  throw lastError ?? new Error("All Gemini models failed.");
}

export async function analyzeFeatureRequest({
  title,
  description,
  existingRequests,
}: AnalyzeRequestInput): Promise<RequestAnalysis> {
  const ai = getGeminiClient();

  const existingRequestContext = existingRequests.map((request) => ({
    id: request.id,
    title: request.title,
    description: request.description,
    theme: request.theme,
  }));

  const prompt = `
You are the feature-intelligence layer for SignalForge AI.

Analyze the newly submitted customer feature request and return structured
product intelligence.

NEW REQUEST
Title: ${title}
Description: ${description}

EXISTING REQUESTS
${JSON.stringify(existingRequestContext, null, 2)}

Your job:
1. Identify the underlying customer need rather than simply repeating the request.
2. Suggest exactly one theme from the allowed theme list.
3. Explain the reasoning in concise product-management language.
4. Assign a confidence score from 0 to 1.
5. Identify only genuinely related existing requests.
6. For every related request, explain the relationship and provide a confidence
   score from 0 to 1.
7. Never invent request IDs. A related request ID must come from EXISTING REQUESTS.
8. If no existing request is meaningfully related, return an empty relatedRequests array.

Allowed themes:
${REQUEST_THEMES.join(", ")}
`;

  const response = await generateWithFallback(ai, prompt);

  if (!response.text) {
    throw new Error("Gemini returned an empty analysis.");
  }

  const analysis = JSON.parse(response.text) as RequestAnalysis;

  const existingRequestIds = new Set(
    existingRequests.map((request) => request.id),
  );

  analysis.relatedRequests = analysis.relatedRequests.filter((relationship) =>
    existingRequestIds.has(relationship.requestId),
  );

  return analysis;
}
