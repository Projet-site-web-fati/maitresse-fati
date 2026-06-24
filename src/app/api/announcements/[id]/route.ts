import { NextRequest, NextResponse } from "next/server";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/queries";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await updateAnnouncement(parseInt(id), {
      title: body.title,
      content: body.content,
      category: body.category,
      audience: body.audience,
      file_url: body.file_url || "",
      color: body.color || "",
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAnnouncement(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
