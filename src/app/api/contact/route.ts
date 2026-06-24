import { NextRequest, NextResponse } from "next/server";
import { getContacts, createContact } from "@/lib/queries";

export async function GET() {
  try {
    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    
    await createContact({ name, email, subject, message });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
