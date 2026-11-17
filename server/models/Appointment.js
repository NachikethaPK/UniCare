import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: String, required: true },
    doctorEmail: { type: String },
    patientName: { type: String },
    patientEmail: { type: String },
    speciality: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    symptoms: { type: String },
    status: { type: String, enum: ["Upcoming", "In Consultation", "Completed", "Cancelled"], default: "Upcoming" },
    reminderEnabled: { type: Boolean, default: false },
    reminderTime: { type: String, default: "1 hour before" },
    clinicalNotes: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    prescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
