import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  db.prepare("UPDATE resources SET title=?, description=?, level=?, subject=?, type=?, is_private=?, file_url=?, color=? WHERE id=?")
    .run(body.title, body.description, body.level, body.subject, body.type, body.is_private ? 1 : 0, body.file_url ?? "", body.color ?? "", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM resources WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
