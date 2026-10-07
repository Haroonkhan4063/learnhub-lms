import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Course, Lesson, Enrollment } from "@/models";
import { plain, money } from "@/lib/utils";
import { enrollFree } from "@/app/actions";
import { Thumb } from "@/components/CourseCard";

export default async function CourseDetail({ params }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await connectDB();
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";
  const course = plain(await Course.findById(params.id).populate("category", "name").lean());
  if (!course || (!course.published && !isAdmin)) notFound();
  const lessons = plain(await Lesson.find({ course: params.id }).select("title duration order isPreview").sort({ order: 1 }).lean());
  const enrolled = !!session && (isAdmin || !!(await Enrollment.exists({ user: session.user.id, course: params.id })));
  const minutes = lessons.reduce((s, l) => s + (l.duration || 0), 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        {course.category?.name && <p className="font-semibold text-brand">{course.category.name}</p>}
        <h1 className="mt-1 text-4xl font-extrabold leading-tight">{course.title}</h1>
        <p className="mt-4 whitespace-pre-line text-lg text-mute">{course.description}</p>
        <p className="mt-3 text-sm text-mute">{lessons.length} lessons, about {minutes} minutes in total</p>

        <h2 className="mt-8 text-2xl font-extrabold">Lessons</h2>
        <ol className="card mt-3 divide-y divide-line">
          {lessons.map((l, i) => {
            const open = enrolled || l.isPreview;
            const row = (
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm text-mute">{i + 1}</span>
                  <span className={open ? "font-semibold" : "text-mute"}>{l.title}</span>
                  {l.isPreview && !enrolled && <span className="chip">Free preview</span>}
                </div>
                <span className="text-sm text-mute">{open ? `${l.duration || 0} min` : "Locked"}</span>
              </div>
            );
            return (
              <li key={l._id}>
                {open ? <Link href={`/courses/${course._id}/learn?lesson=${l._id}`} className="block hover:bg-paper/60">{row}</Link> : row}
              </li>
            );
          })}
          {!lessons.length && <li className="p-4 text-mute">Lessons will be added soon.</li>}
        </ol>
      </div>

      <aside className="h-fit overflow-hidden card lg:sticky lg:top-20">
        <Thumb course={course} className="h-44" />
        <div className="grid gap-3 p-5">
          <p className="font-display text-3xl font-extrabold">{money(course.price)}</p>
          {enrolled ? (
            <Link href={`/courses/${course._id}/learn`} className="btn btn-primary py-3 text-base">Continue learning</Link>
          ) : !session ? (
            <Link href={`/login?callbackUrl=/courses/${course._id}`} className="btn btn-primary py-3 text-base">
              {course.price > 0 ? "Log in to buy" : "Log in to enroll"}
            </Link>
          ) : course.price > 0 ? (
            <Link href={`/checkout/${course._id}`} className="btn btn-primary py-3 text-base">Buy this course</Link>
          ) : (
            <form action={enrollFree}>
              <input type="hidden" name="courseId" value={course._id} />
              <button className="btn btn-primary w-full py-3 text-base">Enroll for free</button>
            </form>
          )}
          <p className="text-sm text-mute">Lifetime access to every lesson in this course.</p>
        </div>
      </aside>
    </div>
  );
}
