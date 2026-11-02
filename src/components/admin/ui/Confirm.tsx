'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

type ConfirmOptions = { title: string; message?: React.ReactNode; confirmLabel?: string; tone?: 'danger' | 'primary' };

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

/** `await confirm({...})` resolves true when the admin agrees. One dialog for the whole panel. */
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>(() => {});

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const answer = (value: boolean) => {
    resolver.current(value);
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={options !== null}
        onClose={() => answer(false)}
        size="sm"
        title={
          <span className="flex items-center gap-2">
            {options?.tone !== 'primary' && <AlertTriangle className="w-5 h-5 text-[#DC2626]" />}
            {options?.title}
          </span>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => answer(false)}>
              انصراف
            </Button>
            <Button variant={options?.tone === 'primary' ? 'primary' : 'danger'} onClick={() => answer(true)} autoFocus>
              {options?.confirmLabel ?? 'حذف'}
            </Button>
          </>
        }
      >
        <div className="text-sm leading-7 text-[#3F5257]">{options?.message ?? 'این کار قابل بازگشت نیست.'}</div>
      </Modal>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
