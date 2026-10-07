import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodGroup: { type: String, required: true },
    urgency: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Fulfilled", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", bloodRequestSchema);
