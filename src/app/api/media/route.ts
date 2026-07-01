import { NextRequest, NextResponse } from 'next/server';
import { getB2SignedUrl } from '@/lib/b2';

export async function GET(req: NextRequest) {
  try {
    const fileUrl = req.nextUrl.searchParams.get('url');

    if (!fileUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Sécurité : uniquement les URLs B2
    if (!fileUrl.includes('backblazeb2.com')) {
      return new NextResponse('Invalid URL', { status: 403 });
    }

    // Extraire la clé du fichier depuis l'URL complète
    // Ex: https://s3.eu-central-003.backblazeb2.com/fatibucket/photos/123-file.jpg
    //  → photos/123-file.jpg
    const bucketName = process.env.B2_BUCKET_NAME || 'fatibucket';
    const endpoint = process.env.B2_ENDPOINT || 's3.eu-central-003.backblazeb2.com';
    const prefix = `https://${endpoint}/${bucketName}/`;
    const key = fileUrl.startsWith(prefix) ? fileUrl.slice(prefix.length) : null;

    if (!key) {
      return new NextResponse('Invalid B2 URL format', { status: 400 });
    }

    // Générer une URL signée (valide 1h) et rediriger
    const signedUrl = await getB2SignedUrl(key, 3600);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('Media proxy error:', error);
    return new NextResponse('Error fetching media', { status: 500 });
  }
}
