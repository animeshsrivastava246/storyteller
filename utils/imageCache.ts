import { getDatabase, hashPrompt } from "./database";

const MAX_CACHE_SIZE = 100;
const CACHE_TTL_DAYS = 7;

export async function getCachedImage(prompt: string): Promise<string | null> {
  const db = await getDatabase();
  const hash = hashPrompt(prompt);
  
  const result = await db.getFirstAsync<{ image_data: string; created_at: string }>(
    "SELECT image_data, created_at FROM image_cache WHERE prompt_hash = ?",
    [hash]
  );
  
  if (!result) return null;
  
  // Check if cache is expired
  const createdAt = new Date(result.created_at);
  const now = new Date();
  const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  
  if (diffDays > CACHE_TTL_DAYS) {
    await db.runAsync("DELETE FROM image_cache WHERE prompt_hash = ?", [hash]);
    return null;
  }
  
  return result.image_data;
}

export async function cacheImage(prompt: string, imageData: string): Promise<void> {
  const db = await getDatabase();
  const hash = hashPrompt(prompt);
  const now = new Date().toISOString();
  
  await db.runAsync(
    `INSERT OR REPLACE INTO image_cache (prompt_hash, image_data, created_at) 
     VALUES (?, ?, ?)`,
    [hash, imageData, now]
  );
  
  // Cleanup old entries if cache is too large
  await cleanupCache();
}

async function cleanupCache(): Promise<void> {
  const db = await getDatabase();
  
  const countResult = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM image_cache"
  );
  
  if (countResult && countResult.count > MAX_CACHE_SIZE) {
    const deleteCount = countResult.count - MAX_CACHE_SIZE;
    await db.runAsync(
      `DELETE FROM image_cache WHERE prompt_hash IN (
        SELECT prompt_hash FROM image_cache ORDER BY created_at ASC LIMIT ?
      )`,
      [deleteCount]
    );
  }
}

export async function clearImageCache(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM image_cache");
}
