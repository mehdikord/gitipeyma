'use client';

import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { ActionResult } from '../../lib/actions';
import { Button, IconButton } from './ui/Button';
import { useConfirm } from './ui/Confirm';
import { Column, DataTable } from './ui/DataTable';
import { FormAlert } from './ui/fields';
import { Modal } from './ui/Modal';
import { PageHeader } from './ui/PageHeader';
import { Pagination } from './ui/Pagination';
import { useToast } from './ui/Toast';
import { FormApi, useForm } from './ui/useForm';
import { hasTranslations, LanguageTabs, TranslationProvider, TranslationStatus } from './ui/translations';

type Row = { id: number };

export type CrudManagerProps<R extends Row, V extends Record<string, unknown>> = {
  title: string;
  description?: React.ReactNode;
  // What the create button and the modal call one item, e.g. "عضو تیم".
  noun: string;
  rows: R[];
  columns: Column<R>[];
  emptyValues: () => V;
  toValues: (row: R) => V;
  save: (id: number | null, values: V) => Promise<ActionResult<unknown>>;
  remove?: (id: number) => Promise<ActionResult<unknown>>;
  renderForm: (form: FormApi<V>, editing: R | null) => React.ReactNode;
  deleteMessage?: (row: R) => React.ReactNode;
  canDelete?: (row: R) => boolean;
  rowActions?: (row: R) => React.ReactNode;
  highlight?: (row: R) => boolean;
  toolbar?: React.ReactNode;
  pagination?: { page: number; pages: number; total: number; perPage: number };
  modalSize?: 'sm' | 'md' | 'lg' | 'xl';
  emptyText?: string;
};

/**
 * A list with create, edit and delete, where the form opens in a modal over the list.
 * Each section of the panel describes its columns and form fields and hands them to this.
 * When the form has translatable fields ({ fa, en, tr }), the modal gets the language switcher and
 * the list a column showing which languages each item is written in.
 */
export function CrudManager<R extends Row, V extends Record<string, unknown>>(props: CrudManagerProps<R, V>) {
  const { title, description, noun, rows, columns, emptyValues, toValues, save, remove, renderForm, deleteMessage, canDelete, rowActions, highlight, toolbar, pagination, modalSize = 'md', emptyText } = props;
  const form = useForm<V>(emptyValues());
  const confirm = useConfirm();
  const toast = useToast();
  // null: closed; { row: null }: creating; { row }: editing that row
  const [open, setOpen] = useState<{ row: R | null } | null>(null);
  const translatable = hasTranslations(emptyValues());
  const allColumns: Column<R>[] = translatable
    ? [...columns, { key: '_translations', header: 'ترجمه', hideOnMobile: true, cell: (row) => <TranslationStatus values={toValues(row)} /> }]
    : columns;

  const openCreate = () => {
    form.reset(emptyValues());
    setOpen({ row: null });
  };

  const openEdit = (row: R) => {
    form.reset(toValues(row));
    setOpen({ row });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const editing = open?.row ?? null;
    form.submit(() => save(editing?.id ?? null, form.values), {
      success: editing ? `${noun} ویرایش شد.` : `${noun} اضافه شد.`,
      onSuccess: () => setOpen(null),
    });
  };

  const handleDelete = async (row: R) => {
    if (!remove) return;
    const agreed = await confirm({ title: `حذف ${noun}`, message: deleteMessage?.(row) ?? `این ${noun} حذف شود؟ این کار قابل بازگشت نیست.` });
    if (!agreed) return;
    const result = await remove(row.id);
    if (result.ok) toast.success(result.message ?? `${noun} حذف شد.`);
    else toast.error(result.message ?? 'حذف انجام نشد.');
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button icon={Plus} onClick={openCreate}>
            {noun} جدید
          </Button>
        }
      />

      {toolbar}

      <DataTable
        rows={rows}
        columns={allColumns}
        rowKey={(row) => row.id}
        onRowClick={openEdit}
        highlight={highlight}
        emptyText={emptyText}
        actions={(row) => (
          <>
            {rowActions?.(row)}
            <IconButton label="ویرایش" icon={Pencil} onClick={() => openEdit(row)} />
            {remove && (canDelete?.(row) ?? true) && <IconButton label="حذف" icon={Trash2} tone="danger" onClick={() => handleDelete(row)} />}
          </>
        )}
      />

      {pagination && <Pagination {...pagination} />}

      {/* Remounted on every open, so each form starts in Persian */}
      <TranslationProvider key={open ? 'open' : 'closed'}>
        <Modal
          open={open !== null}
          toolbar={translatable ? <LanguageTabs values={form.values} errors={form.errors} /> : undefined}
          onClose={() => !form.pending && setOpen(null)}
          title={open?.row ? `ویرایش ${noun}` : `افزودن ${noun}`}
          size={modalSize}
          onSubmit={handleSubmit}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(null)} disabled={form.pending}>
                انصراف
              </Button>
              <Button type="submit" loading={form.pending}>
                {open?.row ? 'ذخیره تغییرات' : `افزودن ${noun}`}
              </Button>
            </>
          }
        >
          <FormAlert message={form.formError} />
          {open && renderForm(form, open.row)}
        </Modal>
      </TranslationProvider>
    </>
  );
}
