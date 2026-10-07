import Link from "next/link";
import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Course, Lesson, Enrollment } from "@/models";
import { plain } from "@/lib/utils";
import Player from "@/components/Player";

export default async function LearnPage({ params, searchParams }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await connectDB();
  const course = plain(await Course.findById(params.id).lean());
  if (!course) notFound();
  const lessons = plain(await Lesson.find({ course: params.id }).sort({ order: 1 }).lean());
  const session = await getSession();
  const full = !!session && (session.user.role === "admin" || !!(await Enrollment.exists({ user: session.user.id, course: params.id })));

  const current = lessons.find((l) => l._id === searchParams.lesson) || (full ? lessons[0] : lessons.find((l) => l.isPreview));
  if (!current || (!full && !current.isPreview)) redirect(`/courses/${params.id}`);

  const idx = lessons.findIndex((l) => l._id === current._id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const canOpen = (l) => full || l.isPreview;
  const go = (l) => `/courses/${params.id}/learn?lesson=${l._id}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <Link href={`/courses/${params.id}`} className="text-sm font-semibold text-brand">Back to {course.title}</Link>
        <div className="mt-3"><Player url={current.videoUrl} title={current.title} /></div>
        <h1 className="mt-5 text-3xl font-extrabold">{current.title}</h1>
        {current.description && <p className="mt-2 text-mute">{current.description}</p>}
        <div className="mt-6 flex gap-2">
          {prev && canOpen(prev) && <Link href={go(prev)} className="btn btn-ghost">Previous lesson</Link>}
          {next && canOpen(next) && <Link href={go(next)} className="btn btn-primary">Next lesson</Link>}
        </div>
      </div>
      <aside className="card h-fit">
        <h2 className="border-b border-line p-4 text-lg font-extrabold">Course lessons</h2>
        <ol>
          {lessons.map((l, i) => (
            <li key={l._id} className="border-b border-line last:border-0">
              {canOpen(l) ? (
                <Link href={go(l)} className={`flex gap-3 p-3 text-sm hover:bg-paper/60 ${l._id === current._id ? "bg-brand/10 font-bold text-brand" : ""}`}>
                  <span className="w-5 text-mute">{i + 1}</span>{l.title}
                </Link>
              ) : (
                <div className="flex gap-3 p-3 text-sm text-mute"><span className="w-5">{i + 1}</span>{l.title}</div>
              )}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
