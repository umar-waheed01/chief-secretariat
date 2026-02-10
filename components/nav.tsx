"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return [
      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring",
      isActive
        ? "bg-[var(--primary-muted)] text-[var(--primary)]"
        : "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--card)] shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Link
            href="/app"
            className="shrink-0 text-base font-semibold text-[var(--foreground)] focus-ring rounded-lg px-2 py-1 -mx-1"
          >
            Chief Secretariat
          </Link>
          {/* Desktop nav: horizontal scroll on small, full on large */}
          <nav
            className="hidden flex-1 overflow-x-auto scrollbar-none sm:block"
            aria-label="Main"
          >
            <ul className="flex gap-0.5 sm:gap-1">
              {links.slice(1).map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={linkClass(href)}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] focus-ring sm:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={signOut}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] focus-ring"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav
          className="border-t border-[var(--card-border)] bg-[var(--card)] px-4 py-3 sm:hidden"
          aria-label="Main mobile"
        >
          <ul className="flex flex-col gap-0.5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={linkClass(href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
