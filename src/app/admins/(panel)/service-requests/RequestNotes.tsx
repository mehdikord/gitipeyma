'use client';

import React, { useState, useTransition } from 'react';
import { MessageSquarePlus, Pencil, X } from 'lucide-react';
import type { ServiceRequestNoteRow } from '../../../../modules/serviceRequests/queries';
import { addServiceRequestNote, updateServiceRequestNote } from '../../../../modules/serviceRequests/actions';
import { NOTE_MAX } from '../../../../modules/serviceRequests/schema';
import { formatDateTime } from '../../../../lib/format';
import { Button, IconButton } from '../../../../components/admin/ui/Button';
import { TextArea } from '../../../../components/admin/ui/fields';
import { useToast } from '../../../../components/admin/ui/Toast';

// The team's written log on a service request: every note in order, each editable by anyone who can
// see the request, and a box to add the next one. It sits inside the request's modal form, so its
// buttons are plain buttons and never submit that form.

type Save = (input: { id: number; body: string }) => Promise<{ ok: boolean; message?: string; errors?: Record<string, string> }>;

/** Runs a note action and reports it; returns whether it worked. */
function useNoteAction() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const run = (save: Save, input: { id: number; body: string }, onDone: () => void) =>
    start(async () => {
      const result = await save(input);
      if (result.ok) {
        setError(null);
        toast.success(result.message ?? 'ذخیره شد.');
        onDone();
      } else setError(result.errors?.body ?? result.message ?? 'ذخیره نشد.');
    });
  return { pending, error, setError, run };
}

const Note: React.FC<{ note: ServiceRequestNoteRow }> = ({ note }) => {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(note.body);
  const action = useNoteAction();

  const cancel = () => {
    setEditing(false);
    setBody(note.body);
    action.setError(null);
  };

  return (
    <li className="rounded-lg border border-[#E3E8EA] bg-white p-3">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <p className="text-xs leading-relaxed text-[#5F7177]">
          <span className="font-bold text-[#14282D]">{note.author ?? 'نویسنده نامشخص'}</span>
          {' · '}
          {formatDateTime(note.createdAt)}
          {note.editedAt && (
            <span className="block">
              ویرایش‌شده{note.editor ? ` توسط ${note.editor}` : ''} در {formatDateTime(note.editedAt)}
            </span>
          )}
        </p>
        {!editing && (
          <IconButton
            label="ویرایش یادداشت"
            icon={Pencil}
            onClick={() => {
              setBody(note.body);
              setEditing(true);
            }}
          />
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <TextArea label="متن یادداشت" rows={4} maxLength={NOTE_MAX} value={body} onChange={setBody} error={action.error ?? undefined} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" icon={X} onClick={cancel} disabled={action.pending}>
              انصراف
            </Button>
            <Button size="sm" loading={action.pending} disabled={!body.trim()} onClick={() => action.run(updateServiceRequestNote, { id: note.id, body }, () => setEditing(false))}>
              ذخیره ویرایش
            </Button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-line break-words text-sm leading-7 text-[#14282D]">{note.body}</p>
      )}
    </li>
  );
};

export const RequestNotes: React.FC<{ requestId: number; notes: ServiceRequestNoteRow[] }> = ({ requestId, notes }) => {
  const [body, setBody] = useState('');
  const action = useNoteAction();

  return (
    <section aria-labelledby={`notes-${requestId}`}>
      <h3 id={`notes-${requestId}`} className="mb-2 text-[13px] font-bold text-[#14282D]">
        یادداشت‌ها و گزارش‌ها <span className="font-normal text-[#5F7177]">({notes.length.toLocaleString('fa-IR')})</span>
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-[#5F7177]">فقط مدیرانی که به این درخواست دسترسی دارند می‌بینند؛ مثلاً نتیجه تماس، مدارک دریافتی یا قدم بعدی.</p>

      {notes.length === 0 ? (
        <p className="mb-3 rounded-lg border border-dashed border-[#D5DDE0] px-3 py-4 text-center text-[13px] text-[#5F7177]">هنوز یادداشتی ثبت نشده است.</p>
      ) : (
        <ol className="mb-3 max-h-[22rem] space-y-2 overflow-y-auto">
          {notes.map((note) => (
            // Remounted when edited elsewhere, so the edit box starts from the saved text
            <Note key={`${note.id}-${note.editedAt ?? ''}`} note={note} />
          ))}
        </ol>
      )}

      <div className="space-y-2 rounded-lg bg-[#F4F6F7] p-3">
        <TextArea label="یادداشت جدید" rows={3} maxLength={NOTE_MAX} placeholder="گزارش خود را بنویسید..." value={body} onChange={setBody} error={action.error ?? undefined} />
        <div className="flex justify-end">
          <Button size="sm" icon={MessageSquarePlus} loading={action.pending} disabled={!body.trim()} onClick={() => action.run(addServiceRequestNote, { id: requestId, body }, () => setBody(''))}>
            ثبت یادداشت
          </Button>
        </div>
      </div>
    </section>
  );
};
