import { getPhotos } from "@/lib/queries";
import GalerieClient from "./GalerieClient";

export default async function GaleriePage() {
  const photos = await getPhotos();
  const albums = Array.from(new Set(photos.map((p: any) => p.album)));

  return <GalerieClient photos={photos} albums={albums} />;
}
