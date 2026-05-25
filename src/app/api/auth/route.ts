import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const db = getDb();
  const row = db.prepare("SELECT value FROM settings WHERE key = 'teacher_password'").get() as { value: string } | undefined;
  const stored = row?.value ?? "fati2025";
  if (password === stored) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const { current_password, new_password } = await req.json();
  if (!new_password || new_password.length < 4) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 4 caractères." }, { status: 400 });
  }
  const db = getDb();
  const row = db.prepare("SELECT value FROM settings WHERE key = 'teacher_password'").get() as { value: string } | undefined;
  const stored = row?.value ?? "fati2025";
  if (current_password !== stored) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
  }
  db.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('teacher_password', ?, CURRENT_TIMESTAMP)").run(new_password);
  return NextResponse.json({ success: true });
}
