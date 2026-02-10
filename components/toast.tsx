"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onDismiss,
  duration = 2500,
}: {
  message: string;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  return (
    <div
      className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:max-w-sm sm:-translate-x-1/2 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 border border-slate-700"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
