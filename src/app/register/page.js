"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const f = Object.fromEntries(new FormData(e.target));
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not create the account.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: f.email, password: f.password, redirect: false });
    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold">Create your account</h1>
      <p className="mt-1 text-mute">It takes a minute, and free courses are open right away.</p>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-4 p-6">
        <div>
          <label className="label">Full name</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label">Password (6+ characters)</label>
          <input name="password" type="password" minLength={6} required className="input" />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary py-2.5" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        <p className="text-center text-sm text-mute">
          Already registered? <Link href="/login" className="font-semibold text-brand">Log in</Link>
        </p>
      </form>
    </div>
  );
}
