import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import Database from 'better-sqlite3'
import { createClient } from '@libsql/client/web'
import * as fs from 'fs'

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const LOCAL_DB = path.resolve(__dirname, '../data/maitresse-fati.db')

async function main() {
  // 1) Ajouter la colonne icon si elle n'existe pas encore
  try {
    await db.execute("ALTER TABLE documents ADD COLUMN icon TEXT DEFAULT '📄'")
    console.log('✅ Colonne icon ajoutée à documents')
  } catch (e: any) {
    console.log('ℹ️  Colonne icon déjà présente (ou erreur ignorée):', e.message)
  }

  // 2) Migrer les documents
  const local = new Database(LOCAL_DB, { readonly: true })
  const rows = local.prepare('SELECT * FROM documents').all() as any[]
  local.close()

  let inserted = 0
  for (const row of rows) {
    const cols = Object.keys(row)
    const vals = Object.values(row)
    const placeholders = cols.map(() => '?').join(', ')
    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO documents (${cols.join(', ')}) VALUES (${placeholders})`,
        args: vals as any[],
      })
      inserted++
    } catch (e: any) {
      console.warn('  ⚠️ ', e.message)
    }
  }

  console.log(`✅ documents: ${inserted}/${rows.length} enregistrements migrés`)
}

main().catch(console.error)
