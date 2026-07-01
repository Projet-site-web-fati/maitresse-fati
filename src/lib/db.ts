/**
 * Turso DB client — utilise @libsql/client/web (HTTP uniquement, pas de binaires natifs)
 * Inspiré du projet ExpenseShare
 */

import { createClient } from '@libsql/client/web';

// Convertit une ligne (array) en objet plain
function rowToObj(row: any, columns: string[]): Record<string, any> {
  const obj: Record<string, any> = {};
  columns.forEach((col, i) => { obj[col] = row[i]; });
  return obj;
}

// Wrapper qui expose la même interface que l'ancien client
// mais convertit automatiquement les rows en objets
class TursoClient {
  private client: ReturnType<typeof createClient>;

  constructor(url: string, authToken: string) {
    this.client = createClient({ url, authToken });
  }

  async execute(request: string | { sql: string; args?: any[] }): Promise<any> {
    const result = await this.client.execute(request as any);
    return {
      ...result,
      rows: result.rows.map((row: any) => rowToObj(row as any, result.columns)),
    };
  }

  async batch(statements: (string | { sql: string; args?: any[] })[]): Promise<any[]> {
    return this.client.batch(statements as any[]);
  }
}

export type Client = TursoClient;

let db: TursoClient | null = null;

export function getDb(): TursoClient {
  if (!db) {
    const connectionUrl = process.env.TURSO_CONNECTION_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!connectionUrl || !authToken) {
      throw new Error(
        'Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables'
      );
    }

    db = new TursoClient(connectionUrl, authToken);

    // Initialize schema on first use
    initSchema().catch((err) => {
      console.error('Failed to initialize schema:', err);
      process.exit(1);
    });
  }
  return db;
}

async function initSchema() {
  const db = getDb();
  try {
    await db.batch([
      `CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'info',
        audience TEXT NOT NULL DEFAULT 'all',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_url TEXT,
        color TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT NOT NULL,
        subject TEXT NOT NULL,
        type TEXT DEFAULT 'fiche',
        file_url TEXT,
        is_private INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        color TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS homework (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        level TEXT NOT NULL,
        due_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_url TEXT,
        color TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        album TEXT,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        subject TEXT,
        message TEXT,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS planning (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        period TEXT,
        subject TEXT,
        level TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_url TEXT,
        color TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS corrections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        dictee_text TEXT,
        correction TEXT,
        bareme TEXT,
        notes TEXT,
        level TEXT,
        week_number INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_url TEXT,
        color TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        subject TEXT,
        level TEXT,
        chapter TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_url TEXT,
        color TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        event_date DATE NOT NULL,
        event_type TEXT DEFAULT 'other',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_url TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        file_url TEXT NOT NULL,
        icon TEXT DEFAULT '📄',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_size INTEGER,
        file_type TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ]);
  } catch (err: any) {
    console.error('Schema init error:', err.message);
    throw err;
  }
}
