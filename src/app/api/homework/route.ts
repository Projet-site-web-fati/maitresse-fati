import { NextRequest, NextResponse } from "next/server";
import { getHomework, createHomework } from "@/lib/queries";

export async function GET() {
  try {
    const homework = await getHomework();
    return NextResponse.json(homework);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description = "", subject, level, due_date, file_url = "", color = "" } = body;
    if (!title || !subject || !level || !due_date)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    await createHomework({ title, description, subject, level, due_date, file_url, color });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
