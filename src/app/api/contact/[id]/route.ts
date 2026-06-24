import { NextRequest, NextResponse } from "next/server";
import { markContactAsRead, deleteContact } from "@/lib/queries";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await markContactAsRead(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteContact(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
