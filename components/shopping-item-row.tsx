"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ShoppingItemRow({
  id,
  itemName,
  store,
  done,
}: {
  id: string;
  itemName: string;
  store: string;
  done: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(done);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const newDone = !checked;
    setChecked(newDone);
    try {
      const res = await fetch("/api/shopping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: newDone }),
      });
      if (!res.ok) setChecked(checked);
      else router.refresh();
    } catch {
      setChecked(checked);
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-[var(--foreground)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
        disabled={loading}
        className="h-4 w-4 rounded border-[var(--card-border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0"
      />
      <span className={checked ? "line-through text-[var(--muted)]" : ""}>
        {itemName}
      </span>
      {store && (
        <span className="text-xs text-[var(--muted)]">({store})</span>
      )}
    </label>
  );
}
