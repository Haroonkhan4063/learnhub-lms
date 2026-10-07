import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { stripeEnabled } from "@/lib/payments";
import { Course, Enrollment } from "@/models";
import { plain, money } from "@/lib/utils";
import { Thumb } from "@/components/CourseCard";
import PayButton from "@/components/PayButton";

export default async function Checkout({ params }) {
  const user = await requireUser();
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await connectDB();
  const course = plain(await Course.findById(params.id).lean());
  if (!course) notFound();
  if (course.price <= 0 || (await Enrollment.exists({ user: user.id, course: params.id }))) redirect(`/courses/${params.id}`);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <div className="card mt-5 overflow-hidden">
        <Thumb course={course} className="h-32" />
        <div className="grid gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <span className="font-display text-2xl font-extrabold">{money(course.price)}</span>
          </div>
          <PayButton courseId={course._id} label={`Pay ${money(course.price)}`} />
          <p className="text-sm text-mute">
            {stripeEnabled ? "You will be sent to Stripe's secure payment page (test mode)." : "Demo mode: no real money is charged."}
          </p>
        </div>
      </div>
    </div>
  );
}
