import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { useBloodDonation } from "./BloodDonationContext";

const HospitalContext = createContext();

const initialRosters = {
  default: [
    {
      id: "doc-hosp-1",
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
      id: "doc-hosp-2",
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
      id: "doc-hosp-3",
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
      id: "doc-hosp-4",
      name: "Dr. Karthik Reddy",
      email: "karthik.r@apollo.unicare",
      speciality: "General Physician & Triage",
      department: "Emergency Triage",
      status: "Available",
      shift: "09:00 AM - 05:00 PM",
      room: "Triage Station 1",
      contact: "Ext 403 / +91 98765 43222",
      experience: "7 Years",
    },
    {
      id: "doc-hosp-5",
      name: "Dr. Meenakshi Sundaram",
      email: "meenakshi.s@apollo.unicare",
      speciality: "Pediatric Critical Care",
      department: "Pediatric ICU",
      status: "Available",
      shift: "08:00 AM - 04:00 PM",
      room: "PICU Wing B",
      contact: "Ext 418 / +91 98765 43233",
      experience: "11 Years",
    },
  ],
};

export const HospitalProvider = ({ children }) => {
  const { user } = useAuth();
  const { requests, addHospitalRequest, updateRequestStatus, deleteRequest } = useBloodDonation();

  const hospitalId = user?.id || "hosp-apollo";
  const hospitalName = user?.name || "Apollo Multispeciality Hospital";
  const storageKey = `unicare_hospital_roster_${hospitalId}`;

  // Hospital Doctors Roster
  const [hospitalDoctors, setHospitalDoctors] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialRosters.default;
  });

  // Sync with API
  const refreshDoctors = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get(`/hospital-doctors?hospitalId=${hospitalId}&hospitalName=${encodeURIComponent(hospitalName)}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setHospitalDoctors(res.data.map((d) => ({ ...d, id: d._id || d.id })));
      }
    } catch {
      // Local fallback in effect
    }
  }, [user, hospitalId, hospitalName]);

  useEffect(() => {
    if (user?.role === "hospital") {
      refreshDoctors();
    }
  }, [user, refreshDoctors]);

  useEffect(() => {
    if (user?.role === "hospital" || user) {
      localStorage.setItem(storageKey, JSON.stringify(hospitalDoctors));
    }
  }, [hospitalDoctors, storageKey, user]);

  // Emergency Requests posted by this hospital
  const hospitalRequests = useMemo(() => {
    const cleanName = hospitalName.toLowerCase().trim();
    return requests.filter((r) => {
      const matchId = r.hospitalId === hospitalId;
      const matchName = r.hospitalName && r.hospitalName.toLowerCase().trim().includes(cleanName);
      return matchId || matchName;
    });
  }, [requests, hospitalId, hospitalName]);

  // Post blood emergency
  const postBloodEmergency = async (form) => {
    const newAlert = {
      hospitalId,
      hospitalName,
      hospitalAddress: user?.hospitalDetails?.address || "Medical Complex, Bengaluru",
      lat: Number(user?.hospitalDetails?.lat) || 12.8932,
      lng: Number(user?.hospitalDetails?.lng) || 77.5975,
      contact: form.contact || user?.hospitalDetails?.emergencyContact || "+91 80 2630 4055",
      bloodGroup: form.bloodGroup,
      unitsNeeded: Number(form.unitsNeeded) || 1,
      urgency: form.urgency || "Critical",
      department: form.department || "Emergency ICU Ward",
      patient: form.patient || `Trauma Emergency #${Math.floor(100 + Math.random() * 900)}`,
      clinicalNotes: form.clinicalNotes || "",
      status: "Pending",
    };

    return await addHospitalRequest(newAlert);
  };

  // Update Doctor on-duty status
  const updateDoctorStatus = async (id, status) => {
    try {
      await api.put(`/hospital-doctors/${id}`, { status });
    } catch (err) {
      console.warn("Updated doctor status locally:", err.message);
    }

    setHospitalDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  // Add doctor to roster
  const addDoctorToRoster = async (docData) => {
    const newDoc = {
      id: "doc-hosp-" + Date.now(),
      hospitalId,
      hospitalName,
      name: docData.name.startsWith("Dr.") ? docData.name : `Dr. ${docData.name}`,
      email: docData.email || "",
      speciality: docData.speciality || "General Physician",
      department: docData.department || "OPD Ward",
      status: docData.status || "Available",
      shift: docData.shift || "09:00 AM - 05:00 PM",
      room: docData.room || "Room 101",
      contact: docData.contact || "",
      experience: docData.experience || "5 Years",
    };

    try {
      const res = await api.post("/hospital-doctors", newDoc);
      if (res.data?._id) {
        newDoc.id = res.data._id;
      }
    } catch (err) {
      console.warn("Created doctor locally:", err.message);
    }

    setHospitalDoctors((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  // Delete doctor from roster
  const removeDoctorFromRoster = async (id) => {
    try {
      await api.delete(`/hospital-doctors/${id}`);
    } catch (err) {
      console.warn("Deleted doctor locally:", err.message);
    }
    setHospitalDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitalName,
        hospitalId,
        hospitalRequests,
        postBloodEmergency,
        updateRequestStatus,
        deleteRequest,
        hospitalDoctors,
        updateDoctorStatus,
        addDoctorToRoster,
        removeDoctorFromRoster,
        refreshDoctors,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => useContext(HospitalContext);
