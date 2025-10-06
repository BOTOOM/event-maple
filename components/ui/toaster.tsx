"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex max-h-screen flex-col-reverse sm:top-auto sm:bottom-0 sm:left-auto sm:right-0 sm:flex-col sm:max-w-[420px] sm:m-4">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          onClose={() => dismiss(t.id)}
          className="mb-2 w-full"
        >
          {t.title && <div className="font-semibold mb-1 text-base">{t.title}</div>}
          {t.description && (
            <div className="text-sm opacity-95 leading-relaxed">{t.description}</div>
          )}
        </Toast>
      ))}
    </div>
  );
}
