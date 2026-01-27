import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "storyteller.db";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(db);
    return db;
  } catch (err) {
    console.warn("DB init failed, retrying once…", err);
    db = null;

    await new Promise(r => setTimeout(r, 100));

    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(db);
    return db;
  }
}

/**
 * Runs schema setup in a way that is safe on iOS + Android.
 * - WAL is attempted outside transactions (required on iOS)
 * - Each statement is executed independently
 * - Failures are logged instead of crashing the app
 */
async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  // Attempt WAL (non-fatal if it fails)
  try {
    await database.execAsync(`PRAGMA journal_mode = WAL;`);
  } catch (err) {
    console.warn("SQLite WAL mode failed, continuing without it", err);
  }

  await database.withTransactionAsync(async () => {
    try {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS stories (
          id TEXT PRIMARY KEY,
          seed TEXT NOT NULL,
          created_at TEXT NOT NULL,
          story_json TEXT NOT NULL
        );
      `);
    } catch (err) {
      console.error("Failed to create stories table", err);
    }

    try {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS image_cache (
          prompt_hash TEXT PRIMARY KEY,
          image_data TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    } catch (err) {
      console.error("Failed to create image_cache table", err);
    }

    try {
      await database.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_stories_created_at
        ON stories(created_at DESC);
      `);
    } catch (err) {
      console.error("Failed to create stories index", err);
    }

    try {
      await database.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_image_cache_created_at
        ON image_cache(created_at DESC);
      `);
    } catch (err) {
      console.error("Failed to create image_cache index", err);
    }
  });
}

// Simple deterministic hash for image cache keys
export function hashPrompt(prompt: string): string {
  let hash = 0;

  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // force 32-bit
  }

  return Math.abs(hash).toString(36);
}

export async function closeDatabase(): Promise<void> {
  if (!db) return;

  try {
    await db.closeAsync();
  } catch (err) {
    console.warn("Failed to close database", err);
  } finally {
    db = null;
  }
}
