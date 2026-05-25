import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM announcements ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, category = "info", audience = "all", file_url = "", color = "" } = body;
  if (!title || !content) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO announcements (title, content, category, audience, file_url, color) VALUES (?, ?, ?, ?, ?, ?)")
    .run(title, content, category, audience, file_url, color);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
