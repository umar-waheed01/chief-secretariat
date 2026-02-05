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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg text-sm z-50"
      role="status"
    >
      {message}
    </div>
  );
}
