"use client";
import { useState } from "react";

export default function DemoCardForm({ paymentId, amount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      window.location.href = `/checkout/success?paymentId=${paymentId}`;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div>
        <label className="label">Card number</label>
        <input className="input" defaultValue="4242 4242 4242 4242" readOnly />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Expiry</label>
          <input className="input" defaultValue="12 / 30" readOnly />
        </div>
        <div>
          <label className="label">CVC</label>
          <input className="input" defaultValue="123" readOnly />
        </div>
      </div>
      <button className="btn btn-primary py-3 text-base" disabled={loading}>
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
