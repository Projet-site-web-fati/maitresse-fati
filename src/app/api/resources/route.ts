import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM resources ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description = "", level, subject, type = "fiche", is_private = 0, file_url = "", color = "" } = body;
  if (!title || !level || !subject)
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO resources (title, description, level, subject, type, is_private, file_url, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(title, description, level, subject, type, is_private ? 1 : 0, file_url, color);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
