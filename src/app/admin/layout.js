import Link from "next/link";
import { requireAdmin } from "@/lib/guards";

const links = [
  ["/admin", "Overview"],
  ["/admin/courses", "Courses"],
  ["/admin/categories", "Categories"],
  ["/admin/users", "Users"],
];

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return (
    <div className="grid gap-6 md:grid-cols-[190px_1fr]">
      <aside className="card flex h-fit gap-1 p-2 md:flex-col">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-paper">{label}</Link>
        ))}
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
