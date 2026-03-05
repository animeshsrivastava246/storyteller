import type { StoryLine } from "@/types/story";
import { cacheImage, getCachedImage } from "./imageCache";

export async function generateStory(seed: string): Promise<StoryLine[]> {
  const res = await fetch("/api/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seed }),
  });

  const data = await res.json();

  if (!res.ok || !Array.isArray(data.story) || data.story.length === 0) {
    throw new Error(data?.error ?? "Story generation failed.");
  }

  return data.story;
}

export async function generateImage(prompt: string): Promise<string> {
  const cached = await getCachedImage(prompt);
  if (cached) return cached;

  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Image gen failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const { imgUrl } = await res.json();
  await cacheImage(prompt, imgUrl);

  return imgUrl;
}
