import { GoogleGenAI } from "@google/genai";
import { serverEnv, validateEnv } from "@/utils/env.server";
import type { StoryLine } from "@/types/story";

const JSON_HEADERS = { "Content-Type": "application/json" };

function jsonResponse(data: object, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export async function POST(request: Request) {
  try {
    validateEnv(["GOOGLE_GENAI_API_KEY"]);
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }

  try {
    const { seed } = (await request.json()) as { seed?: string };
    if (!seed) return jsonResponse({ error: "Missing 'seed' in request body" }, 400);

    const ai = new GoogleGenAI({ apiKey: serverEnv.GOOGLE_GENAI_API_KEY });

    const prompt = `You are a highly skilled narrative engine. Given a seed sentence, generate a short story with 6-10 distinct, vivid lines. Each line should consist of a single, impactful sentence followed by an image prompt describing a scene to illustrate that sentence. Output should be a strict JSON array called lines, where each element is an object containing: text (string), prompt (string). Do not include any commentary or extra information.
    Seed: ${seed}
    Return only JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const lines = parseStoryLines(text);

    if (!lines) {
      return jsonResponse({ error: "Failed to generate your story. :(" }, 502);
    }

    return jsonResponse({ story: lines });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
}

function parseStoryLines(text: string): StoryLine[] | null {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.lines) ? parsed.lines : parsed;
  } catch {
    const match = text.match(/\[([\s\S]*?)\]/);
    if (match) return JSON.parse(match[0]);
    return null;
  }
}
