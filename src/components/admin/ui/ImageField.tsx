'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from './Button';
import { INPUT, inputBorder } from './styles';

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  // The folder under storage/uploads the file goes to, e.g. "services".
  folder: string;
  error?: string;
  hint?: string;
};

/** Upload a picture (stored on this server) or paste the address of one already on the site. */
export const ImageField: React.FC<ImageFieldProps> = ({ label, value, onChange, folder, error, hint }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);
      const response = await fetch('/admins/upload', { method: 'POST', body });
      const result = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
      if (!response.ok || !result?.url) throw new Error(result?.message ?? 'بارگذاری تصویر انجام نشد.');
      onChange(result.url);
    } catch (problem) {
      setUploadError(problem instanceof Error ? problem.message : 'بارگذاری تصویر انجام نشد.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const message = uploadError ?? error;

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-bold text-[#14282D]">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E3E8EA] bg-[#F4F6F7] sm:w-36">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[#0B7A75]" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-7 w-7 text-[#94A3A8]" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            dir="ltr"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/uploads/... یا /images/..."
            aria-label={`آدرس ${label}`}
            className={`${INPUT} ${inputBorder(message)} h-10 text-left`}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={Upload} loading={uploading} onClick={() => inputRef.current?.click()}>
              بارگذاری تصویر
            </Button>
            {value && (
              <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onChange('')}>
                حذف تصویر
              </Button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
            }}
          />
          {message ? <p className="text-xs text-[#DC2626]">{message}</p> : <p className="text-xs text-[#5F7177]">{hint ?? 'JPG، PNG، WebP یا AVIF تا ۵ مگابایت.'}</p>}
        </div>
      </div>
    </div>
  );
};
