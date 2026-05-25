import { getDb } from "@/lib/db";
import ElevesClient from "./ElevesClient";

export default function ElevesPage() {
  const db = getDb();
  const homeworks = db
    .prepare("SELECT * FROM homework ORDER BY due_date ASC")
    .all() as Array<{ id: number; title: string; description: string; subject: string; level: string; due_date: string; file_url: string | null }>;
  const lessons = db
    .prepare("SELECT * FROM lessons ORDER BY created_at DESC")
    .all() as Array<{ id: number; title: string; content: string; subject: string; level: string; chapter: string; file_url: string | null }>;
  const resources = db
    .prepare("SELECT * FROM resources WHERE is_private = 0 ORDER BY created_at DESC")
    .all() as Array<{ id: number; title: string; description: string; level: string; subject: string; type: string; file_url: string | null }>;

  return <ElevesClient homeworks={homeworks} lessons={lessons} resources={resources} />;
}
