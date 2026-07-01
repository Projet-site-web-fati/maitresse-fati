#!/usr/bin/env node
"use strict";
/**
 * Generate SQL INSERT statements from local SQLite
 * Output can be run directly on Turso via HTTP
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DB_PATH = path_1.default.join(process.cwd(), 'data', 'maitresse-fati.db');
const OUTPUT_PATH = path_1.default.join(process.cwd(), 'scripts', 'migration.sql');
if (!fs_1.default.existsSync(DB_PATH)) {
    console.error(`❌ Database not found: ${DB_PATH}`);
    process.exit(1);
}
const db = new better_sqlite3_1.default(DB_PATH, { readonly: true });
const tables = ['announcements', 'resources', 'homework', 'photos', 'contacts', 'planning', 'corrections', 'lessons', 'events', 'documents', 'settings', 'admin_users'];
let sql = '-- Turso Migration SQL\n-- Generated from SQLite local database\n\n';
let totalRecords = 0;
for (const table of tables) {
    try {
        const rows = db.prepare(`SELECT * FROM ${table}`).all();
        if (rows.length === 0) {
            sql += `-- ${table}: 0 records\n`;
            continue;
        }
        sql += `-- ${table}: ${rows.length} records\n`;
        for (const row of rows) {
            const cols = Object.keys(row);
            const vals = cols.map(c => {
                const v = row[c];
                if (v === null)
                    return 'NULL';
                if (typeof v === 'number')
                    return v.toString();
                if (typeof v === 'string')
                    return `'${v.replace(/'/g, "''")}'`;
                return `'${v}'`;
            });
            sql += `INSERT OR IGNORE INTO ${table}(${cols.join(',')}) VALUES(${vals.join(',')});\n`;
            totalRecords++;
        }
        sql += '\n';
    }
    catch (e) {
        console.warn(`⚠️  ${table}: ${e.message}`);
    }
}
db.close();
fs_1.default.writeFileSync(OUTPUT_PATH, sql);
console.log(`✅ Generated migration.sql with ${totalRecords} INSERT statements`);
console.log(`📄 File: ${OUTPUT_PATH}`);
console.log(`\n📋 Total records: ${totalRecords}`);
