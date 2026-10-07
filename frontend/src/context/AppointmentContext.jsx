import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const AppointmentContext = createContext();

const demoAppointments = [
  {
    id: "app-1",
    doctor: "Dr. Ananya Rao",
    speciality: "Cardiologist",
    date: "2026-08-15",
    time: "10:30 AM",
    status: "Upcoming",
    symptoms: "Routine heart checkup and blood pressure monitoring",
  },
  {
    id: "app-2",
    doctor: "Dr. Vivek Sharma",
    speciality: "Dermatologist",
    date: "2026-08-18",
    time: "03:00 PM",
    status: "Upcoming",
    symptoms: "Skin allergy assessment",
  },
  {
    id: "app-3",
    doctor: "Dr. Sneha Kapoor",
    speciality: "Neurologist",
    date: "2026-07-20",
    time: "11:00 AM",
    status: "Completed",
    symptoms: "Migraine follow-up",
  },
];

export const AppointmentProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? (user.id || user.email) : "guest";
  const storageKey = `unicare_appointments_${userId}`;

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return userId === "demo-user-123" ? demoAppointments : [];
  });

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`unicare_appointments_${userId}`);
      if (saved) {
        try { setAppointments(JSON.parse(saved)); } catch (e) { setAppointments([]); }
      } else {
        setAppointments(userId === "demo-user-123" ? demoAppointments : []);
      }

      const fetchAppointments = async () => {
        try {
          const res = await api.get("/appointments");
          if (res.data) {
            setAppointments(res.data.map(app => ({...app, id: app._id})));
          }
        } catch (error) {
          console.warn("Using user-isolated local appointment state:", error.message);
        }
      };
      fetchAppointments();
    } else {
      setAppointments([]);
    }
  }, [user, userId]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(appointments));
    }
  }, [appointments, storageKey, user]);

  const addAppointment = async (appointment) => {
    const newApp = {
      id: "app-" + Date.now(),
      status: "Upcoming",
      userId,
      ...appointment,
    };
    try {
      const res = await api.post("/appointments", appointment);
      if (res.data && res.data._id) {
        newApp.id = res.data._id;
      }
    } catch (error) {
      console.warn("Saved appointment locally:", error.message);
    }
    setAppointments((current) => [newApp, ...current]);
  };


  const cancelAppointment = async (id) => {
    try {
      await api.put(`/appointments/${id}`, { status: "Cancelled" });
    } catch (error) {
      console.warn("Cancelled appointment locally:", error.message);
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item,
      ),
    );
  };

  const updateAppointment = async (id, data) => {
    try {
      await api.put(`/appointments/${id}`, data);
    } catch (error) {
      console.warn("Updated appointment locally:", error.message);
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    );
  };

  const doctorsStorageKey = `unicare_custom_doctors_${userId}`;

  const [customDoctors, setCustomDoctors] = useState(() => {
    const saved = localStorage.getItem(doctorsStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`unicare_custom_doctors_${userId}`);
      if (saved) {
        try { setCustomDoctors(JSON.parse(saved)); } catch (e) { setCustomDoctors([]); }
      }
    } else {
      setCustomDoctors([]);
    }
  }, [user, userId]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(doctorsStorageKey, JSON.stringify(customDoctors));
    }
  }, [customDoctors, doctorsStorageKey, user]);

  const addCustomDoctor = (doctorData) => {
    const newDoc = {
      id: "custom-doc-" + Date.now(),
      name: doctorData.name.startsWith("Dr.") ? doctorData.name : `Dr. ${doctorData.name}`,
      speciality: doctorData.speciality || "General Practitioner",
      experience: doctorData.experience || "5 Years",
      rating: doctorData.rating || 5.0,
      contact: doctorData.contact || "",
      isCustom: true,
    };
    setCustomDoctors((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const deleteCustomDoctor = (id) => {
    setCustomDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        customDoctors,
        addCustomDoctor,
        deleteCustomDoctor,
        addAppointment,
        cancelAppointment,
        updateAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppointments = () => useContext(AppointmentContext);

