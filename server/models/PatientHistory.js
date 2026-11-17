import mongoose from "mongoose";

const patientHistorySchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    patientEmail: { type: String, default: "" },
    patientPhone: { type: String, default: "" },
    doctor: { type: String, required: true },
    doctorEmail: { type: String, default: "" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    speciality: { type: String, default: "" },
    diagnosis: { type: String, required: true },
    symptoms: { type: String, default: "" },
    clinicalNotes: { type: String, default: "" },
    prescription: { type: String, default: "" },
    vitals: {
      bp: { type: String, default: "" },
      heartRate: { type: String, default: "" },
      temperature: { type: String, default: "" },
      spo2: { type: String, default: "" },
      weight: { type: String, default: "" },
    },
    followUpDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("PatientHistory", patientHistorySchema);
