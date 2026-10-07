import Stripe from "stripe";
import { Payment, Enrollment } from "@/models";

export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;
export const stripe = stripeEnabled ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function enroll(user, course) {
  const exists = await Enrollment.exists({ user, course });
  if (exists) return;
  try {
    await Enrollment.create({ user, course });
  } catch (e) {
    if (e.code !== 11000) throw e;
  }
}

export async function fulfill(paymentId) {
  const p = await Payment.findById(paymentId);
  if (!p) return null;
  if (p.status !== "paid") {
    p.status = "paid";
    await p.save();
  }
  await enroll(p.user, p.course);
  return p;
}
