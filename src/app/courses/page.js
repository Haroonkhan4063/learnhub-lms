import connectDB from "@/lib/db";
import { listCourses } from "@/lib/queries";
import { Category } from "@/models";
import { escapeRegex, plain } from "@/lib/utils";
import CourseCard from "@/components/CourseCard";

export const metadata = { title: "Courses | LearnHub" };

export default async function CoursesPage({ searchParams }) {
  await connectDB();
  const cats = plain(await Category.find().sort("name").lean());
  const filter = { published: true };
  const q = (searchParams.q || "").trim();
  if (q) filter.title = { $regex: escapeRegex(q), $options: "i" };
  const cat = cats.find((c) => c.slug === searchParams.category);
  if (cat) filter.category = cat._id;
  const courses = await listCourses(filter);

  return (
    <div>
      <h1 className="text-4xl font-extrabold">All courses</h1>
      <form className="mt-5 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search courses" className="input max-w-xs" />
        <select name="category" defaultValue={cat?.slug || ""} className="input max-w-[220px]">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary">Filter</button>
      </form>
      {courses.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => <CourseCard key={c._id} course={c} />)}
        </div>
      ) : (
        <div className="card mt-6 p-8 text-mute">No course matches this search. Try a different word or category.</div>
      )}
    </div>
  );
}
