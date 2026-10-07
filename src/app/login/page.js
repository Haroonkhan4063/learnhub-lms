"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const f = new FormData(e.target);
    const res = await signIn("credentials", { email: f.get("email"), password: f.get("password"), redirect: false });
    if (res?.error) {
      setError("Email or password is wrong.");
      setLoading(false);
      return;
    }
    const cb = new URLSearchParams(window.location.search).get("callbackUrl");
    const safe = cb && (cb.startsWith("/") || cb.startsWith(window.location.origin));
    window.location.href = safe ? cb : "/dashboard";
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold">Welcome back</h1>
      <p className="mt-1 text-mute">Log in to continue your courses.</p>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-4 p-6">
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label">Password</label>
          <input name="password" type="password" required className="input" />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary py-2.5" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
        <p className="text-center text-sm text-mute">
          New here? <Link href="/register" className="font-semibold text-brand">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
