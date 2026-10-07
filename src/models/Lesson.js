import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
