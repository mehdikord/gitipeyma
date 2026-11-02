import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth/currentAdmin';
import { storeImage } from '../../../lib/uploads';

// Image uploads from the panel's forms. A route handler rather than a server action, so a
// several-megabyte photo is not held to the server action body limit.
export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ message: 'ابتدا وارد پنل شوید.' }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  const folder = String(form?.get('folder') ?? 'general');
  if (!(file instanceof File)) return NextResponse.json({ message: 'فایلی انتخاب نشده است.' }, { status: 422 });

  const result = await storeImage(file, folder);
  if ('error' in result) return NextResponse.json({ message: result.error }, { status: 422 });
  return NextResponse.json(result, { status: 201 });
}
