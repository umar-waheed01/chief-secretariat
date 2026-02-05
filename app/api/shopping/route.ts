import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** PATCH: toggle shopping_items.done (manual override). */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; done?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = body.id;
  const done = body.done;
  if (typeof id !== "string" || typeof done !== "boolean") {
    return NextResponse.json(
      { error: "id (string) and done (boolean) required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("shopping_items")
    .update({ done })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update", details: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, id: data?.id });
}
