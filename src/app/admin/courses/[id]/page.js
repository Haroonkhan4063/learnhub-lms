import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Category, Course, Lesson } from "@/models";
import { plain } from "@/lib/utils";
import { deleteLesson } from "@/app/actions";
import CourseForm from "@/components/CourseForm";
import LessonForm from "@/components/LessonForm";
import ConfirmButton from "@/components/ConfirmButton";

export default async function EditCourse({ params, searchParams }) {
  if (!mongoose.isValidObjectId(params.id)) notFound();
  await connectDB();
  const course = plain(await Course.findById(params.id).lean());
  if (!course) notFound();
  const categories = plain(await Category.find().sort("name").lean());
  const lessons = plain(await Lesson.find({ course: params.id }).sort({ order: 1 }).lean());
  const editing = searchParams.edit ? lessons.find((l) => l._id === searchParams.edit) : null;

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Edit course</h1>
          <Link href={`/courses/${course._id}`} className="btn btn-ghost">View as student</Link>
        </div>
        <CourseForm course={course} categories={categories} />
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-extrabold">Lessons ({lessons.length})</h2>
        <div className="card divide-y divide-line">
          {lessons.map((l) => (
            <div key={l._id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-semibold">
                  <span className="mr-2 text-mute">{l.order}.</span>{l.title}
                  {l.isPreview && <span className="chip ml-2">Free preview</span>}
                </p>
                <p className="truncate text-xs text-mute">{l.videoUrl || "No video yet"}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/admin/courses/${course._id}?edit=${l._id}`} className="btn btn-ghost">Edit</Link>
                <form action={deleteLesson}>
                  <input type="hidden" name="id" value={l._id} />
                  <input type="hidden" name="courseId" value={course._id} />
                  <ConfirmButton message="Delete this lesson?">Delete</ConfirmButton>
                </form>
              </div>
            </div>
          ))}
          {!lessons.length && <p className="p-4 text-mute">No lessons yet. Add the first one below.</p>}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-extrabold">{editing ? `Edit lesson: ${editing.title}` : "Add a lesson"}</h2>
        <LessonForm key={editing?._id || "new"} courseId={course._id} lesson={editing} />
      </div>
    </div>
  );
}
