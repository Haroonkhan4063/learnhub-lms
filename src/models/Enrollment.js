import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);
