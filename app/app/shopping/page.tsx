import { createClient } from "@/lib/supabase/server";
import { ShoppingItemRow } from "@/components/shopping-item-row";

export default async function ShoppingPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("shopping_items")
    .select("id, inbox_item_id, item_name, store, done")
    .order("id", { ascending: true });

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Shopping List</h1>
      {!items?.length ? (
        <p className="text-gray-500 text-sm">No shopping items yet.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 rounded px-3 py-2"
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
