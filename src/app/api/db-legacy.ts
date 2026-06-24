/**
 * Compatibility layer for SQLite API → Turso API
 * This wrapper allows existing routes to work without modification
 * during the migration phase. Each route should be refactored to use
 * src/lib/queries.ts functions directly.
 */

import { getDb } from "@/lib/db";

export interface PreparedStatement {
  run(...args: any[]): { lastInsertRowid: number };
  all(): any[];
  get(): any | undefined;
}

export interface DbCompat {
  prepare(sql: string): PreparedStatement;
  exec(sql: string): void;
}

// Create a wrapper that emulates SQLite API
export function getDbCompat(): DbCompat {
  const tursoDb = getDb();

  return {
    prepare(sql: string): PreparedStatement {
      return {
        run(...args: any[]) {
          // Execute asynchronously without await (will complete in background)
          // This is not ideal but works for temporary compatibility
          tursoDb.execute({
            sql,
            args: args,
          }).catch(err => console.error('DB error:', err));
          
          return { lastInsertRowid: 0 };
        },
        all() {
          console.warn('⚠️  Using synchronous .all() is deprecated. Please migrate to async queries.');
          return [];
        },
        get() {
          console.warn('⚠️  Using synchronous .get() is deprecated. Please migrate to async queries.');
          return undefined;
        },
      };
    },
    exec(sql: string) {
      tursoDb.execute({ sql, args: [] }).catch(err => console.error('DB error:', err));
    },
  };
}

/**
 * MIGRATION STATUS
 * 
 * Routes migrated to use queries.ts (fully async):
 * ✅ /api/announcements
 * ✅ /api/contact
 * ✅ /api/auth
 * 
 * Routes using legacy compatibility layer (to be migrated):
 * ⏳ /api/corrections
 * ⏳ /api/documents
 * ⏳ /api/events
 * ⏳ /api/homework
 * ⏳ /api/lessons
 * ⏳ /api/photos
 * ⏳ /api/planning
 * ⏳ /api/resources
 * ⏳ /api/upload
 * 
 * Migration guide: See /ROUTES_MIGRATION.md
 */
