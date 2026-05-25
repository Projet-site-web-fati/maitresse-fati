import { getDb } from "@/lib/db";
import GalerieClient from "./GalerieClient";

export default function GaleriePage() {
  const db = getDb();
  const photos = db
    .prepare("SELECT * FROM photos ORDER BY created_at DESC")
    .all() as Array<{ id: number; title: string; description: string; album: string; image_url: string; created_at: string }>;

  const albums = Array.from(new Set(photos.map((p) => p.album)));

  return <GalerieClient photos={photos} albums={albums} />;
}
