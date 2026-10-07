import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: String },
    owner: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
