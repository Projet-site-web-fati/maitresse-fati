import { NextRequest, NextResponse } from "next/server";
import { getResources, createResource } from "@/lib/queries";

export async function GET() {
  try {
    const resources = await getResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description = "", level, subject, type = "fiche", is_private = 0, file_url = "", color = "" } = body;
    if (!title || !level || !subject)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    await createResource({ title, description, level, subject, type, is_private: is_private ? 1 : 0, file_url, color });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
