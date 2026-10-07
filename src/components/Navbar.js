import Link from "next/link";
import { getSession } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

const linkStyle = "rounded-lg px-3 py-2 text-sm font-semibold text-mute transition hover:bg-paper hover:text-ink";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const links = [{ href: "/courses", label: "Courses" }];
  if (user && !isAdmin) links.push({ href: "/dashboard", label: "My learning" });
  if (isAdmin) links.push({ href: "/admin", label: "Admin" });

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white shadow-[0_2px_16px_rgba(16,26,61,0.06)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-[0_6px_14px_rgba(61,61,245,0.35)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
            </span>
            <span className="font-display text-xl font-extrabold">LearnHub</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkStyle}>{l.label}</Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                {user.name?.[0]?.toUpperCase()}
              </span>
              <span className="hidden text-sm font-semibold sm:block">{user.name?.split(" ")[0]}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className={linkStyle}>Log in</Link>
              <Link href="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-line px-3 py-1.5 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={linkStyle}>{l.label}</Link>
        ))}
      </nav>
    </header>
  );
}
