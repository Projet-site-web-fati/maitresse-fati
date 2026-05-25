import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM documents ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, file_url = "", icon = "📄" } = body;
  if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO documents (title, file_url, icon) VALUES (?, ?, ?)")
    .run(title, file_url, icon);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
