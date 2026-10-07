import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const HealthRecordContext = createContext();

const demoRecords = [
  { id: "rec-1", title: "Complete Blood Count (CBC)", category: "Lab Reports", date: "2026-07-10", doctor: "Dr. Ananya Rao", tags: ["Lab Reports", "Pathology", "Blood Panel"], fileName: "CBC_Report_July2026.pdf", fileUrl: "#" },
  { id: "rec-2", title: "Amoxicillin 500mg Prescription", category: "Prescriptions", date: "2026-06-15", doctor: "Dr. Vivek Sharma", tags: ["Prescriptions", "Medication", "Antibiotics"], fileName: "Prescription_Amoxicillin.pdf", fileUrl: "#" },
  { id: "rec-3", title: "Chest X-Ray Scan", category: "Scan Reports", date: "2026-05-02", doctor: "Dr. Rajesh Kumar", tags: ["Scan Reports", "Imaging", "Radiology", "X-Ray"], fileName: "Chest_XRay.pdf", fileUrl: "#" },
  { id: "rec-4", title: "Covid-19 Vaccination Certificate", category: "Vaccination History", date: "2025-11-20", doctor: "Universal Immunization", tags: ["Vaccination", "Immunization", "COVID-19"], fileName: "Vaccine_Cert.pdf", fileUrl: "#" },
];

export function HealthRecordProvider({ children }) {
  const { user } = useAuth();
  const userId = user ? (user.id || user.email) : "guest";
  const storageKey = `unicare_records_${userId}`;
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest clinical date first, "asc" = oldest first

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return userId === "demo-user-123" ? demoRecords : [];
  });

  // Re-sync when logged in user changes
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`unicare_records_${userId}`);
      if (saved) {
        try {
          setRecords(JSON.parse(saved));
        } catch {
          setRecords([]);
        }
      } else {
        setRecords(userId === "demo-user-123" ? demoRecords : []);
      }

      const fetchRecords = async () => {
        try {
          const res = await api.get(`/records?sort_order=${sortOrder}`);
          if (res.data) {
            setRecords(res.data.map(r => ({ ...r, id: r._id || r.id })));
          }
        } catch (error) {
          console.warn("Using user-isolated local health record state:", error.message);
        }
      };
      fetchRecords();
    } else {
      setRecords([]);
    }
  }, [user, userId, sortOrder]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, storageKey, user]);

  // Extract internal clinical date from file or text using Hybrid Engine
  const extractDateFromDocument = async (file, text) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (text) {
        formData.append("text", text);
      }

      const res = await api.post("/records/extract-date", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.warn("Could not extract date via backend, falling back to local date:", err.message);
      return {
        date: new Date().toISOString().slice(0, 10),
        method: "fallback_today",
        confidence: "low",
      };
    }
  };

  const addRecord = async (record) => {
    const newRec = { ...record, id: "rec-" + Date.now(), userId };
    try {
      const res = await api.post("/records", record);
      if (res.data?._id) newRec.id = res.data._id;
    } catch (error) {
      console.warn("Added health record locally for user:", error.message);
    }
    setRecords((current) => [newRec, ...current]);
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/records/${id}`);
    } catch (error) {
      console.warn("Deleted health record locally:", error.message);
    }
    setRecords((current) => current.filter((record) => record.id !== id));
  };

  // Strictly sort records chronologically by the internal medical report date
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = new Date(a.date || "1970-01-01").getTime();
      const dateB = new Date(b.date || "1970-01-01").getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [records, sortOrder]);

  const searchRecords = (query, category) => sortedRecords.filter((record) => 
    record.title.toLowerCase().includes(query.toLowerCase()) && 
    (!category || record.category === category)
  );

  return (
    <HealthRecordContext.Provider
      value={{
        records: sortedRecords,
        rawRecords: records,
        addRecord,
        deleteRecord,
        searchRecords,
        extractDateFromDocument,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </HealthRecordContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useHealthRecords = () => useContext(HealthRecordContext);
