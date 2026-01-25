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
    console.warn("DB init failed, retrying once...", err);
    db = null;

    await new Promise(r => setTimeout(r, 100));
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(db);
    return db;
  }
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
    await database.withTransactionAsync(async () => {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      seed TEXT NOT NULL,
      created_at TEXT NOT NULL,
      story_json TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS image_cache (
      prompt_hash TEXT PRIMARY KEY,
      image_data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_image_cache_created_at ON image_cache(created_at DESC);
  `);
    });
}

// Simple hash function for cache keys
export function hashPrompt(prompt: string): string {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
