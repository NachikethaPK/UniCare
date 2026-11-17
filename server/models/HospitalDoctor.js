import mongoose from "mongoose";

const hospitalDoctorSchema = new mongoose.Schema(
  {
    hospitalId: { type: String, required: true },
    hospitalName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    speciality: { type: String, required: true },
    department: { type: String, default: "General Medicine" },
    status: {
      type: String,
      enum: ["Available", "In Consultation", "In Surgery", "On Call", "Off Duty"],
      default: "Available",
    },
    shift: { type: String, default: "09:00 AM - 05:00 PM" },
    room: { type: String, default: "OPD 101" },
    contact: { type: String, default: "" },
    experience: { type: String, default: "5 Years" },
  },
  { timestamps: true }
);

export default mongoose.model("HospitalDoctor", hospitalDoctorSchema);
