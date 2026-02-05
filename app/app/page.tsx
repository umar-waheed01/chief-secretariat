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
    <div>
      <h1 className="text-lg font-semibold mb-4">Chief Secretariat</h1>
      <ul className="space-y-2">
        {views.map(({ href, label, desc }) => (
          <li key={href}>
            <Link href={href} className="text-blue-600 hover:underline">
              {label}
            </Link>
            <span className="text-gray-500 text-sm ml-2">{desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
