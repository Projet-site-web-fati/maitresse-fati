import { NextRequest, NextResponse } from "next/server";
import { getCorrections, createCorrection } from "@/lib/queries";

export async function GET() {
  try {
    const corrections = await getCorrections();
    return NextResponse.json(corrections);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, dictee_text, correction, bareme = "", notes = "", level, week_number = null, file_url = "", color = "" } = body;
    
    if (!title || !dictee_text || !correction || !level)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createCorrection({
      title,
      dictee_text,
      correction,
      bareme,
      notes,
      level,
      week_number,
      file_url,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
