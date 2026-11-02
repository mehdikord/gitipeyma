import 'server-only';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

/**
 * Files uploaded from the panel live in storage/uploads (outside public/, which `next start` only
 * serves as it was at build time) and are served back by app/uploads/[...path]/route.ts.
 */
export const UPLOAD_ROOT = path.join(process.cwd(), 'storage', 'uploads');
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const SIGNATURES: { type: string; ext: string; matches: (bytes: Buffer) => boolean }[] = [
  { type: 'image/jpeg', ext: 'jpg', matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: 'image/png', ext: 'png', matches: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { type: 'image/gif', ext: 'gif', matches: (b) => b.subarray(0, 4).toString('ascii') === 'GIF8' },
  { type: 'image/webp', ext: 'webp', matches: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP' },
  { type: 'image/avif', ext: 'avif', matches: (b) => b.subarray(4, 8).toString('ascii') === 'ftyp' && ['avif', 'avis'].includes(b.subarray(8, 12).toString('ascii')) },
];

export const CONTENT_TYPES: Record<string, string> = Object.fromEntries(SIGNATURES.map((signature) => [signature.ext, signature.type]));

// The folders a form may upload into.
const FOLDERS = new Set(['services', 'team', 'general']);

/** Stores an image after checking what the bytes actually are, not what the browser claimed. */
export async function storeImage(file: File, folder: string): Promise<{ url: string } | { error: string }> {
  if (!FOLDERS.has(folder)) return { error: 'پوشه بارگذاری معتبر نیست.' };
  if (file.size === 0) return { error: 'فایل خالی است.' };
  if (file.size > MAX_UPLOAD_BYTES) return { error: 'حجم تصویر حداکثر ۵ مگابایت است.' };

  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = SIGNATURES.find((signature) => signature.matches(bytes));
  if (!kind) return { error: 'فقط تصویر JPG، PNG، WebP، AVIF یا GIF پذیرفته می‌شود.' };

  const now = new Date();
  const relative = path.posix.join(folder, String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'), `${randomBytes(12).toString('hex')}.${kind.ext}`);
  const target = path.join(UPLOAD_ROOT, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return { url: `/uploads/${relative}` };
}
