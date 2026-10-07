import mongoose from "mongoose";

const bloodDonorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    availability: { type: String, enum: ["Available", "Unavailable"], default: "Available" },
  },
  { timestamps: true }
);

export default mongoose.model("BloodDonor", bloodDonorSchema);
