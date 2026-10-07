import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    provider: { type: String, enum: ["stripe", "demo"], default: "demo" },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    sessionId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
