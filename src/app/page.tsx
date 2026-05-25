import HomeClient from "./HomeClient";
import { getDb } from "@/lib/db";

export default function Home() {
  const db = getDb();
  const announcements = db
    .prepare("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 4")
    .all() as Array<{ id: number; title: string; content: string; category: string; audience: string; created_at: string }>;
  const homeworks = db
    .prepare("SELECT * FROM homework ORDER BY due_date ASC LIMIT 4")
    .all() as Array<{ id: number; title: string; subject: string; level: string; due_date: string }>;

  return <HomeClient announcements={announcements} homeworks={homeworks} />;
}
