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
    <label className="flex items-center gap-2 py-1 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
        disabled={loading}
        className="rounded"
      />
      <span className={checked ? "line-through text-gray-500" : ""}>
        {itemName}
      </span>
      {store && <span className="text-gray-400 text-xs">({store})</span>}
    </label>
  );
}
