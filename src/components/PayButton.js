"use client";
import { useState } from "react";

export default function PayButton({ courseId, label }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={pay} disabled={loading} className="btn btn-primary w-full py-3 text-base">
        {loading ? "Please wait..." : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
