import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { CONTENT_TYPES, UPLOAD_ROOT } from '../../../lib/uploads';

// Serves what was uploaded from the panel. File names are random and never reused, so they cache forever.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path;
  const target = path.resolve(UPLOAD_ROOT, ...segments);
  const type = CONTENT_TYPES[path.extname(target).slice(1).toLowerCase()];
  if (!target.startsWith(UPLOAD_ROOT + path.sep) || !type) return new Response('Not found', { status: 404 });

  try {
    const file = await readFile(target);
    return new Response(new Uint8Array(file), {
      headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
