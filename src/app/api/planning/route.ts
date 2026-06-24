import { NextRequest, NextResponse } from "next/server";
import { getPlanning, createPlanning } from "@/lib/queries";

export async function GET() {
  try {
    const planning = await getPlanning();
    return NextResponse.json(planning);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, period, subject, level, file_url = "", color = "" } = body;
    if (!title || !content || !period || !subject || !level)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    await createPlanning({ title, content, period, subject, level, file_url, color });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
