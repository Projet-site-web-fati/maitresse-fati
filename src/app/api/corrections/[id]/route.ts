import { NextRequest, NextResponse } from "next/server";
import { deleteCorrection } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    
    await db.execute({
      sql: `UPDATE corrections 
            SET title=?, dictee_text=?, correction=?, bareme=?, notes=?, level=?, week_number=?, file_url=?, color=? 
            WHERE id=?`,
      args: [
        body.title,
        body.dictee_text,
        body.correction,
        body.bareme || null,
        body.notes || null,
        body.level,
        body.week_number || null,
        body.file_url || "",
        body.color || "",
        parseInt(id),
      ],
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
    await deleteCorrection(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
