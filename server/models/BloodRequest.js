import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    hospitalId: { type: String, default: "" },
    hospitalName: { type: String, required: true },
    hospitalAddress: { type: String, default: "" },
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 },
    patient: { type: String, default: "Hospital Emergency Patient" },
    bloodGroup: { type: String, required: true },
    unitsNeeded: { type: Number, default: 1 },
    urgency: { type: String, enum: ["Critical", "Urgent", "Normal"], default: "Urgent" },
    department: { type: String, default: "Emergency Care / ICU" },
    contact: { type: String, required: true },
    location: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Accepted", "Completed", "Cancelled"], default: "Pending" },
    postedByRole: { type: String, default: "hospital" },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", bloodRequestSchema);
