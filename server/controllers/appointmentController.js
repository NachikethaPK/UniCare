import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendAppointmentEmail } from "../services/emailService.js";

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user: req.user.id });

    // Fetch user details to ensure patient name and email are included
    const user = await User.findById(req.user.id);
    const patientName = req.body.patientName || user?.name || "Patient";
    const patientEmail = req.body.patientEmail || user?.email || "";

    // Asynchronously dispatch Gmail notification to doctor without blocking response
    sendAppointmentEmail({
      doctorEmail: req.body.doctorEmail,
      doctorName: req.body.doctor,
      patientName,
      patientEmail,
      date: req.body.date,
      time: req.body.time,
      speciality: req.body.speciality,
      symptoms: req.body.symptoms,
    }).catch((err) => {
      console.error("[Email Notification Error]:", err.message);
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDoctorSchedule = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const doctorEmail = (req.query.doctorEmail || user?.email || "").toLowerCase().trim();
    const doctorName = (req.query.doctor || user?.name || "").trim();
    const { date } = req.query;

    const conditions = [];
    if (doctorEmail) {
      conditions.push({ doctorEmail: new RegExp(`^${doctorEmail}$`, "i") });
    }
    if (doctorName) {
      conditions.push({ doctor: new RegExp(doctorName, "i") });
    }

    const query = conditions.length > 0 ? { $or: conditions } : {};

    if (date) {
      query.date = date;
    }

    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const filter = { _id: req.params.id };

    if (user?.role !== "doctor" && user?.role !== "admin") {
      filter.user = req.user.id;
    }

    const appointment = await Appointment.findOneAndUpdate(
      filter,
      req.body,
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const result = await Appointment.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Appointment not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
