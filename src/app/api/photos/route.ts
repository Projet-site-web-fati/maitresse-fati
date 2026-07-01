import { NextRequest, NextResponse } from "next/server";
import { getPhotos, createPhoto } from "@/lib/queries";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const photos = await getPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description = "", album, image_url = "/images/placeholder-class.jpg" } = body;
    if (!title || !album)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    await createPhoto({ title, description, album, image_url });
    revalidatePath("/galerie");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
