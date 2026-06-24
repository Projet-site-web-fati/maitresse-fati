import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/queries";

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, event_date, event_type = "info", file_url = "" } = body;
    if (!title || !event_date)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    await createEvent({ title, event_date, event_type, file_url });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
