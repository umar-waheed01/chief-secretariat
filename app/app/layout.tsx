import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import { CaptureForm } from "@/components/capture-form";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <CaptureForm />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
