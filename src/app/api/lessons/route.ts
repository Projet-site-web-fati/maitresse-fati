import { NextRequest, NextResponse } from "next/server";
import { getLessons, createLesson } from "@/lib/queries";

export async function GET() {
  try {
    const lessons = await getLessons();
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, subject, level, chapter = "", file_url = "", color = "" } = body;
    if (!title || !content || !subject || !level)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    await createLesson({ title, content, subject, level, chapter, file_url, color });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
