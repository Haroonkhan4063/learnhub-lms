import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { fulfill } from "@/lib/payments";
import { Payment } from "@/models";

export async function POST(req) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  const { paymentId } = await req.json();
  if (!mongoose.isValidObjectId(paymentId)) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  await connectDB();
  const p = await Payment.findOne({ _id: paymentId, user: s.user.id, provider: "demo" });
  if (!p) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  await fulfill(p._id);
  return NextResponse.json({ ok: true });
}
