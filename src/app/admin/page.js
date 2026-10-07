import connectDB from "@/lib/db";
import { User, Course, Lesson, Enrollment, Payment } from "@/models";
import { plain, money } from "@/lib/utils";

export default async function AdminOverview() {
  await connectDB();
  const [users, courses, lessons, enrollments, revenue, recent] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Lesson.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Payment.find({ status: "paid" }).populate("user", "name email").populate("course", "title").sort({ createdAt: -1 }).limit(8).lean().then(plain),
  ]);
  const stats = [
    ["Users", users],
    ["Courses", courses],
    ["Lessons", lessons],
    ["Enrollments", enrollments],
    ["Revenue", `$${revenue[0]?.total || 0}`],
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-sm text-mute">{label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-3 text-xl font-extrabold">Recent purchases</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr><th className="th">Student</th><th className="th">Course</th><th className="th">Amount</th><th className="th">Date</th></tr></thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p._id} className="border-t border-line">
                  <td className="td">{p.user?.name || "Deleted user"}</td>
                  <td className="td">{p.course?.title || "Deleted course"}</td>
                  <td className="td">{money(p.amount)}</td>
                  <td className="td">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
              {!recent.length && <tr><td className="td text-mute" colSpan={4}>No purchases yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
