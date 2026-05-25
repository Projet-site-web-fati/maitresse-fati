import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  db.prepare("UPDATE lessons SET title=?, content=?, subject=?, level=?, chapter=?, file_url=?, color=? WHERE id=?")
    .run(body.title, body.content, body.subject, body.level, body.chapter ?? "", body.file_url ?? "", body.color ?? "", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM lessons WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
