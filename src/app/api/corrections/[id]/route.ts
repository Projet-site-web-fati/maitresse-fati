import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  db.prepare("UPDATE corrections SET title=?, dictee_text=?, correction=?, bareme=?, notes=?, level=?, week_number=?, file_url=?, color=? WHERE id=?")
    .run(body.title, body.dictee_text, body.correction, body.bareme, body.notes, body.level, body.week_number, body.file_url ?? "", body.color ?? "", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM corrections WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
