'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TableKit } from '@tiptap/extension-table';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Columns3,
  Eraser,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Palette,
  Quote,
  Redo2,
  Rows3,
  Strikethrough,
  Table2,
  TableCellsMerge,
  Trash2,
  Underline,
  Undo2,
} from 'lucide-react';
import { IMAGE_ACCEPT, uploadImage } from './upload';
import { FOCUS } from './styles';

/**
 * The editor for an article's body: headings, formatting, colors, lists, quotes, code, links,
 * pictures (uploaded, pasted or dropped in) and tables. It reads and writes HTML; the server cleans
 * that HTML again when it is saved (src/modules/articles/html.ts).
 */

type Props = {
  value: string;
  onChange: (html: string) => void;
  dir: 'rtl' | 'ltr';
  lang: string;
  placeholder?: string;
  // Where pictures go under storage/uploads
  folder?: string;
  invalid?: boolean;
  id?: string;
};

const TEXT_COLORS = ['#0B7A75', '#C6A15B', '#1D4ED8', '#B91C1C', '#15803D', '#7C3AED', '#14282D', '#64748B'];
const HIGHLIGHTS = ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA', '#E2C98C'];

const fa = (n: number) => n.toLocaleString('fa-IR');

// ---- Small building blocks of the toolbar --------------------------------------------------

const ToolButton: React.FC<{ label: string; icon: React.ElementType; onClick: () => void; active?: boolean; disabled?: boolean; tone?: 'danger' }> = ({
  label,
  icon: Icon,
  onClick,
  active,
  disabled,
  tone,
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    // Keeps the selection in the editor while the button is pressed
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-35 ${FOCUS} ${
      active ? 'bg-[#0B7A75] text-white' : tone === 'danger' ? 'text-[#B91C1C] hover:bg-[#FEE2E2]' : 'text-[#3F5257] hover:bg-[#E6ECEE]'
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const Divider = () => <span aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-[#D5DDE0]" />;

/** A toolbar button that opens a small panel under it, closed by clicking anywhere else. */
const Popover: React.FC<{ label: string; icon: React.ElementType; active?: boolean; children: (close: () => void) => React.ReactNode }> = ({ label, icon, active, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => !ref.current?.contains(event.target as Node) && setOpen(false);
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <ToolButton label={label} icon={icon} active={active || open} onClick={() => setOpen((value) => !value)} />
      {open && <div className="absolute right-0 top-full z-30 mt-1.5 rounded-lg border border-[#D5DDE0] bg-white p-2.5 shadow-xl">{children(() => setOpen(false))}</div>}
    </div>
  );
};

const Swatches: React.FC<{ colors: string[]; onPick: (color: string | null) => void; clearLabel: string }> = ({ colors, onPick, clearLabel }) => (
  <div className="w-44">
    <div className="grid grid-cols-4 gap-1.5">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          title={color}
          aria-label={color}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onPick(color)}
          className={`h-8 rounded-md border border-black/10 ${FOCUS}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
    <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onPick(null)} className="mt-2 w-full rounded-md py-1.5 text-xs font-bold text-[#3F5257] hover:bg-[#F4F6F7]">
      {clearLabel}
    </button>
  </div>
);

/** One-line input with a button, for link addresses and picture details. */
const InlineForm: React.FC<{ label: string; initial: string; placeholder?: string; ltr?: boolean; submitLabel: string; onSubmit: (value: string) => void; autoFocus?: boolean }> = ({
  label,
  initial,
  placeholder,
  ltr,
  submitLabel,
  onSubmit,
  autoFocus,
}) => {
  const [value, setValue] = useState(initial);
  useEffect(() => setValue(initial), [initial]);
  return (
    // Not a <form>: this sits inside the article's own form
    <div className="flex items-center gap-1.5">
      <input
        aria-label={label}
        value={value}
        autoFocus={autoFocus}
        dir={ltr ? 'ltr' : undefined}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        // The form sits inside the article form; Enter must not submit that one
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit(value.trim());
          }
        }}
        className="h-8 w-56 rounded-md border border-[#D5DDE0] bg-white px-2.5 text-[13px] outline-none focus:border-[#0B7A75]"
      />
      <button type="button" onClick={() => onSubmit(value.trim())} className="h-8 shrink-0 rounded-md bg-[#0B7A75] px-3 text-xs font-bold text-white hover:bg-[#096762]">
        {submitLabel}
      </button>
    </div>
  );
};

const normalizeUrl = (url: string) => (!url || /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`);

// ---- The toolbar ------------------------------------------------------------------------

const Toolbar: React.FC<{ editor: Editor; onPickImage: () => void; uploading: boolean; fullscreen: boolean; toggleFullscreen: () => void }> = ({
  editor,
  onPickImage,
  uploading,
  fullscreen,
  toggleFullscreen,
}) => {
  const chain = () => editor.chain().focus();
  const block = editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : editor.isActive('heading', { level: 4 }) ? 'h4' : 'p';

  return (
    <div role="toolbar" aria-label="ابزار ویرایش متن" className="flex flex-wrap items-center gap-0.5 border-b border-[#E3E8EA] bg-[#F7FAFA] px-2 py-1.5">
      <ToolButton label="بازگشت" icon={Undo2} disabled={!editor.can().undo()} onClick={() => chain().undo().run()} />
      <ToolButton label="انجام دوباره" icon={Redo2} disabled={!editor.can().redo()} onClick={() => chain().redo().run()} />
      <Divider />
      <select
        aria-label="نوع متن"
        value={block}
        onChange={(event) => {
          const next = event.target.value;
          if (next === 'p') chain().setParagraph().run();
          else chain().setHeading({ level: Number(next.slice(1)) as 2 | 3 | 4 }).run();
        }}
        className="h-8 rounded-md border border-[#D5DDE0] bg-white px-2 text-[13px] font-bold text-[#14282D] outline-none focus:border-[#0B7A75]"
      >
        <option value="p">متن عادی</option>
        <option value="h2">تیتر اصلی (H2)</option>
        <option value="h3">تیتر فرعی (H3)</option>
        <option value="h4">تیتر کوچک (H4)</option>
      </select>
      <Divider />
      <ToolButton label="پررنگ" icon={Bold} active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()} />
      <ToolButton label="کج" icon={Italic} active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()} />
      <ToolButton label="زیرخط" icon={Underline} active={editor.isActive('underline')} onClick={() => chain().toggleUnderline().run()} />
      <ToolButton label="خط‌خورده" icon={Strikethrough} active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()} />
      <Popover label="رنگ متن" icon={Palette} active={Boolean(editor.getAttributes('textStyle').color)}>
        {(close) => (
          <Swatches
            colors={TEXT_COLORS}
            clearLabel="رنگ پیش‌فرض"
            onPick={(color) => {
              if (color) chain().setColor(color).run();
              else chain().unsetColor().run();
              close();
            }}
          />
        )}
      </Popover>
      <Popover label="رنگ پس‌زمینه (هایلایت)" icon={Highlighter} active={editor.isActive('highlight')}>
        {(close) => (
          <Swatches
            colors={HIGHLIGHTS}
            clearLabel="بدون هایلایت"
            onPick={(color) => {
              if (color) chain().setHighlight({ color }).run();
              else chain().unsetHighlight().run();
              close();
            }}
          />
        )}
      </Popover>
      <Divider />
      <ToolButton label="راست‌چین" icon={AlignRight} active={editor.isActive({ textAlign: 'right' })} onClick={() => chain().setTextAlign('right').run()} />
      <ToolButton label="وسط‌چین" icon={AlignCenter} active={editor.isActive({ textAlign: 'center' })} onClick={() => chain().setTextAlign('center').run()} />
      <ToolButton label="چپ‌چین" icon={AlignLeft} active={editor.isActive({ textAlign: 'left' })} onClick={() => chain().setTextAlign('left').run()} />
      <ToolButton label="هم‌تراز" icon={AlignJustify} active={editor.isActive({ textAlign: 'justify' })} onClick={() => chain().setTextAlign('justify').run()} />
      <Divider />
      <ToolButton label="فهرست نقطه‌ای" icon={List} active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()} />
      <ToolButton label="فهرست شماره‌دار" icon={ListOrdered} active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()} />
      <ToolButton label="نقل قول" icon={Quote} active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()} />
      <ToolButton label="بلوک کد" icon={Code2} active={editor.isActive('codeBlock')} onClick={() => chain().toggleCodeBlock().run()} />
      <ToolButton label="خط جداکننده" icon={Minus} onClick={() => chain().setHorizontalRule().run()} />
      <Divider />
      <Popover label="افزودن لینک" icon={Link2} active={editor.isActive('link')}>
        {(close) => (
          <InlineForm
            label="آدرس لینک"
            ltr
            autoFocus
            placeholder="https://..."
            submitLabel="ثبت"
            initial={editor.getAttributes('link').href ?? ''}
            onSubmit={(url) => {
              if (url) chain().extendMarkRange('link').setLink({ href: normalizeUrl(url) }).run();
              else chain().extendMarkRange('link').unsetLink().run();
              close();
            }}
          />
        )}
      </Popover>
      <ToolButton label="افزودن تصویر" icon={uploading ? Loader2 : ImagePlus} disabled={uploading} onClick={onPickImage} />
      <ToolButton
        label="افزودن جدول"
        icon={Table2}
        active={editor.isActive('table')}
        onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      />
      <Divider />
      <ToolButton label="پاک کردن قالب‌بندی" icon={Eraser} onClick={() => chain().unsetAllMarks().clearNodes().run()} />
      <span className="flex-1" />
      <ToolButton label={fullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'} icon={fullscreen ? Minimize2 : Maximize2} onClick={toggleFullscreen} />
    </div>
  );
};

/** Extra controls for what the cursor is on: a table, a picture or a link. */
const ContextBar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const chain = () => editor.chain().focus();
  const bar = 'flex flex-wrap items-center gap-1 border-b border-[#E3E8EA] bg-[#FFFBEB] px-2 py-1.5 text-xs font-bold text-[#92400E]';

  if (editor.isActive('image')) {
    const { alt = '', src = '' } = editor.getAttributes('image');
    return (
      <div className={bar}>
        <span className="ml-1">تصویر انتخاب‌شده:</span>
        <InlineForm label="متن جایگزین تصویر" initial={alt} placeholder="توضیح کوتاه تصویر برای سئو و نابینایان" submitLabel="ثبت متن جایگزین" onSubmit={(value) => chain().updateAttributes('image', { alt: value || null }).run()} />
        <span dir="ltr" className="max-w-48 truncate font-normal text-[#B45309]" title={src}>
          {src}
        </span>
        <ToolButton label="حذف تصویر" icon={Trash2} tone="danger" onClick={() => chain().deleteSelection().run()} />
      </div>
    );
  }

  if (editor.isActive('table')) {
    return (
      <div className={bar}>
        <span className="ml-1 flex items-center gap-1">
          <Table2 className="h-3.5 w-3.5" /> جدول:
        </span>
        {[
          ['ردیف بالا', () => chain().addRowBefore().run()],
          ['ردیف پایین', () => chain().addRowAfter().run()],
          ['حذف ردیف', () => chain().deleteRow().run()],
          ['ستون قبل', () => chain().addColumnBefore().run()],
          ['ستون بعد', () => chain().addColumnAfter().run()],
          ['حذف ستون', () => chain().deleteColumn().run()],
          ['ردیف عنوان', () => chain().toggleHeaderRow().run()],
        ].map(([label, run]) => (
          <button
            key={label as string}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={run as () => void}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 hover:bg-[#FEF3C7]"
          >
            {(label as string).includes('ردیف') && !(label as string).includes('عنوان') ? <Rows3 className="h-3.5 w-3.5" /> : (label as string).includes('ستون') ? <Columns3 className="h-3.5 w-3.5" /> : null}
            {label as string}
          </button>
        ))}
        <ToolButton label="ادغام یا جدا کردن خانه‌ها" icon={TableCellsMerge} disabled={!editor.can().mergeOrSplit()} onClick={() => chain().mergeOrSplit().run()} />
        <ToolButton label="حذف جدول" icon={Trash2} tone="danger" onClick={() => chain().deleteTable().run()} />
      </div>
    );
  }

  if (editor.isActive('link')) {
    const href: string = editor.getAttributes('link').href ?? '';
    return (
      <div className={bar}>
        <span className="ml-1">لینک:</span>
        <InlineForm label="آدرس لینک" ltr initial={href} submitLabel="به‌روزرسانی" onSubmit={(url) => (url ? chain().extendMarkRange('link').setLink({ href: normalizeUrl(url) }).run() : chain().extendMarkRange('link').unsetLink().run())} />
        <ToolButton label="حذف لینک" icon={Link2Off} tone="danger" onClick={() => chain().extendMarkRange('link').unsetLink().run()} />
      </div>
    );
  }

  return null;
};

// ---- The editor --------------------------------------------------------------------------

export const RichTextEditor: React.FC<Props> = ({ value, onChange, dir, lang, placeholder = 'متن مقاله را اینجا بنویسید...', folder = 'articles', invalid, id }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  const insertImages = async (files: File[], at?: number) => {
    const editor = editorRef.current;
    if (!editor || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of files) {
        const src = await uploadImage(file, folder);
        const chain = editor.chain().focus();
        if (at !== undefined) chain.insertContentAt(at, { type: 'image', attrs: { src, alt: '' } }).run();
        else chain.setImage({ src, alt: '' }).run();
      }
    } catch (problem) {
      setUploadError(problem instanceof Error ? problem.message : 'بارگذاری تصویر انجام نشد.');
    } finally {
      setUploading(false);
    }
  };

  const imageFiles = (list: FileList | null | undefined) => Array.from(list ?? []).filter((file) => file.type.startsWith('image/'));

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ allowBase64: false, resize: { enabled: true, alwaysPreserveAspectRatio: true, minWidth: 80, minHeight: 40 } }),
      TableKit.configure({ table: { resizable: true } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: { class: 'article-prose rich-editor-content', dir, lang, ...(id ? { id } : {}), 'aria-label': 'متن مقاله', 'aria-multiline': 'true' },
      // Pictures pasted or dropped into the text are uploaded rather than kept inline
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        event.preventDefault();
        insertImages(files);
        return true;
      },
      handleDrop: (view, event) => {
        const files = imageFiles(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertImages(files, position);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });
  editorRef.current = editor;

  // Esc leaves full screen; the page behind does not scroll meanwhile
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setFullscreen(false);
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [fullscreen]);

  const words = editor?.storage.characterCount.words() ?? 0;
  const characters = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div
      // The light site theme's colors, so the text looks as it will on the site
      data-theme="light"
      className={`rich-editor overflow-hidden border bg-white ${invalid ? 'border-[#DC2626]' : 'border-[#D5DDE0]'} ${
        fullscreen ? 'fixed inset-0 z-[60] flex flex-col rounded-none' : 'rounded-lg'
      }`}
    >
      {editor ? (
        <>
          <div>
            <Toolbar editor={editor} onPickImage={() => fileRef.current?.click()} uploading={uploading} fullscreen={fullscreen} toggleFullscreen={() => setFullscreen((value) => !value)} />
            <ContextBar editor={editor} />
          </div>
          <div className={`${fullscreen ? 'flex-1 overflow-y-auto' : 'max-h-[75vh] overflow-y-auto'} bg-white`}>
            <div className={fullscreen ? 'mx-auto max-w-3xl px-6 py-8' : 'px-5 py-5 sm:px-7'}>
              <EditorContent editor={editor} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E3E8EA] bg-[#F7FAFA] px-3 py-1.5 text-[11px] text-[#5F7177]">
            <span>
              {fa(words)} کلمه · {fa(characters)} کاراکتر · حدود {fa(Math.max(1, Math.round(words / 200)))} دقیقه مطالعه
            </span>
            {uploadError ? (
              <span className="font-bold text-[#DC2626]">{uploadError}</span>
            ) : (
              <span>تصویر را می‌توانید مستقیم در متن رها (Drag) یا جای‌گذاری (Paste) کنید.</span>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#0B7A75]" />
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        multiple
        accept={IMAGE_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          insertImages(imageFiles(event.target.files));
          event.target.value = '';
        }}
      />
    </div>
  );
};
