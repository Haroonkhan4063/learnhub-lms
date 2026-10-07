import { saveCourse } from "@/app/actions";

export default function CourseForm({ course, categories }) {
  const catId = course?.category?._id || course?.category || "";
  return (
    <form action={saveCourse} className="card grid gap-4 p-5">
      {course && <input type="hidden" name="id" defaultValue={course._id} />}
      <div>
        <label className="label">Title</label>
        <input name="title" required className="input" defaultValue={course?.title} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={4} className="input" defaultValue={course?.description} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Price in USD (0 = free)</label>
          <input name="price" type="number" min="0" step="0.01" className="input" defaultValue={course?.price ?? 0} />
        </div>
        <div>
          <label className="label">Category</label>
          <select name="category" className="input" defaultValue={catId}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Thumbnail URL (optional)</label>
          <input name="thumbnail" className="input" defaultValue={course?.thumbnail} placeholder="https://..." />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={course ? course.published : true} />
        Published (visible to students)
      </label>
      <div>
        <button className="btn btn-primary">{course ? "Save changes" : "Create course"}</button>
      </div>
    </form>
  );
}
