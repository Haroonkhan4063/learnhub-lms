import connectDB from "@/lib/db";
import { Category, Course } from "@/models";
import { plain } from "@/lib/utils";
import { saveCategory, deleteCategory } from "@/app/actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function AdminCategories() {
  await connectDB();
  const cats = plain(await Category.find().sort("name").lean());
  const counts = await Course.aggregate([{ $group: { _id: "$category", n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Categories</h1>
      <form action={saveCategory} className="card flex gap-2 p-4">
        <input name="name" required placeholder="New category name" className="input" />
        <button className="btn btn-primary shrink-0">Add category</button>
      </form>
      <div className="card divide-y divide-line">
        {cats.map((c) => (
          <div key={c._id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-mute">{map[c._id] || 0} courses</p>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c._id} />
              <ConfirmButton message="Delete this category? Its courses will become uncategorised.">Delete</ConfirmButton>
            </form>
          </div>
        ))}
        {!cats.length && <p className="p-4 text-mute">No categories yet.</p>}
      </div>
    </div>
  );
}
