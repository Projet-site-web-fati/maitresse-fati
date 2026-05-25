import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM photos ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description = "", album, image_url = "/images/placeholder-class.jpg" } = body;
  if (!title || !album) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const db = getDb();
  const result = db
    .prepare("INSERT INTO photos (title, description, album, image_url) VALUES (?, ?, ?, ?)")
    .run(title, description, album, image_url);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
