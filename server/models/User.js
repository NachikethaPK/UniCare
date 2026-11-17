import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "hospital", "doctor", "admin"], default: "patient" },
    hospitalDetails: {
      licenseNo: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
      phone: { type: String, default: "" },
      emergencyContact: { type: String, default: "" },
    },
    doctorDetails: {
      speciality: { type: String, default: "" },
      qualification: { type: String, default: "" },
      experience: { type: String, default: "" },
      hospital: { type: String, default: "" },
      phone: { type: String, default: "" },
      registrationNumber: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
