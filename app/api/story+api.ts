import { GoogleGenAI } from "@google/genai";

type StoryLine = {
  text: string;
  prompt: string;
};

export async function POST(request: Request) {
  const headers = { "Content-Type": "application/json" };
  try {
    const { seed } = (await request.json()) as { seed?: string };
    if (!seed) return new Response(JSON.stringify({ error: "Missing 'seed' in request body" }), { status: 400, headers });

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500, headers });

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a highly skilled narrative engine. Given a seed sentence, generate a short story with 6-10 distinct, vivid lines. Each line should consist of a single, impactful sentence followed by an image prompt describing a scene to illustrate that sentence. Output should be a strict JSON array called lines, where each element is an object containing: text (string), prompt (string). Do not include any commentary or extra information.
    Seed: ${seed}
    Return only JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    let lines: StoryLine[] = [];

    try {
      const parsed = JSON.parse(text);
      lines = Array.isArray(parsed.lines) ? parsed.lines : parsed;
    } catch {
      const match = text.match(/\[([\s\S]*?)\]/);
      if (match) lines = JSON.parse(match[0]);
      else return new Response(JSON.stringify({ error: "Failed to generate your story. :(" }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ story: lines }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers });
  }
}