"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          onClose={() => dismiss(t.id)}
          className="mb-2"
        >
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && (
            <div className="text-sm opacity-90">{t.description}</div>
          )}
        </Toast>
      ))}
    </div>
  );
}
