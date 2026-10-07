import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bloodDonationRoutes from "./routes/bloodDonationRoutes.js";
import healthRecordRoutes from "./routes/healthRecordRoutes.js";
import petRoutes from "./routes/petRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);

app.use("/api/appointments", appointmentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blood", bloodDonationRoutes);
app.use("/api/records", healthRecordRoutes);
app.use("/api/pets", petRoutes);

app.use((err, _, res, __) => res.status(500).json({ message: err.message || "Server error" }));

connectDB().then(() => 
  app.listen(process.env.PORT || 5000, () => console.log("API running"))
).catch((error) => { 
  console.error(error.message); 
  process.exit(1); 
});
