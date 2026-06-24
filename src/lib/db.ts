import { createClient, Client } from '@libsql/client';

let db: Client | null = null;

export function getDb(): Client {
  if (!db) {
    const connectionUrl = process.env.TURSO_CONNECTION_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!connectionUrl || !authToken) {
      throw new Error(
        'Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables'
      );
    }

    db = createClient({
      url: connectionUrl,
      authToken: authToken,
    });

    initSchema().catch(err => {
      console.error('Failed to initialize schema:', err);
      process.exit(1);
    });
  }
  return db;
}

async function initSchema() {
  const db = getDb();
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'info',
        audience TEXT NOT NULL DEFAULT 'all',
        file_url TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT NOT NULL,
        subject TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'fiche',
        file_url TEXT,
        color TEXT,
        is_private INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS homework (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        level TEXT NOT NULL,
        due_date DATE NOT NULL,
        file_url TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        album TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS planning (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        period TEXT NOT NULL,
        subject TEXT NOT NULL,
        level TEXT NOT NULL,
        file_url TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS corrections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        dictee_text TEXT NOT NULL,
        correction TEXT NOT NULL,
        bareme TEXT,
        notes TEXT,
        level TEXT NOT NULL,
        week_number INTEGER,
        file_url TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        subject TEXT NOT NULL,
        level TEXT NOT NULL,
        chapter TEXT,
        file_url TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        event_date TEXT NOT NULL,
        event_type TEXT NOT NULL DEFAULT 'info',
        file_url TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        file_url TEXT,
        icon TEXT DEFAULT '📄',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure teacher password exists
    const settingsCheck = await db.execute(
      "SELECT key FROM settings WHERE key = 'teacher_password'"
    );
    if (settingsCheck.rows.length === 0) {
      await db.execute(
        "INSERT INTO settings (key, value) VALUES ('teacher_password', 'fati2025')"
      );
    }

    console.log('✅ Turso schema initialized successfully');
  } catch (error) {
    console.error('❌ Schema initialization error:', error);
    throw error;
  }
}

// Wrapper functions for common operations
export async function query(sql: string, params?: any[]) {
  const db = getDb();
  try {
    const result = await db.execute({
      sql,
      args: params || [],
    });
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export async function execute(sql: string, params?: any[]) {
  const db = getDb();
  try {
    await db.execute({
      sql,
      args: params || [],
    });
  } catch (error) {
    console.error('Execute error:', error);
    throw error;
  }
}
