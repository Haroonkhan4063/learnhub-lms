import connectDB from "./db";
import { Course, Lesson } from "@/models";
import { plain } from "./utils";

export async function listCourses(filter = {}, limit = 0) {
  await connectDB();
  let q = Course.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
  if (limit) q = q.limit(limit);
  const courses = await q.lean();
  const counts = await Lesson.aggregate([
    { $match: { course: { $in: courses.map((c) => c._id) } } },
    { $group: { _id: "$course", n: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  return plain(courses.map((c) => ({ ...c, lessonCount: map[String(c._id)] || 0 })));
}
