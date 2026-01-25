import type { StoryEntry, StoryLine } from "@/types/story";
import { getDatabase } from "./database";

export type { StoryEntry };

const MAX_HISTORY_ENTRIES = 50;

/**
 * Save a story and enforce history limit.
 * Fully transactional + Android-safe.
 */
export async function saveStory(
  seed: string,
  story: StoryLine[]
): Promise<StoryEntry> {
  const db = await getDatabase();

  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  const storyJson = JSON.stringify(story);

  await db.withTransactionAsync(async () => {
    // Insert new story
    await db.runAsync(
      `INSERT INTO stories (id, seed, created_at, story_json)
       VALUES (?, ?, ?, ?)`,
      [id, seed, createdAt, storyJson]
    );

    // Get the most recent IDs we want to keep
    const ids = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM stories
       ORDER BY created_at DESC
       LIMIT ?`,
      [MAX_HISTORY_ENTRIES]
    );

    if (ids.length === 0) return;

    // Delete everything else (Android-safe)
    const placeholders = ids.map(() => "?").join(",");
    await db.runAsync(
      `DELETE FROM stories
       WHERE id NOT IN (${placeholders})`,
      ids.map(r => r.id)
    );
  });

  return { id, seed, createdAt, story };
}

/**
 * Get recent story history.
 */
export async function getHistory(): Promise<StoryEntry[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    id: string;
    seed: string;
    created_at: string;
    story_json: string;
  }>(
    `SELECT *
     FROM stories
     ORDER BY created_at DESC
     LIMIT ?`,
    [MAX_HISTORY_ENTRIES]
  );

  return rows.map(row => ({
    id: row.id,
    seed: row.seed,
    createdAt: row.created_at,
    story: JSON.parse(row.story_json) as StoryLine[],
  }));
}

/**
 * Get a story by ID.
 */
export async function getStoryById(id: string): Promise<StoryEntry | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    id: string;
    seed: string;
    created_at: string;
    story_json: string;
  }>(
    `SELECT *
     FROM stories
     WHERE id = ?`,
    [id]
  );

  if (!row) return null;

  return {
    id: row.id,
    seed: row.seed,
    createdAt: row.created_at,
    story: JSON.parse(row.story_json) as StoryLine[],
  };
}

/**
 * Get the most recent story.
 */
export async function getLatestStory(): Promise<StoryEntry | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    id: string;
    seed: string;
    created_at: string;
    story_json: string;
  }>(
    `SELECT *
     FROM stories
     ORDER BY created_at DESC
     LIMIT 1`
  );

  if (!row) return null;

  return {
    id: row.id,
    seed: row.seed,
    createdAt: row.created_at,
    story: JSON.parse(row.story_json) as StoryLine[],
  };
}

/**
 * Delete a single story.
 */
export async function deleteStory(id: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `DELETE FROM stories
     WHERE id = ?`,
    [id]
  );
}

/**
 * Clear all history.
 */
export async function clearHistory(): Promise<void> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM stories`);
  });
}
