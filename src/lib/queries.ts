/**
 * Database Query Helpers
 * Abstracts Turso queries for easier API usage
 */

import { getDb } from './db';

// Types
interface DbResult<T = any> {
  rows: T[];
}

// Announcements
export async function getAnnouncements() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM announcements ORDER BY created_at DESC');
  return result.rows as any[];
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  category?: string;
  audience?: string;
  file_url?: string;
  color?: string;
}) {
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO announcements (title, content, category, audience, file_url, color) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.content,
      data.category || 'info',
      data.audience || 'all',
      data.file_url || null,
      data.color || null,
    ],
  });
  return result;
}

export async function getAnnouncementById(id: number) {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM announcements WHERE id = ?',
    args: [id],
  });
  return result.rows[0] || null;
}

export async function updateAnnouncement(
  id: number,
  data: Partial<{
    title: string;
    content: string;
    category: string;
    audience: string;
    file_url: string;
    color: string;
  }>
) {
  const db = getDb();
  const updates = Object.entries(data)
    .map(([key]) => `${key} = ?`)
    .join(', ');
  const values = Object.values(data);

  const result = await db.execute({
    sql: `UPDATE announcements SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [...values, id],
  });
  return result;
}

export async function deleteAnnouncement(id: number) {
  const db = getDb();
  const result = await db.execute({
    sql: 'DELETE FROM announcements WHERE id = ?',
    args: [id],
  });
  return result;
}

// Homework
export async function getHomework() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM homework ORDER BY due_date ASC');
  return result.rows as any[];
}

export async function createHomework(data: {
  title: string;
  description?: string;
  subject: string;
  level: string;
  due_date: string;
  file_url?: string;
  color?: string;
}) {
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO homework (title, description, subject, level, due_date, file_url, color) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.description || null,
      data.subject,
      data.level,
      data.due_date,
      data.file_url || null,
      data.color || null,
    ],
  });
  return result;
}

export async function getHomeworkById(id: number) {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM homework WHERE id = ?',
    args: [id],
  });
  return result.rows[0] || null;
}

export async function updateHomework(id: number, data: any) {
  const db = getDb();
  const updates = Object.entries(data)
    .map(([key]) => `${key} = ?`)
    .join(', ');
  const values = Object.values(data) as any[];

  const result = await db.execute({
    sql: `UPDATE homework SET ${updates} WHERE id = ?`,
    args: [...values, id] as any[],
  });
  return result;
}

export async function deleteHomework(id: number) {
  const db = getDb();
  const result = await db.execute({
    sql: 'DELETE FROM homework WHERE id = ?',
    args: [id],
  });
  return result;
}

// Resources
export async function getResources() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM resources ORDER BY created_at DESC');
  return result.rows as any[];
}

export async function createResource(data: any) {
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO resources (title, description, level, subject, type, file_url, color, is_private) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.description || null,
      data.level,
      data.subject,
      data.type || 'fiche',
      data.file_url || null,
      data.color || null,
      data.is_private ? 1 : 0,
    ],
  });
  return result;
}

export async function deleteResource(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM resources WHERE id = ?',
    args: [id],
  });
}

// Lessons
export async function getLessons() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM lessons ORDER BY created_at DESC');
  return result.rows as any[];
}

export async function createLesson(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO lessons (title, content, subject, level, chapter, file_url, color) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.content,
      data.subject,
      data.level,
      data.chapter || null,
      data.file_url || null,
      data.color || null,
    ],
  });
}

export async function deleteLesson(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM lessons WHERE id = ?',
    args: [id],
  });
}

// Corrections
export async function getCorrections() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM corrections ORDER BY week_number DESC');
  return result.rows as any[];
}

export async function createCorrection(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO corrections (title, dictee_text, correction, bareme, notes, level, week_number, file_url, color) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.dictee_text,
      data.correction,
      data.bareme || null,
      data.notes || null,
      data.level,
      data.week_number || null,
      data.file_url || null,
      data.color || null,
    ],
  });
}

export async function deleteCorrection(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM corrections WHERE id = ?',
    args: [id],
  });
}

// Planning
export async function getPlanning() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM planning ORDER BY created_at DESC');
  return result.rows as any[];
}

export async function createPlanning(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO planning (title, content, period, subject, level, file_url, color) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.content,
      data.period,
      data.subject,
      data.level,
      data.file_url || null,
      data.color || null,
    ],
  });
}

export async function deletePlanning(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM planning WHERE id = ?',
    args: [id],
  });
}

// Events
export async function getEvents() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM events ORDER BY event_date DESC');
  return result.rows as any[];
}

export async function createEvent(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO events (title, event_date, event_type, file_url, color) 
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.event_date,
      data.event_type || 'info',
      data.file_url || null,
      data.color || null,
    ],
  });
}

export async function deleteEvent(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM events WHERE id = ?',
    args: [id],
  });
}

// Photos
export async function getPhotos() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM photos ORDER BY album, created_at DESC');
  return result.rows as any[];
}

export async function createPhoto(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO photos (title, description, album, image_url) 
          VALUES (?, ?, ?, ?)`,
    args: [data.title, data.description || null, data.album, data.image_url],
  });
}

export async function deletePhoto(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM photos WHERE id = ?',
    args: [id],
  });
}

// Contacts
export async function getContacts() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC');
  return result.rows as any[];
}

export async function createContact(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO contacts (name, email, subject, message) 
          VALUES (?, ?, ?, ?)`,
    args: [data.name, data.email, data.subject, data.message],
  });
}

export async function markContactAsRead(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'UPDATE contacts SET is_read = 1 WHERE id = ?',
    args: [id],
  });
}

export async function deleteContact(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM contacts WHERE id = ?',
    args: [id],
  });
}

// Documents
export async function getDocuments() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM documents ORDER BY created_at DESC');
  return result.rows as any[];
}

export async function createDocument(data: any) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO documents (title, file_url, icon) 
          VALUES (?, ?, ?)`,
    args: [data.title, data.file_url || null, data.icon || '📄'],
  });
}

export async function deleteDocument(id: number) {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM documents WHERE id = ?',
    args: [id],
  });
}
