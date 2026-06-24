import { NextRequest, NextResponse } from "next/server";
import { uploadToB2, deleteFromB2 } from "@/lib/b2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "documents";

    if (!file)
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    if (file.size > 15 * 1024 * 1024)
      return NextResponse.json({ error: "Fichier trop volumineux (max 15 Mo)" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const fileName = `${category}/${Date.now()}-${file.name}`;
    const url = await uploadToB2(Buffer.from(buffer), fileName, file.type);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName } = body;

    if (!fileName)
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    await deleteFromB2(fileName);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
