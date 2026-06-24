"use strict";
/**
 * Migration Script: SQLite Local → Turso
 *
 * Usage:
 * 1. Copy data/maitresse-fati.db to backup (if exists)
 * 2. npx ts-node scripts/migrate.ts
 * 3. Verify Turso database on turso.tech
 *
 * This script:
 * - Reads ALL data from local SQLite DB
 * - Inserts into Turso
 * - Does NOT delete local DB (safe for rollback)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@libsql/client");
const fs_1 = __importDefault(require("fs"));
const localDbPath = path_1.default.join(process.cwd(), 'data', 'maitresse-fati.db');
async function migrate() {
    console.log('🚀 Starting migration: SQLite → Turso\n');
    // Validate environment variables
    const connectionUrl = process.env.TURSO_CONNECTION_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!connectionUrl || !authToken) {
        console.error('❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN environment variables');
        process.exit(1);
    }
    // Check if local DB exists
    if (!fs_1.default.existsSync(localDbPath)) {
        console.warn(`⚠️  Local DB not found at ${localDbPath}. Migration skipped.`);
        return;
    }
    // Connect to both databases
    const localDb = new better_sqlite3_1.default(localDbPath);
    const tursoDb = (0, client_1.createClient)({
        url: connectionUrl,
        authToken: authToken,
    });
    const stats = {
        announcements: 0,
        resources: 0,
        homework: 0,
        photos: 0,
        contacts: 0,
        planning: 0,
        corrections: 0,
        lessons: 0,
        events: 0,
        documents: 0,
        settings: 0,
        total: 0,
    };
    try {
        console.log('📋 Reading data from local SQLite...\n');
        // Announcements
        const announcements = localDb
            .prepare('SELECT * FROM announcements')
            .all();
        if (announcements.length > 0) {
            for (const row of announcements) {
                await tursoDb.execute({
                    sql: `INSERT INTO announcements (id, title, content, category, audience, file_url, color, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.content,
                        row.category,
                        row.audience,
                        row.file_url || null,
                        row.color || null,
                        row.created_at,
                        row.updated_at,
                    ],
                });
            }
            stats.announcements = announcements.length;
            console.log(`  ✅ Announcements: ${announcements.length}`);
        }
        // Resources
        const resources = localDb.prepare('SELECT * FROM resources').all();
        if (resources.length > 0) {
            for (const row of resources) {
                await tursoDb.execute({
                    sql: `INSERT INTO resources (id, title, description, level, subject, type, file_url, color, is_private, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.description || null,
                        row.level,
                        row.subject,
                        row.type,
                        row.file_url || null,
                        row.color || null,
                        row.is_private,
                        row.created_at,
                    ],
                });
            }
            stats.resources = resources.length;
            console.log(`  ✅ Resources: ${resources.length}`);
        }
        // Homework
        const homework = localDb.prepare('SELECT * FROM homework').all();
        if (homework.length > 0) {
            for (const row of homework) {
                await tursoDb.execute({
                    sql: `INSERT INTO homework (id, title, description, subject, level, due_date, file_url, color, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.description || null,
                        row.subject,
                        row.level,
                        row.due_date,
                        row.file_url || null,
                        row.color || null,
                        row.created_at,
                    ],
                });
            }
            stats.homework = homework.length;
            console.log(`  ✅ Homework: ${homework.length}`);
        }
        // Photos
        const photos = localDb.prepare('SELECT * FROM photos').all();
        if (photos.length > 0) {
            for (const row of photos) {
                await tursoDb.execute({
                    sql: `INSERT INTO photos (id, title, description, album, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.description || null,
                        row.album,
                        row.image_url,
                        row.created_at,
                    ],
                });
            }
            stats.photos = photos.length;
            console.log(`  ✅ Photos: ${photos.length}`);
        }
        // Contacts
        const contacts = localDb.prepare('SELECT * FROM contacts').all();
        if (contacts.length > 0) {
            for (const row of contacts) {
                await tursoDb.execute({
                    sql: `INSERT INTO contacts (id, name, email, subject, message, is_read, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.name,
                        row.email,
                        row.subject,
                        row.message,
                        row.is_read,
                        row.created_at,
                    ],
                });
            }
            stats.contacts = contacts.length;
            console.log(`  ✅ Contacts: ${contacts.length}`);
        }
        // Planning
        const planning = localDb.prepare('SELECT * FROM planning').all();
        if (planning.length > 0) {
            for (const row of planning) {
                await tursoDb.execute({
                    sql: `INSERT INTO planning (id, title, content, period, subject, level, file_url, color, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.content,
                        row.period,
                        row.subject,
                        row.level,
                        row.file_url || null,
                        row.color || null,
                        row.created_at,
                    ],
                });
            }
            stats.planning = planning.length;
            console.log(`  ✅ Planning: ${planning.length}`);
        }
        // Corrections
        const corrections = localDb
            .prepare('SELECT * FROM corrections')
            .all();
        if (corrections.length > 0) {
            for (const row of corrections) {
                await tursoDb.execute({
                    sql: `INSERT INTO corrections (id, title, dictee_text, correction, bareme, notes, level, week_number, file_url, color, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.dictee_text,
                        row.correction,
                        row.bareme || null,
                        row.notes || null,
                        row.level,
                        row.week_number || null,
                        row.file_url || null,
                        row.color || null,
                        row.created_at,
                    ],
                });
            }
            stats.corrections = corrections.length;
            console.log(`  ✅ Corrections: ${corrections.length}`);
        }
        // Lessons
        const lessons = localDb.prepare('SELECT * FROM lessons').all();
        if (lessons.length > 0) {
            for (const row of lessons) {
                await tursoDb.execute({
                    sql: `INSERT INTO lessons (id, title, content, subject, level, chapter, file_url, color, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.content,
                        row.subject,
                        row.level,
                        row.chapter || null,
                        row.file_url || null,
                        row.color || null,
                        row.created_at,
                    ],
                });
            }
            stats.lessons = lessons.length;
            console.log(`  ✅ Lessons: ${lessons.length}`);
        }
        // Events
        const events = localDb.prepare('SELECT * FROM events').all();
        if (events.length > 0) {
            for (const row of events) {
                await tursoDb.execute({
                    sql: `INSERT INTO events (id, title, event_date, event_type, file_url, color, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.event_date,
                        row.event_type,
                        row.file_url || null,
                        row.color || null,
                        row.created_at,
                    ],
                });
            }
            stats.events = events.length;
            console.log(`  ✅ Events: ${events.length}`);
        }
        // Documents
        const documents = localDb
            .prepare('SELECT * FROM documents')
            .all();
        if (documents.length > 0) {
            for (const row of documents) {
                await tursoDb.execute({
                    sql: `INSERT INTO documents (id, title, file_url, icon, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
                    args: [
                        row.id,
                        row.title,
                        row.file_url || null,
                        row.icon || '📄',
                        row.created_at,
                    ],
                });
            }
            stats.documents = documents.length;
            console.log(`  ✅ Documents: ${documents.length}`);
        }
        // Settings
        const settings = localDb.prepare('SELECT * FROM settings').all();
        if (settings.length > 0) {
            for (const row of settings) {
                await tursoDb.execute({
                    sql: `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)`,
                    args: [row.key, row.value, row.updated_at],
                });
            }
            stats.settings = settings.length;
            console.log(`  ✅ Settings: ${settings.length}`);
        }
        // Calculate total
        const total = stats.announcements + stats.resources + stats.homework + stats.photos +
            stats.contacts + stats.planning + stats.corrections + stats.lessons +
            stats.events + stats.documents + stats.settings;
        stats.total = total;
        console.log('\n📊 Migration Summary:');
        console.log('='.repeat(50));
        console.log(`  Announcements:  ${stats.announcements}`);
        console.log(`  Resources:      ${stats.resources}`);
        console.log(`  Homework:       ${stats.homework}`);
        console.log(`  Photos:         ${stats.photos}`);
        console.log(`  Contacts:       ${stats.contacts}`);
        console.log(`  Planning:       ${stats.planning}`);
        console.log(`  Corrections:    ${stats.corrections}`);
        console.log(`  Lessons:        ${stats.lessons}`);
        console.log(`  Events:         ${stats.events}`);
        console.log(`  Documents:      ${stats.documents}`);
        console.log(`  Settings:       ${stats.settings}`);
        console.log('='.repeat(50));
        console.log(`  TOTAL:          ${stats.announcements + stats.resources + stats.homework + stats.photos + stats.contacts + stats.planning + stats.corrections + stats.lessons + stats.events + stats.documents + stats.settings} records`);
        console.log('\n✅ Migration completed successfully!');
        console.log('\n📌 Next steps:');
        console.log('   1. Verify data in Turso console: https://turso.tech');
        console.log('   2. Add environment variables to Vercel:');
        console.log('      - TURSO_CONNECTION_URL');
        console.log('      - TURSO_AUTH_TOKEN');
        console.log('      - B2_KEY_ID');
        console.log('      - B2_APPLICATION_KEY');
        console.log('      - B2_BUCKET_ID');
        console.log('      - B2_ENDPOINT');
        console.log('   3. Deploy: git push to trigger Vercel build');
        localDb.close();
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        localDb.close();
        process.exit(1);
    }
}
// Run migration
migrate();
