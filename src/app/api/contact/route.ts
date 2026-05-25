import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message)
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)")
    .run(name, email, subject, message);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
