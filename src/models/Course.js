import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0, min: 0 },
    thumbnail: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
