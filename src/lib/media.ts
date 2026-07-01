/**
 * Convertit une URL de fichier en URL affichable.
 * - Si c'est une URL B2 (privée), passe par le proxy /api/media
 * - Sinon retourne l'URL telle quelle
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '/images/placeholder-class.jpg';
  if (url.includes('backblazeb2.com')) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}
