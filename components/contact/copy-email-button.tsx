"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyEmailButtonProps {
  email: string;
  buttonText: string;
  copiedText: string;
  className?: string;
}

export function CopyEmailButton({
  email,
  buttonText,
  copiedText,
  className,
}: Readonly<CopyEmailButtonProps>) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap",
        className
      )}
    >
      {hasCopied ? copiedText : buttonText}
    </button>
  );
}
