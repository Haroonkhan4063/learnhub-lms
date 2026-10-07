import connectDB from "@/lib/db";
import { Category } from "@/models";
import { plain } from "@/lib/utils";
import CourseForm from "@/components/CourseForm";

export default async function NewCourse() {
  await connectDB();
  const categories = plain(await Category.find().sort("name").lean());
  return (
    <div>
      <h1 className="mb-5 text-3xl font-extrabold">New course</h1>
      <CourseForm categories={categories} />
      <p className="mt-3 text-sm text-mute">After you create the course you can add lessons and videos.</p>
    </div>
  );
}
