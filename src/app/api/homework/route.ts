import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM homework ORDER BY due_date ASC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description = "", subject, level, due_date, file_url = "", color = "" } = body;
  if (!title || !subject || !level || !due_date)
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO homework (title, description, subject, level, due_date, file_url, color) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(title, description, subject, level, due_date, file_url, color);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
