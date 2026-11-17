import PatientHistory from "../models/PatientHistory.js";
import User from "../models/User.js";

export const getPatientHistories = async (req, res) => {
  try {
    const { patientEmail, search, date } = req.query;
    const user = await User.findById(req.user.id);
    const query = {};

    // If logged in as doctor, prioritize records created by or matching this doctor
    if (user && user.role === "doctor") {
      const docEmail = user.email.toLowerCase();
      query.$or = [
        { doctorId: req.user.id },
        { doctorEmail: new RegExp(`^${docEmail}$`, "i") },
        { doctor: new RegExp(user.name, "i") },
      ];
    }

    if (patientEmail) {
      query.patientEmail = new RegExp(`^${patientEmail.trim()}$`, "i");
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      const s = search.trim();
      const searchRegex = new RegExp(s, "i");
      query.$or = [
        { patientName: searchRegex },
        { patientEmail: searchRegex },
        { diagnosis: searchRegex },
        { symptoms: searchRegex },
      ];
    }

    const histories = await PatientHistory.find(query).sort({ date: -1, createdAt: -1 });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPatientHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const historyData = {
      ...req.body,
      doctorId: req.user.id,
      doctor: req.body.doctor || user?.name || "Doctor",
      doctorEmail: req.body.doctorEmail || user?.email || "",
      speciality: req.body.speciality || user?.doctorDetails?.speciality || req.body.speciality || "General Medicine",
      date: req.body.date || new Date().toISOString().split("T")[0],
    };

    const record = await PatientHistory.create(historyData);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePatientHistory = async (req, res) => {
  try {
    const record = await PatientHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Patient history record not found" });
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePatientHistory = async (req, res) => {
  try {
    const record = await PatientHistory.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Patient history record not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
