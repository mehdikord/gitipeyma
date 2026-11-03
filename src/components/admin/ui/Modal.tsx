'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { FOCUS } from './styles';

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: keyof typeof SIZES;
  children: React.ReactNode;
  footer?: React.ReactNode;
  // Stays under the header while the body scrolls, e.g. the language switcher of a form.
  toolbar?: React.ReactNode;
  // Wrap the body and footer in a form, so Enter submits it.
  onSubmit?: (event: React.FormEvent) => void;
};

/**
 * A native <dialog>: the browser keeps focus inside it, closes it on Escape and puts it above
 * everything else. The body scrolls; the header and footer stay put.
 */
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, description, size = 'md', children, footer, toolbar, onSubmit }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const content = (
    <>
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">{children}</div>
      {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E3E8EA] bg-[#FAFBFB] px-5 sm:px-6 py-3.5">{footer}</div>}
    </>
  );

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // A click on the backdrop lands on the dialog element itself
      onMouseDown={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={`admin-dialog m-auto w-[calc(100%-2rem)] ${SIZES[size]} max-h-[calc(100dvh-2rem)] rounded-2xl bg-white p-0 text-[#14282D] shadow-2xl`}
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col text-right">
          <div className="flex items-start justify-between gap-4 border-b border-[#E3E8EA] px-5 sm:px-6 py-4">
            <div>
              <h2 className="text-base sm:text-lg font-black">{title}</h2>
              {description && <p className="mt-1 text-[13px] text-[#5F7177]">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="بستن" className={`-m-1 rounded-lg p-1.5 text-[#5F7177] hover:bg-[#EEF2F3] ${FOCUS}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {toolbar}
          {onSubmit ? (
            <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
              {content}
            </form>
          ) : (
            content
          )}
        </div>
      )}
    </dialog>
  );
};
