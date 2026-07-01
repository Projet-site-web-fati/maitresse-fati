#!/usr/bin/env node

/**
 * Generate SQL INSERT statements from local SQLite
 * Output can be run directly on Turso via HTTP
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'maitresse-fati.db');
const OUTPUT_PATH = path.join(process.cwd(), 'scripts', 'migration.sql');

if (!fs.existsSync(DB_PATH)) {
  console.error(`❌ Database not found: ${DB_PATH}`);
  process.exit(1);
}

const db = new Database(DB_PATH, { readonly: true });
const tables = ['announcements', 'resources', 'homework', 'photos', 'contacts', 'planning', 'corrections', 'lessons', 'events', 'documents', 'settings', 'admin_users'];

let sql = '-- Turso Migration SQL\n-- Generated from SQLite local database\n\n';

let totalRecords = 0;

for (const table of tables) {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all() as any[];
    
    if (rows.length === 0) {
      sql += `-- ${table}: 0 records\n`;
      continue;
    }

    sql += `-- ${table}: ${rows.length} records\n`;

    for (const row of rows) {
      const cols = Object.keys(row);
      const vals = cols.map(c => {
        const v = row[c];
        if (v === null) return 'NULL';
        if (typeof v === 'number') return v.toString();
        if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
        return `'${v}'`;
      });

      sql += `INSERT OR IGNORE INTO ${table}(${cols.join(',')}) VALUES(${vals.join(',')});\n`;
      totalRecords++;
    }
    sql += '\n';
  } catch (e: any) {
    console.warn(`⚠️  ${table}: ${e.message}`);
  }
}

db.close();

fs.writeFileSync(OUTPUT_PATH, sql);
console.log(`✅ Generated migration.sql with ${totalRecords} INSERT statements`);
console.log(`📄 File: ${OUTPUT_PATH}`);
console.log(`\n📋 Total records: ${totalRecords}`);
