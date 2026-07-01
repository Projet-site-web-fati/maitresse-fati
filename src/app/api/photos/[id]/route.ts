import { NextRequest, NextResponse } from "next/server";
import { deletePhoto } from "@/lib/queries";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    await db.execute({
      sql: `UPDATE photos SET title=?, description=?, album=?, image_url=? WHERE id=?`,
      args: [body.title, body.description, body.album, body.image_url, parseInt(id)],
    });
    revalidatePath("/galerie");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePhoto(parseInt(id));
    revalidatePath("/galerie");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
