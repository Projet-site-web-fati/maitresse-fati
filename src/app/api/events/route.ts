import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM events ORDER BY event_date ASC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, event_date, event_type = "info", file_url = "" } = body;
  if (!title || !event_date)
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO events (title, event_date, event_type, file_url) VALUES (?, ?, ?, ?)")
    .run(title, event_date, event_type, file_url);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
