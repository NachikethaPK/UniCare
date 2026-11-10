import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import BloodRequest from "../models/BloodRequest.js";
import HealthRecord from "../models/HealthRecord.js";
import Pet from "../models/Pet.js";

const router = Router();

// GET /api/admin/status - System and Database Telemetry
router.get("/status", async (_, res) => {
  const startTime = Date.now();
  
  // Database status
  const readyStates = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = readyStates[dbStateCode] || "Unknown";

  let dbStats = {
    status: dbStatus,
    readyState: dbStateCode,
    name: mongoose.connection.name || "unicare",
    host: mongoose.connection.host || "localhost",
    port: mongoose.connection.port || 27017,
    collectionsCount: 0,
    collections: [],
  };

  let counts = {
    users: 0,
    appointments: 0,
    bloodRequests: 0,
    records: 0,
    pets: 0,
  };

  if (dbStateCode === 1) {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      dbStats.collectionsCount = collections.length;
      dbStats.collections = collections.map((c) => c.name);

      // Safe counts
      counts.users = await User.countDocuments().catch(() => 0);
      counts.appointments = await Appointment.countDocuments().catch(() => 0);
      counts.bloodRequests = await BloodRequest.countDocuments().catch(() => 0);
      counts.records = await HealthRecord.countDocuments().catch(() => 0);
      counts.pets = await Pet.countDocuments().catch(() => 0);
    } catch (e) {
      console.warn("Could not query collection stats:", e.message);
    }
  }

  const memoryUsage = process.memoryUsage();
  const latencyMs = Date.now() - startTime;

  res.json({
    success: true,
    server: {
      status: "online",
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
      },
      timestamp: new Date().toISOString(),
      latencyMs,
    },
    database: dbStats,
    counts,
  });
});

// GET /api/admin/users - Privacy-compliant user overview
router.get("/users", async (_, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, source: "database_offline", users: [] });
    }

    // Only select non-sensitive fields
    const users = await User.find({}, "_id name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Mask emails for privacy compliance
    const sanitizedUsers = users.map((u) => {
      const email = u.email || "";
      const atIndex = email.indexOf("@");
      let maskedEmail = email;
      if (atIndex > 2) {
        maskedEmail = email[0] + email[1] + "***" + email.substring(atIndex - 1);
      }
      return {
        id: u._id,
        name: u.name,
        email: maskedEmail,
        role: u.role || "patient",
        createdAt: u.createdAt,
      };
    });

    res.json({ success: true, users: sanitizedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
