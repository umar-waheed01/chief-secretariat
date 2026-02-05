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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-6">
        <h1 className="text-lg font-semibold mb-4">Sign up</h1>
        <SignupForm />
        <p className="text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
