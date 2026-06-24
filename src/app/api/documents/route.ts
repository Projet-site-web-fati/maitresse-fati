import { NextRequest, NextResponse } from "next/server";
import { getDocuments, createDocument } from "@/lib/queries";

export async function GET() {
  try {
    const documents = await getDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, file_url = "", icon = "📄" } = body;
    if (!title)
      return NextResponse.json({ error: "Titre requis" }, { status: 400 });
    await createDocument({ title, file_url, icon });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
