import HospitalDoctor from "../models/HospitalDoctor.js";

const defaultHospitalDoctors = [
  {
    hospitalName: "Apollo Multispeciality Hospital",
    name: "Dr. Ananya Rao",
    email: "ananya.rao@hospital.unicare",
    speciality: "Senior Cardiologist",
    department: "Cardiology Center",
    status: "Available",
    shift: "08:00 AM - 04:00 PM",
    room: "Cardiology Suite 102",
    contact: "Ext 401 / +91 98765 43210",
    experience: "12 Years",
  },
  {
    hospitalName: "Apollo Multispeciality Hospital",
    name: "Dr. Rajesh K. Nair",
    email: "rajesh.nair@apollo.unicare",
    speciality: "Trauma & Emergency Surgeon",
    department: "Emergency & Trauma Bay",
    status: "On Call",
    shift: "24h Emergency On-Call",
    room: "Trauma OT 2",
    contact: "Ext 405 / +91 98765 43299",
    experience: "14 Years",
  },
  {
    hospitalName: "Apollo Multispeciality Hospital",
    name: "Dr. Priya Swaminathan",
    email: "priya.s@apollo.unicare",
    speciality: "Critical Care & Anesthesiology",
    department: "Intensive Care Unit (ICU)",
    status: "In Surgery",
    shift: "10:00 AM - 06:00 PM",
    room: "ICU Pod A",
    contact: "Ext 412 / +91 98765 43288",
    experience: "9 Years",
  },
  {
    hospitalName: "Manipal Hospital",
    name: "Dr. Vivek Sharma",
    email: "vivek.sharma@hospital.unicare",
    speciality: "Consultant Dermatologist",
    department: "Dermatology & Skin Center",
    status: "Available",
    shift: "09:00 AM - 05:00 PM",
    room: "OPD Room 301",
    contact: "Ext 501 / +91 98765 43211",
    experience: "9 Years",
  },
  {
    hospitalName: "Manipal Hospital",
    name: "Dr. Sandeep Ghosh",
    email: "sandeep.g@manipal.unicare",
    speciality: "Senior Neurosurgeon",
    department: "Neurosurgery Wing",
    status: "In Surgery",
    shift: "08:00 AM - 04:00 PM",
    room: "Neuro OT 4",
    contact: "Ext 509 / +91 98765 43277",
    experience: "16 Years",
  },
  {
    hospitalName: "Fortis Hospital",
    name: "Dr. Sneha Kapoor",
    email: "sneha.kapoor@hospital.unicare",
    speciality: "Chief Neurologist",
    department: "Neurosciences Division",
    status: "Available",
    shift: "09:00 AM - 05:00 PM",
    room: "Neuro OPD 204",
    contact: "Ext 601 / +91 98765 43212",
    experience: "15 Years",
  },
];

export const getHospitalDoctors = async (req, res) => {
  try {
    const { hospitalId, hospitalName } = req.query;
    const query = {};

    if (hospitalId) {
      query.$or = [
        { hospitalId },
        { hospitalName: new RegExp(hospitalName || "", "i") },
      ];
    } else if (hospitalName) {
      query.hospitalName = new RegExp(hospitalName, "i");
    }

    let doctors = await HospitalDoctor.find(query).sort({ status: 1, name: 1 });

    // Seed defaults if empty
    if (doctors.length === 0) {
      const targetName = hospitalName || req.user?.name || "";
      const matches = defaultHospitalDoctors.filter((d) =>
        targetName ? d.hospitalName.toLowerCase().includes(targetName.toLowerCase()) : true
      );
      if (matches.length > 0) {
        const seeded = await HospitalDoctor.insertMany(
          matches.map((m) => ({
            ...m,
            hospitalId: hospitalId || req.user?.id || "hosp-default",
            hospitalName: req.user?.name || m.hospitalName,
          }))
        );
        doctors = seeded;
      }
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHospitalDoctor = async (req, res) => {
  try {
    const doctorData = {
      ...req.body,
      hospitalId: req.body.hospitalId || req.user?.id || "hosp-default",
      hospitalName: req.body.hospitalName || req.user?.name || "Hospital",
      status: req.body.status || "Available",
    };

    const doc = await HospitalDoctor.create(doctorData);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateHospitalDoctor = async (req, res) => {
  try {
    const doc = await HospitalDoctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Doctor not found" });
    res.json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteHospitalDoctor = async (req, res) => {
  try {
    const doc = await HospitalDoctor.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
