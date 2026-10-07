import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { Enrollment, Payment, Lesson } from "@/models";
import { plain, money } from "@/lib/utils";
import CourseCard from "@/components/CourseCard";

export const metadata = { title: "My learning | LearnHub" };

export default async function Dashboard() {
  const user = await requireUser();
  if (user.role === "admin") redirect("/admin");
  await connectDB();
  const enrollments = plain(
    await Enrollment.find({ user: user.id }).populate({ path: "course", populate: { path: "category", select: "name" } }).sort({ createdAt: -1 }).lean()
  ).filter((e) => e.course);
  const payments = plain(await Payment.find({ user: user.id, status: "paid" }).populate("course", "title").sort({ createdAt: -1 }).lean());

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold">Hi {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-mute">Your enrolled courses are below.</p>
      </div>
      {enrollments.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => <CourseCard key={e._id} course={e.course} href={`/courses/${e.course._id}/learn`} />)}
        </div>
      ) : (
        <div className="card p-8">
          <p className="text-mute">You have not enrolled in any course yet.</p>
          <Link href="/courses" className="btn btn-primary mt-4">Browse courses</Link>
        </div>
      )}
      {payments.length > 0 && (
        <section>
          <h2 className="mb-3 text-2xl font-extrabold">Payment history</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr><th className="th">Course</th><th className="th">Amount</th><th className="th">Date</th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t border-line">
                    <td className="td">{p.course?.title || "Deleted course"}</td>
                    <td className="td">{money(p.amount)}</td>
                    <td className="td">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
