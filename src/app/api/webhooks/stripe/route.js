import connectDB from "@/lib/db";
import { stripe, fulfill } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!stripe) return new Response("Stripe is not enabled", { status: 501 });
  let event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    await connectDB();
    const id = event.data.object.metadata?.paymentId;
    if (id) await fulfill(id);
  }
  return new Response("ok");
}
