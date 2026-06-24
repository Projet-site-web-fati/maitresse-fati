import { NextRequest, NextResponse } from "next/server";
import { deletePlanning } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    await db.execute({
      sql: `UPDATE planning SET title=?, content=?, period=?, subject=?, level=?, file_url=?, color=? WHERE id=?`,
      args: [body.title, body.content, body.period, body.subject, body.level, body.file_url || "", body.color || "", parseInt(id)],
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
    await deletePlanning(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
