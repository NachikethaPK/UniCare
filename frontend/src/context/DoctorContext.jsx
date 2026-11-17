import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const DoctorContext = createContext();

const initialDemoHistories = [
  {
    id: "hist-1",
    patientName: "Chandrika Sharma",
    patientEmail: "chandrika@example.com",
    patientPhone: "+91 98765 12345",
    doctor: "Dr. Ananya Rao",
    doctorEmail: "ananya.rao@hospital.unicare",
    date: "2026-11-10",
    time: "10:30 AM",
    speciality: "Cardiologist",
    diagnosis: "Stage 1 Essential Hypertension",
    symptoms: "Mild exertion fatigue, morning headaches, BP 142/92 mmHg",
    clinicalNotes: "Patient instructed on low-sodium dietary protocol (DASH diet) and 30-minute daily cardio walk. Echocardiogram normal. Recheck in 3 weeks.",
    prescription: "Amlodipine 5mg OD (morning) x 30 days\nTelmisartan 20mg OD (night) x 30 days",
    vitals: {
      bp: "142/92 mmHg",
      heartRate: "78 bpm",
      temperature: "98.4 °F",
      spo2: "99%",
      weight: "64 kg",
    },
    followUpDate: "2026-12-01",
  },
  {
    id: "hist-2",
    patientName: "Arjun Verma",
    patientEmail: "arjun.verma@example.com",
    patientPhone: "+91 98450 98765",
    doctor: "Dr. Ananya Rao",
    doctorEmail: "ananya.rao@hospital.unicare",
    date: "2026-11-05",
    time: "02:15 PM",
    speciality: "Cardiologist",
    diagnosis: "Sinus Tachycardia secondary to acute work stress",
    symptoms: "Occasional heart palpitations while sitting at desk, resting HR 105 bpm",
    clinicalNotes: "Resting ECG showed sinus tachycardia with normal QT interval. Thyroid function tests (T3, T4, TSH) returned euthyroid. Advised caffeine reduction and sleep hygiene.",
    prescription: "Propranolol 10mg PRN (as needed for acute palpitations)\nMagnesium Glycinate 200mg OD at bedtime",
    vitals: {
      bp: "128/84 mmHg",
      heartRate: "102 bpm",
      temperature: "98.6 °F",
      spo2: "98%",
      weight: "72 kg",
    },
    followUpDate: "2026-11-26",
  },
  {
    id: "hist-3",
    patientName: "Pooja Hegde",
    patientEmail: "pooja.h@example.com",
    patientPhone: "+91 97400 44321",
    doctor: "Dr. Vivek Sharma",
    doctorEmail: "vivek.sharma@hospital.unicare",
    date: "2026-11-12",
    time: "11:45 AM",
    speciality: "Dermatologist",
    diagnosis: "Acute Contact Dermatitis & Xerosis",
    symptoms: "Erythematous pruritic macules on bilateral forearms after using chemical detergent",
    clinicalNotes: "Skin patch testing recommended if flares recur. Advised hypoallergenic ceramide moisturizer application within 3 minutes post-shower.",
    prescription: "Mometasone Furoate 0.1% topical cream BD x 7 days\nLevocetirizine 5mg OD at night x 10 days\nCeramide barrier repair lotion daily",
    vitals: {
      bp: "118/76 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6 °F",
      spo2: "100%",
      weight: "58 kg",
    },
    followUpDate: "2026-11-25",
  },
];

export const DoctorProvider = ({ children }) => {
  const { user } = useAuth();
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const doctorEmail = (user?.email || "").toLowerCase().trim();
  const doctorName = (user?.name || "").trim();
  const doctorId = user?.id || "guest-doctor";

  const scheduleKey = `unicare_doctor_schedule_${doctorId}`;
  const historiesKey = `unicare_doctor_histories_${doctorId}`;

  // Initial schedule loading
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem(scheduleKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    // Default initial schedule for demo doctor with today's appointments
    return [
      {
        id: "sch-today-1",
        doctor: doctorName || "Dr. Ananya Rao",
        doctorEmail: doctorEmail || "ananya.rao@hospital.unicare",
        patientName: "Chandrika Sharma",
        patientEmail: "chandrika@example.com",
        speciality: user?.doctorDetails?.speciality || "Cardiologist",
        date: todayStr,
        time: "10:30 AM",
        symptoms: "Routine blood pressure review & cardiovascular stress monitoring",
        status: "Upcoming",
        clinicalNotes: "",
      },
      {
        id: "sch-today-2",
        doctor: doctorName || "Dr. Ananya Rao",
        doctorEmail: doctorEmail || "ananya.rao@hospital.unicare",
        patientName: "Rahul Desai",
        patientEmail: "rahul.desai@example.com",
        speciality: user?.doctorDetails?.speciality || "Cardiologist",
        date: todayStr,
        time: "11:45 AM",
        symptoms: "Post-workout shortness of breath and mild chest tightness",
        status: "Upcoming",
        clinicalNotes: "",
      },
      {
        id: "sch-today-3",
        doctor: doctorName || "Dr. Ananya Rao",
        doctorEmail: doctorEmail || "ananya.rao@hospital.unicare",
        patientName: "Meera Krishnan",
        patientEmail: "meera.k@example.com",
        speciality: user?.doctorDetails?.speciality || "Cardiologist",
        date: todayStr,
        time: "02:30 PM",
        symptoms: "Lipid panel consultation & lifestyle management",
        status: "Completed",
        clinicalNotes: "Lipid panel reviewed. LDL 112 mg/dL. Continue Mediterranean diet.",
      },
    ];
  });

  // Initial patient histories loading
  const [patientHistories, setPatientHistories] = useState(() => {
    const saved = localStorage.getItem(historiesKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialDemoHistories;
  });

  // Persist local storage
  useEffect(() => {
    if (user?.role === "doctor" || user) {
      localStorage.setItem(scheduleKey, JSON.stringify(schedule));
    }
  }, [schedule, scheduleKey, user]);

  useEffect(() => {
    if (user?.role === "doctor" || user) {
      localStorage.setItem(historiesKey, JSON.stringify(patientHistories));
    }
  }, [patientHistories, historiesKey, user]);

  // Sync with API backend
  const refreshSchedule = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get(`/appointments/doctor/schedule`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setSchedule(res.data.map((item) => ({ ...item, id: item._id || item.id })));
      }
    } catch {
      // Local fallback in effect
    }
  }, [user]);

  const refreshHistories = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get(`/patient-history`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPatientHistories(res.data.map((item) => ({ ...item, id: item._id || item.id })));
      }
    } catch {
      // Local fallback in effect
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "doctor") {
      refreshSchedule();
      refreshHistories();
    }
  }, [user, refreshSchedule, refreshHistories]);

  // Cross-pollinate with patient bookings from localStorage
  useEffect(() => {
    if (user?.role === "doctor" && doctorEmail) {
      // Scan registered accounts' appointments in localStorage
      try {
        const rawAccounts = localStorage.getItem("unicare_registered_accounts");
        if (rawAccounts) {
          const accounts = JSON.parse(rawAccounts);
          let allMatched = [];
          for (const acc of accounts) {
            const accApps = localStorage.getItem(`unicare_appointments_${acc.id}`);
            if (accApps) {
              const parsedApps = JSON.parse(accApps);
              const matching = parsedApps.filter(
                (app) =>
                  (app.doctorEmail && app.doctorEmail.toLowerCase() === doctorEmail) ||
                  (app.doctor && app.doctor.toLowerCase() === doctorName.toLowerCase())
              );
              allMatched.push(...matching);
            }
          }
          if (allMatched.length > 0) {
            setSchedule((prev) => {
              const prevIds = new Set(prev.map((p) => p.id));
              const newItems = allMatched.filter((m) => !prevIds.has(m.id));
              return newItems.length > 0 ? [...newItems, ...prev] : prev;
            });
          }
        }
      } catch (err) {
        console.error("Local schedule sync notice:", err);
      }
    }
  }, [user, doctorEmail, doctorName]);

  // Actions
  const updateAppointmentStatus = async (id, status, notes = "") => {
    try {
      await api.put(`/appointments/${id}`, { status, clinicalNotes: notes });
    } catch (err) {
      console.warn("Updated appointment status locally:", err.message);
    }
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, ...(notes ? { clinicalNotes: notes } : {}) } : item
      )
    );
  };

  const addWalkInAppointment = async (appointmentData) => {
    const newEntry = {
      id: "walkin-" + Date.now(),
      doctor: doctorName || "Doctor",
      doctorEmail,
      speciality: user?.doctorDetails?.speciality || "General Medicine",
      status: "Upcoming",
      date: todayStr,
      time: "Now",
      ...appointmentData,
    };
    try {
      const res = await api.post("/appointments", newEntry);
      if (res.data?._id) {
        newEntry.id = res.data._id;
      }
    } catch (err) {
      console.warn("Created walk-in appointment locally:", err.message);
    }
    setSchedule((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const addPatientHistory = async (recordData) => {
    const newRecord = {
      id: "hist-" + Date.now(),
      doctor: doctorName || "Doctor",
      doctorEmail,
      speciality: user?.doctorDetails?.speciality || "General Medicine",
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      vitals: {
        bp: "",
        heartRate: "",
        temperature: "",
        spo2: "",
        weight: "",
        ...(recordData.vitals || {}),
      },
      ...recordData,
    };

    try {
      const res = await api.post("/patient-history", newRecord);
      if (res.data?._id) {
        newRecord.id = res.data._id;
      }
    } catch (err) {
      console.warn("Created patient history locally:", err.message);
    }

    setPatientHistories((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updatePatientHistory = async (id, updatedFields) => {
    try {
      await api.put(`/patient-history/${id}`, updatedFields);
    } catch (err) {
      console.warn("Updated patient history locally:", err.message);
    }
    setPatientHistories((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updatedFields } : rec))
    );
  };

  const deletePatientHistory = async (id) => {
    try {
      await api.delete(`/patient-history/${id}`);
    } catch (err) {
      console.warn("Deleted patient history locally:", err.message);
    }
    setPatientHistories((prev) => prev.filter((rec) => rec.id !== id));
  };

  const getPatientHistoryByEmail = useCallback(
    (email) => {
      if (!email) return [];
      const clean = email.toLowerCase().trim();
      return patientHistories.filter(
        (rec) => rec.patientEmail && rec.patientEmail.toLowerCase().trim() === clean
      );
    },
    [patientHistories]
  );

  return (
    <DoctorContext.Provider
      value={{
        schedule,
        todayStr,
        patientHistories,
        updateAppointmentStatus,
        addWalkInAppointment,
        addPatientHistory,
        updatePatientHistory,
        deletePatientHistory,
        getPatientHistoryByEmail,
        refreshSchedule,
        refreshHistories,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);
