import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/signup-form";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--background)]">
      <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-[var(--foreground)] mb-1">Create account</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Sign up for Chief Secretariat</p>
        <SignupForm />
        <p className="text-sm text-[var(--muted)] mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-[var(--primary)] hover:underline focus-ring rounded">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
