"use client";

import { useState, useCallback } from "react";
import { Toast } from "@/components/toast";

export function CaptureForm() {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = rawText.trim();
      if (!text || loading) return;
      setLoading(true);
      try {
        const res = await fetch("/api/inbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw_text: text }),
        });
        const data = await res.json();
        if (!res.ok) {
          setToast(data.error || "Failed to save");
          return;
        }
        setToast(data.message || "Saved");
        setRawText("");
      } catch {
        setToast("Network error");
      } finally {
        setLoading(false);
      }
    },
    [rawText, loading]
  );

  return (
    <>
      <form onSubmit={submit} className="px-4 py-3 border-b border-gray-200">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Capture a note…"
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !rawText.trim()}
          className="mt-2 px-4 py-1.5 bg-gray-800 text-white text-sm rounded disabled:opacity-50"
        >
          {loading ? "Saving…" : "Capture"}
        </button>
      </form>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
