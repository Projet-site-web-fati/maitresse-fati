import { NextRequest, NextResponse } from "next/server";
import { deleteResource } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    await db.execute({
      sql: `UPDATE resources SET title=?, description=?, level=?, subject=?, type=?, is_private=?, file_url=?, color=? WHERE id=?`,
      args: [body.title, body.description, body.level, body.subject, body.type, body.is_private ? 1 : 0, body.file_url || "", body.color || "", parseInt(id)],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteResource(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
