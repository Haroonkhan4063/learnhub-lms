import Link from "next/link";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listCourses } from "@/lib/queries";
import { Category, Course, Lesson, User } from "@/models";
import { plain } from "@/lib/utils";
import CourseCard from "@/components/CourseCard";

const steps = [
  { title: "Find a course", text: "Search the catalog or browse by category, and watch the free preview lesson first." },
  { title: "Enroll or buy", text: "Free courses open instantly. Paid courses unlock right after a quick checkout." },
  { title: "Learn at your pace", text: "Stream every lesson on your phone or laptop, whenever it suits you." },
];

export default async function Home() {
  await connectDB();
  const session = await getSession();
  const [courses, cats, nCourses, nLessons, nUsers] = await Promise.all([
    listCourses({ published: true }, 6),
    Category.find().sort("name").lean().then(plain),
    Course.countDocuments({ published: true }),
    Lesson.countDocuments(),
    User.countDocuments(),
  ]);
  const stats = [
    [nCourses, "Courses"],
    [nLessons, "Video lessons"],
    [nUsers, "Learners"],
  ];

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-12 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.05] md:text-6xl">Learn the skills that get you hired.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">
            Video courses in web development, data and design. Watch the first lesson free, then buy only the courses you want to finish.
          </p>
          <form
            action="/courses"
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white p-1.5 shadow-[0_10px_30px_rgba(16,26,61,0.08)]"
          >
            <svg viewBox="0 0 24 24" className="ml-3 h-5 w-5 shrink-0 text-mute" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              name="q"
              placeholder="Search JavaScript, SQL, design..."
              className="w-full bg-transparent px-1 py-2.5 text-sm outline-none placeholder:text-mute/70"
            />
            <button className="btn btn-primary rounded-full px-6 py-2.5">Search</button>
          </form>
          {cats.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-mute">Popular:</span>
              {cats.slice(0, 4).map((c) => (
                <Link
                  key={c._id}
                  href={`/courses?category=${c.slug}`}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold transition hover:border-brand hover:text-brand"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto hidden h-[400px] w-full max-w-md sm:block">
          <img
            src="/thumbs/nextjs.jpg"
            alt=""
            className="absolute right-0 top-0 h-56 w-72 rotate-3 rounded-2xl border-4 border-white object-cover shadow-[0_20px_44px_rgba(16,26,61,0.18)]"
          />
          <img
            src="/thumbs/python-data.jpg"
            alt=""
            className="absolute bottom-0 left-0 h-56 w-72 -rotate-3 rounded-2xl border-4 border-white object-cover shadow-[0_20px_44px_rgba(16,26,61,0.18)]"
          />
          <div className="absolute left-2 top-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_14px_32px_rgba(16,26,61,0.14)]">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold">Free preview</p>
              <p className="text-xs text-mute">Watch before you buy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card grid grid-cols-3 divide-x divide-line">
        {stats.map(([n, label]) => (
          <div key={label} className="px-4 py-6 text-center">
            <p className="font-display text-3xl font-extrabold md:text-4xl">{n}</p>
            <p className="mt-1 text-sm text-mute">{label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-extrabold">Latest courses</h2>
          <Link href="/courses" className="font-semibold text-brand hover:underline">See all courses</Link>
        </div>
        {courses.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
        ) : (
          <div className="card p-10 text-center text-mute">No courses yet. Open the seed link from the README to add sample courses.</div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-extrabold">How it works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {!session && (
        <section className="rounded-3xl bg-gradient-to-br from-brand to-[#6B4DFF] px-8 py-14 text-center text-white md:px-16">
          <h2 className="text-3xl font-extrabold md:text-4xl">Start with a free lesson.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">Create an account in a minute and begin learning today.</p>
          <Link href="/register" className="btn mt-7 bg-white px-7 py-3 text-base text-brand hover:bg-sun hover:text-ink">
            Create free account
          </Link>
        </section>
      )}
    </div>
  );
}
