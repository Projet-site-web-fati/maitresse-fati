import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
import { createClient } from '@libsql/client/web'

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  const r = await db.execute('SELECT key, value FROM settings')
  console.log('\n📋 Table settings:')
  r.rows.forEach((row: any) => console.log(' ', row[0], '=', row[1]))

  const counts = await db.batch([
    'SELECT COUNT(*) FROM announcements',
    'SELECT COUNT(*) FROM homework',
    'SELECT COUNT(*) FROM resources',
    'SELECT COUNT(*) FROM lessons',
    'SELECT COUNT(*) FROM events',
    'SELECT COUNT(*) FROM documents',
    'SELECT COUNT(*) FROM photos',
    'SELECT COUNT(*) FROM planning',
    'SELECT COUNT(*) FROM corrections',
  ])
  const tables = ['announcements','homework','resources','lessons','events','documents','photos','planning','corrections']
  console.log('\n📊 Enregistrements dans Turso:')
  counts.forEach((r: any, i: number) => console.log(' ', tables[i], ':', r.rows[0][0]))
}

main().catch(console.error)
