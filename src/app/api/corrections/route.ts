import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM corrections ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, dictee_text, correction, bareme = "", notes = "", level, week_number = null, file_url = "", color = "" } = body;
  if (!title || !dictee_text || !correction || !level)
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO corrections (title, dictee_text, correction, bareme, notes, level, week_number, file_url, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(title, dictee_text, correction, bareme, notes, level, week_number, file_url, color);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
