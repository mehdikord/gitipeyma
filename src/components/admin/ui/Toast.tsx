'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

type Toast = { id: number; tone: 'success' | 'error'; message: string };

const ToastContext = createContext<(tone: Toast['tone'], message: string) => void>(() => {});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);

  const show = useCallback(
    (tone: Toast['tone'], message: string) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list.slice(-3), { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === 'error' ? 6000 : 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 left-4 right-4 sm:right-auto z-[60] flex flex-col gap-2 sm:w-96">
        {toasts.map((toast) => {
          const Icon = toast.tone === 'success' ? CheckCircle2 : AlertCircle;
          return (
            <div
              key={toast.id}
              role={toast.tone === 'error' ? 'alert' : 'status'}
              className="admin-toast pointer-events-auto flex items-start gap-3 rounded-xl bg-[#14282D] px-4 py-3 text-sm text-white shadow-lg"
            >
              <Icon className={`w-5 h-5 shrink-0 ${toast.tone === 'success' ? 'text-[#5EEAD4]' : 'text-[#FCA5A5]'}`} />
              <span className="flex-1 leading-relaxed">{toast.message}</span>
              <button type="button" onClick={() => dismiss(toast.id)} aria-label="بستن" className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const show = useContext(ToastContext);
  return { success: (message: string) => show('success', message), error: (message: string) => show('error', message) };
};
