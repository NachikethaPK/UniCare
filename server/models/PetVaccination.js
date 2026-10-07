import mongoose from "mongoose";

const petVaccinationSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    nextDue: { type: String, required: true },
    reminder: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("PetVaccination", petVaccinationSchema);
