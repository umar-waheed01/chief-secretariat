import Link from "next/link";

const views = [
  { href: "/app/inbox", label: "Inbox", desc: "All captured items" },
  { href: "/app/today", label: "Today", desc: "Due today" },
  { href: "/app/tomorrow", label: "Tomorrow", desc: "Due tomorrow" },
  {
    href: "/app/next-7-days",
    label: "Next 7 Days",
    desc: "Due in the next week",
  },
  { href: "/app/shopping", label: "Shopping List", desc: "Checkable items" },
  { href: "/app/ideas", label: "Ideas", desc: "Ideas list" },
  { href: "/app/unsure", label: "Unsure", desc: "Review queue" },
];

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Quick access to your views</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {views.map(({ href, label, desc }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm transition-colors hover:border-[var(--primary)]/30 hover:shadow focus-ring"
            >
              <span className="font-medium text-[var(--foreground)]">{label}</span>
              <span className="mt-1 text-sm text-[var(--muted)]">{desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
