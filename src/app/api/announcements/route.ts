import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements, createAnnouncement } from "@/lib/queries";

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category = "info", audience = "all", file_url = "", color = "" } = body;
    
    if (!title || !content) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    
    await createAnnouncement({
      title,
      content,
      category,
      audience,
      file_url,
      color,
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
