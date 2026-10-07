import Link from "next/link";
import { listCourses } from "@/lib/queries";
import { money } from "@/lib/utils";
import { deleteCourse } from "@/app/actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function AdminCourses() {
  const courses = await listCourses({});
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Courses</h1>
        <Link href="/admin/courses/new" className="btn btn-primary">New course</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th className="th">Title</th><th className="th">Category</th><th className="th">Price</th><th className="th">Lessons</th><th className="th">Status</th><th className="th"></th></tr></thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t border-line">
                <td className="td font-semibold">{c.title}</td>
                <td className="td">{c.category?.name || "-"}</td>
                <td className="td">{money(c.price)}</td>
                <td className="td">{c.lessonCount}</td>
                <td className="td">{c.published ? "Published" : "Draft"}</td>
                <td className="td">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/courses/${c._id}`} className="btn btn-ghost">Edit</Link>
                    <form action={deleteCourse}>
                      <input type="hidden" name="id" value={c._id} />
                      <ConfirmButton message="Delete this course with all its lessons and enrollments?">Delete</ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!courses.length && <tr><td className="td text-mute" colSpan={6}>No courses yet. Create the first one.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
