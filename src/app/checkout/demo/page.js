import mongoose from "mongoose";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { Payment } from "@/models";
import { plain } from "@/lib/utils";
import DemoCardForm from "@/components/DemoCardForm";

export default async function DemoCheckout({ searchParams }) {
  const user = await requireUser();
  if (!mongoose.isValidObjectId(searchParams.paymentId)) notFound();
  await connectDB();
  const payment = plain(await Payment.findOne({ _id: searchParams.paymentId, user: user.id, status: "pending" }).populate("course", "title").lean());
  if (!payment) notFound();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold">Test payment</h1>
      <p className="mt-1 text-mute">This is a built-in test gateway. Use the card below, no real money moves.</p>
      <div className="card mt-5 grid gap-4 p-6">
        <p className="font-semibold">{payment.course?.title} <span className="chip ml-2">${payment.amount}</span></p>
        <DemoCardForm paymentId={payment._id} amount={payment.amount} />
      </div>
    </div>
  );
}
