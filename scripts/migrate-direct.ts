#!/usr/bin/env node

/**
 * Migration Script: SQLite Local → Turso Cloud
 * Reads data from local SQLite, sends to Turso via HTTP API
 * 
 * Usage: npx tsx scripts/migrate-direct.ts
 * Or: node scripts/migrate-direct.js (after compilation)
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=');
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
}

let TURSO_URL = process.env.TURSO_CONNECTION_URL || '';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const DB_PATH = path.join(process.cwd(), 'data', 'maitresse-fati.db');

// Convert libsql:// to https://
if (TURSO_URL.startsWith('libsql://')) {
  TURSO_URL = TURSO_URL.replace(/^libsql:\/\//, 'https://');
}

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN in .env.local');
  process.exit(1);
}

if (!fs.existsSync(DB_PATH)) {
  console.error(`❌ Database not found: ${DB_PATH}`);
  process.exit(1);
}

type TableName = 'announcements' | 'resources' | 'homework' | 'photos' | 'contacts' | 'planning' | 'corrections' | 'lessons' | 'events' | 'documents' | 'settings' | 'admin_users';
const TABLES: TableName[] = ['announcements', 'resources', 'homework', 'photos', 'contacts', 'planning', 'corrections', 'lessons', 'events', 'documents', 'settings', 'admin_users'];

async function migrateTable(db: Database.Database, table: TableName): Promise<number> {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all() as any[];
    if (!rows.length) {
      console.log(`⏭️  ${table}: 0 records`);
      return 0;
    }

    let success = 0;
    for (const row of rows) {
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const placeholders = cols.map(() => '?').join(',');
      const sql = `INSERT OR IGNORE INTO ${table}(${cols.join(',')}) VALUES(${placeholders})`;

      try {
        const response = await fetch(`${TURSO_URL}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TURSO_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            statements: [{ sql, args: vals }],
          }),
        });

        if (response.ok) success++;
      } catch (e) {
        // Continue on error
      }
    }

    console.log(`✅ ${table}: ${success}/${rows.length}`);
    return success;
  } catch (e: any) {
    console.warn(`⚠️  ${table}: ${e.message}`);
    return 0;
  }
}

async function main() {
  console.log('🚀 Turso Migration Started\n');
  const db = new Database(DB_PATH, { readonly: true });
  let total = 0;

  for (const table of TABLES) {
    const count = await migrateTable(db, table);
    total += count;
  }

  db.close();
  console.log(`\n✅ Migration complete: ${total} records\n`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
