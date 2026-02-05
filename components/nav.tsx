"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/app", label: "Home" },
  { href: "/app/inbox", label: "Inbox" },
  { href: "/app/today", label: "Today" },
  { href: "/app/tomorrow", label: "Tomorrow" },
  { href: "/app/next-7-days", label: "Next 7 Days" },
  { href: "/app/shopping", label: "Shopping" },
  { href: "/app/ideas", label: "Ideas" },
  { href: "/app/unsure", label: "Unsure" },
];

export function Nav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-gray-200 px-4 py-2 flex flex-wrap gap-2 items-center">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={
            pathname === href
              ? "text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }
        >
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={signOut}
        className="ml-auto text-gray-500 hover:text-gray-700 text-sm"
      >
        Sign out
      </button>
    </nav>
  );
}
