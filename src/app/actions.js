"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/guards";
import { enroll } from "@/lib/payments";
import { slugify } from "@/lib/utils";
import { Category, Course, Lesson, Enrollment, Payment, User } from "@/models";

const refresh = () => revalidatePath("/", "layout");

export async function saveCourse(fd) {
  await requireAdmin();
  await connectDB();
  const data = {
    title: String(fd.get("title") || "").trim(),
    description: String(fd.get("description") || "").trim(),
    price: Math.max(0, Number(fd.get("price")) || 0),
    category: fd.get("category") || null,
    thumbnail: String(fd.get("thumbnail") || "").trim(),
    published: fd.get("published") === "on",
  };
  const id = fd.get("id");
  const course = id ? await Course.findByIdAndUpdate(id, data, { new: true }) : await Course.create(data);
  refresh();
  redirect(`/admin/courses/${course._id}`);
}

export async function deleteCourse(fd) {
  await requireAdmin();
  await connectDB();
  const id = fd.get("id");
  await Lesson.deleteMany({ course: id });
  await Enrollment.deleteMany({ course: id });
  await Course.findByIdAndDelete(id);
  refresh();
  redirect("/admin/courses");
}

export async function saveLesson(fd) {
  await requireAdmin();
  await connectDB();
  const courseId = fd.get("courseId");
  const id = fd.get("id");
  const data = {
    title: String(fd.get("title") || "").trim(),
    description: String(fd.get("description") || "").trim(),
    videoUrl: String(fd.get("videoUrl") || "").trim(),
    duration: Number(fd.get("duration")) || 0,
    isPreview: fd.get("isPreview") === "on",
  };
  if (id) {
    if (fd.get("order")) data.order = Number(fd.get("order"));
    await Lesson.findByIdAndUpdate(id, data);
  } else {
    data.course = courseId;
    data.order = Number(fd.get("order")) || (await Lesson.countDocuments({ course: courseId })) + 1;
    await Lesson.create(data);
  }
  refresh();
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteLesson(fd) {
  await requireAdmin();
  await connectDB();
  await Lesson.findByIdAndDelete(fd.get("id"));
  refresh();
  redirect(`/admin/courses/${fd.get("courseId")}`);
}

export async function saveCategory(fd) {
  await requireAdmin();
  await connectDB();
  const name = String(fd.get("name") || "").trim();
  if (!name) return;
  const slug = slugify(name);
  await Category.updateOne({ slug }, { name, slug }, { upsert: true });
  refresh();
}

export async function deleteCategory(fd) {
  await requireAdmin();
  await connectDB();
  const id = fd.get("id");
  await Course.updateMany({ category: id }, { $set: { category: null } });
  await Category.findByIdAndDelete(id);
  refresh();
}

export async function setUserRole(fd) {
  const me = await requireAdmin();
  await connectDB();
  const id = fd.get("id");
  const role = fd.get("role");
  if (id === me.id || !["student", "admin"].includes(role)) return;
  await User.findByIdAndUpdate(id, { role });
  refresh();
}

export async function deleteUser(fd) {
  const me = await requireAdmin();
  await connectDB();
  const id = fd.get("id");
  if (id === me.id) return;
  await Enrollment.deleteMany({ user: id });
  await Payment.deleteMany({ user: id });
  await User.findByIdAndDelete(id);
  refresh();
}

export async function enrollFree(fd) {
  const user = await requireUser();
  await connectDB();
  const courseId = fd.get("courseId");
  const course = await Course.findById(courseId).lean();
  if (!course || course.price > 0) redirect(`/courses/${courseId}`);
  await enroll(user.id, course._id);
  redirect(`/courses/${courseId}/learn`);
}
