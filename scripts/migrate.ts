/**
 * Script de migration: SQLite local → Turso Cloud
 *
 * Utilise @libsql/client/web (pas de binaires natifs requis)
 * Inspiré du projet ExpenseShare (migrate-from-supabase.ts)
 *
 * Exécution :
 *   npx ts-node --project tsconfig.json scripts/migrate.ts
 *   — ou —
 *   npx tsx scripts/migrate.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import Database from 'better-sqlite3'
import { createClient } from '@libsql/client/web'
import * as fs from 'fs'

// ─── Clients ─────────────────────────────────────────────────────────────────

const LOCAL_DB_PATH = path.resolve(__dirname, '../data/maitresse-fati.db')

const turso = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) { console.log(`[migration] ${msg}`) }
function warn(msg: string) { console.warn(`[migration] ⚠  ${msg}`) }

// ─── Création des tables Turso ────────────────────────────────────────────────

async function createTables() {
  log('Création des tables Turso...')
  await turso.batch([
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
  ])
  log('Tables créées ✅')
}

// ─── Migration d'une table ────────────────────────────────────────────────────

async function migrateTable(
  localDb: Database.Database,
  tableName: string
): Promise<number> {
  let rows: Record<string, any>[]

  try {
    rows = localDb.prepare(`SELECT * FROM ${tableName}`).all() as Record<string, any>[]
  } catch (e: any) {
    warn(`Table ${tableName} non trouvée dans SQLite: ${e.message}`)
    return 0
  }

  if (rows.length === 0) {
    log(`${tableName}: 0 enregistrements (ignoré)`)
    return 0
  }

  let inserted = 0
  for (const row of rows) {
    const cols = Object.keys(row)
    const vals = Object.values(row)
    const placeholders = cols.map(() => '?').join(', ')
    const sql = `INSERT OR IGNORE INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`

    try {
      await turso.execute({ sql, args: vals })
      inserted++
    } catch (e: any) {
      warn(`  Erreur INSERT dans ${tableName}: ${e.message}`)
    }
  }

  log(`${tableName}: ${inserted}/${rows.length} enregistrements migrés ✅`)
  return inserted
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Migration SQLite → Turso\n')

  if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ Variables TURSO_CONNECTION_URL et TURSO_AUTH_TOKEN manquantes')
    process.exit(1)
  }

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    console.error(`❌ Base de données locale introuvable: ${LOCAL_DB_PATH}`)
    process.exit(1)
  }

  log(`Base source: ${LOCAL_DB_PATH}`)
  log(`Destination: ${process.env.TURSO_CONNECTION_URL}\n`)

  const localDb = new Database(LOCAL_DB_PATH, { readonly: true })

  // Créer les tables Turso
  await createTables()

  const tables = [
    'announcements', 'resources', 'homework', 'photos',
    'contacts', 'planning', 'corrections', 'lessons',
    'events', 'documents', 'settings', 'admin_users',
  ]

  let total = 0
  for (const table of tables) {
    const count = await migrateTable(localDb, table)
    total += count
  }

  localDb.close()

  console.log(`\n✅ Migration terminée: ${total} enregistrements transférés vers Turso`)
  console.log('🔗 Vérifiez sur https://platform.turso.tech\n')
}

main().catch((e) => {
  console.error('❌ Erreur:', e.message)
  process.exit(1)
})
