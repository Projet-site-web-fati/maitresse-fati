import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// B2 S3-compatible API client
const s3Client = new S3Client({
  region: 'eu-central-003',
  endpoint: `https://${process.env.B2_ENDPOINT || 's3.eu-central-003.backblazeb2.com'}`,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID || '',
    secretAccessKey: process.env.B2_APPLICATION_KEY || '',
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.B2_BUCKET_NAME || 'fatibucket';
const BUCKET_ID = process.env.B2_BUCKET_ID || '';

/**
 * Upload a file to B2
 * @param file File buffer
 * @param fileName File name with path (e.g., "documents/pdf/file.pdf")
 * @param contentType MIME type
 * @returns URL of the uploaded file
 */
export async function uploadToB2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return public URL (path-style)
    const endpoint = process.env.B2_ENDPOINT || 's3.eu-central-003.backblazeb2.com';
    return `https://${endpoint}/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error('B2 upload error:', error);
    throw new Error(`Failed to upload file to B2: ${error}`);
  }
}

/**
 * Delete a file from B2
 * @param fileName File name with path
 */
export async function deleteFromB2(fileName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('B2 delete error:', error);
    throw new Error(`Failed to delete file from B2: ${error}`);
  }
}

/**
 * Get signed URL for temporary access to a file
 * @param fileName File name with path
 * @param expirationSeconds How long the URL is valid (default 3600 = 1 hour)
 */
export async function getB2SignedUrl(
  fileName: string,
  expirationSeconds: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: expirationSeconds });
    return url;
  } catch (error) {
    console.error('B2 signed URL error:', error);
    throw new Error(`Failed to generate signed URL: ${error}`);
  }
}
