import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const db = getDb();
    
    const result = await db.execute({
      sql: "SELECT value FROM settings WHERE key = 'teacher_password'",
      args: [],
    });
    
    const row = result.rows[0] as any;
    const stored = row?.value ?? "fati2025";
    
    if (password === stored) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { current_password, new_password } = await req.json();
    
    if (!new_password || new_password.length < 4) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 4 caractères." }, { status: 400 });
    }
    
    const db = getDb();
    
    const result = await db.execute({
      sql: "SELECT value FROM settings WHERE key = 'teacher_password'",
      args: [],
    });
    
    const row = result.rows[0] as any;
    const stored = row?.value ?? "fati2025";
    
    if (current_password !== stored) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
    }
    
    await db.execute({
      sql: "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('teacher_password', ?, CURRENT_TIMESTAMP)",
      args: [new_password],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
