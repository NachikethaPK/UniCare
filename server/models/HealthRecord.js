import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String },
    fileName: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("HealthRecord", healthRecordSchema);
