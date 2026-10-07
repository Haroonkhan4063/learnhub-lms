import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { stripe, fulfill } from "@/lib/payments";
import { Payment } from "@/models";

export default async function Success({ searchParams }) {
  const user = await requireUser();
  await connectDB();
  let payment = null;
  try {
    if (searchParams.session_id && stripe) {
      const cs = await stripe.checkout.sessions.retrieve(searchParams.session_id);
      if (cs.payment_status === "paid" && cs.metadata?.paymentId) payment = await fulfill(cs.metadata.paymentId);
    } else if (mongoose.isValidObjectId(searchParams.paymentId)) {
      payment = await Payment.findOne({ _id: searchParams.paymentId, status: "paid" });
    }
  } catch {}
  const ok = payment && String(payment.user) === user.id;

  return (
    <div className="mx-auto max-w-md text-center">
      {ok ? (
        <>
          <h1 className="text-3xl font-extrabold">Payment received</h1>
          <p className="mt-2 text-mute">You are enrolled. Your lessons are unlocked.</p>
          <Link href={`/courses/${payment.course}/learn`} className="btn btn-primary mt-6 px-6 py-3">Start learning</Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold">We could not confirm this payment</h1>
          <p className="mt-2 text-mute">If money was taken, wait a minute and open My learning. Otherwise try the purchase again.</p>
          <Link href="/dashboard" className="btn btn-primary mt-6 px-6 py-3">Go to My learning</Link>
        </>
      )}
    </div>
  );
}
