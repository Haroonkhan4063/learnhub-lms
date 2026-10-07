import Link from "next/link";
import { getSession } from "@/lib/auth";

const linkStyle = "text-sm text-mute transition hover:text-brand";

export default async function Footer() {
  const session = await getSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white shadow-[0_-2px_16px_rgba(16,26,61,0.04)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
            </span>
            <span className="font-display text-xl font-extrabold">LearnHub</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
            Video courses in web development, data and design, with free preview lessons so you can try before you buy.
          </p>
        </div>
        <div>
          <h3 className="font-sans text-sm font-bold">Explore</h3>
          <ul className="mt-4 grid gap-2.5">
            <li><Link href="/" className={linkStyle}>Home</Link></li>
            <li><Link href="/courses" className={linkStyle}>All courses</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-bold">Account</h3>
          <ul className="mt-4 grid gap-2.5">
            {user ? (
              <li>
                <Link href={isAdmin ? "/admin" : "/dashboard"} className={linkStyle}>
                  {isAdmin ? "Admin dashboard" : "My learning"}
                </Link>
              </li>
            ) : (
              <>
                <li><Link href="/login" className={linkStyle}>Log in</Link></li>
                <li><Link href="/register" className={linkStyle}>Create account</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} LearnHub. All rights reserved.</p>
          <p>Built by Muhammad Haroon Khan</p>
        </div>
      </div>
    </footer>
  );
}
