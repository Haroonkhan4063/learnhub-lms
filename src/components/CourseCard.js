import Link from "next/link";
import { money } from "@/lib/utils";
import { courseImage } from "@/lib/images";
import SafeImage from "./SafeImage";

export function Thumb({ course, className = "h-48" }) {
  return <SafeImage src={courseImage(course)} alt={course.title} className={`${className} w-full object-cover`} />;
}

export default function CourseCard({ course, href }) {
  const free = !(course.price > 0);
  return (
    <Link
      href={href || `/courses/${course._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(16,26,61,0.05)] transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_16px_36px_rgba(61,61,245,0.14)]"
    >
      <div className="relative overflow-hidden bg-paper">
        <SafeImage
          src={courseImage(course)}
          alt={course.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {course.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {course.category.name}
          </span>
        )}
        {!href && (
          <span
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-bold shadow-md ${
              free ? "bg-emerald-100 text-emerald-800" : "bg-white text-ink"
            }`}
          >
            {money(course.price)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-brand">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{course.description}</p>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
            <span className="text-mute">{course.lessonCount !== undefined ? `${course.lessonCount} lessons` : ""}</span>
            <span className="font-semibold text-brand">{href ? "Continue learning" : "View course"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
