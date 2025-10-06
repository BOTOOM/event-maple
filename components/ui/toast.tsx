"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex w-full items-start justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-2xl transition-all animate-in slide-in-from-top-5",
          {
            "border-gray-200 bg-white text-gray-900": variant === "default",
            "border-red-200 bg-red-50 text-red-900": variant === "destructive",
            "border-green-200 bg-green-50 text-green-900": variant === "success",
          },
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
