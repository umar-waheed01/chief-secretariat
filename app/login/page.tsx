import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-6">
        <h1 className="text-lg font-semibold mb-4">Log in</h1>
        <LoginForm />
        <p className="text-sm text-gray-500 mt-4">
          No account?{" "}
          <a href="/signup" className="text-blue-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
