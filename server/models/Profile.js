import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String },
    dob: { type: String },
    gender: { type: String },
    family: [
      {
        id: { type: String },
        name: { type: String },
        relation: { type: String },
        age: { type: String },
        bloodGroup: { type: String },
      }
    ],
    contacts: [
      {
        id: { type: String },
        name: { type: String },
        relation: { type: String },
        phone: { type: String },
      }
    ],
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    }
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
