import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { stripe, stripeEnabled, enroll } from "@/lib/payments";
import { Course, Payment } from "@/models";

export async function POST(req) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  const { courseId } = await req.json();
  if (!mongoose.isValidObjectId(courseId)) return NextResponse.json({ error: "Course not found." }, { status: 404 });
  await connectDB();
  const course = await Course.findById(courseId).lean();
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

  if (course.price <= 0) {
    await enroll(s.user.id, course._id);
    return NextResponse.json({ url: `/courses/${courseId}/learn` });
  }

  const payment = await Payment.create({
    user: s.user.id,
    course: course._id,
    amount: course.price,
    provider: stripeEnabled ? "stripe" : "demo",
  });

  if (!stripeEnabled) return NextResponse.json({ url: `/checkout/demo?paymentId=${payment._id}` });

  const origin = req.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: s.user.email,
    line_items: [
      { quantity: 1, price_data: { currency: "usd", unit_amount: Math.round(course.price * 100), product_data: { name: course.title } } },
    ],
    metadata: { paymentId: String(payment._id) },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/courses/${courseId}`,
  });
  payment.sessionId = session.id;
  await payment.save();
  return NextResponse.json({ url: session.url });
}
