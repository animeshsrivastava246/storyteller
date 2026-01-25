import { serverEnv, validateEnv } from "@/utils/env.server";

const JSON_HEADERS = { "Content-Type": "application/json" };

function jsonResponse(data: object, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export async function POST(request: Request) {
  try {
    validateEnv(["IMG_API_URL", "IMG_API_TOKEN"]);
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }

  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return jsonResponse({ error: "Prompt is required!" }, 400);
    }

    const enhancedPrompt = `${prompt}. A high-resolution, highly detailed, professional image with vibrant colors and intricate details. Make the image 4:3 aspect ratio.`;

    const response = await fetch(serverEnv.IMG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.IMG_API_TOKEN}`,
      },
      body: JSON.stringify({ prompt: enhancedPrompt }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "Unknown error");
      return jsonResponse({ error: `Image API error: ${text}` }, response.status);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imgUrl = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

    return jsonResponse({ imgUrl });
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
}
