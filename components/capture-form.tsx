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
      <form
        onSubmit={submit}
        className="border-b border-[var(--card-border)] bg-[var(--card)] px-4 py-4 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <label htmlFor="capture-input" className="sr-only">
            Capture a note
          </label>
          <textarea
            id="capture-input"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Capture a note…"
            rows={2}
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)] resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-60"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !rawText.trim()}
            className="mt-3 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:pointer-events-none focus-ring transition-colors"
          >
            {loading ? "Saving…" : "Capture"}
          </button>
        </div>
      </form>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
