import { getDb } from "@/lib/db";
import ParentsClient from "./ParentsClient";

export default function ParentsPage() {
  const db = getDb();
  const announcements = db
    .prepare("SELECT * FROM announcements WHERE audience IN ('all','parents') ORDER BY created_at DESC")
    .all() as Array<{ id: number; title: string; content: string; category: string; created_at: string; file_url?: string | null; color?: string | null }>;
  const homeworks = db
    .prepare("SELECT * FROM homework ORDER BY due_date ASC LIMIT 10")
    .all() as Array<{ id: number; title: string; subject: string; level: string; due_date: string; description: string; file_url?: string | null; color?: string | null }>;
  const events = db
    .prepare("SELECT * FROM events ORDER BY event_date ASC")
    .all() as Array<{ id: number; title: string; event_date: string; event_type: string }>;
  const documents = db
    .prepare("SELECT * FROM documents ORDER BY created_at DESC")
    .all() as Array<{ id: number; title: string; file_url: string | null; icon: string }>;

  return <ParentsClient announcements={announcements} homeworks={homeworks} events={events} documents={documents} />;
}
