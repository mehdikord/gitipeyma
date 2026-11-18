/** Sends a picture to the panel's upload endpoint (app/admins/upload) and returns its address on this site. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  body.append('folder', folder);
  const response = await fetch('/admins/upload', { method: 'POST', body });
  const result = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
  if (!response.ok || !result?.url) throw new Error(result?.message ?? 'بارگذاری تصویر انجام نشد.');
  return result.url;
}

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif';
