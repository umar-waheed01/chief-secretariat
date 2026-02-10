import { createClient } from "@/lib/supabase/server";
import { ShoppingItemRow } from "@/components/shopping-item-row";

export default async function ShoppingPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("shopping_items")
    .select("id, inbox_item_id, item_name, store, done")
    .order("id", { ascending: true });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Shopping List</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Checkable items</p>
      </div>
      {!items?.length ? (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted)]">No shopping items yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 shadow-sm"
            >
              <ShoppingItemRow
                id={item.id}
                itemName={item.item_name}
                store={item.store}
                done={item.done}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
