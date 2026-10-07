import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const PetContext = createContext();

const defaultPets = [
  { id: "pet-1", name: "Bruno", species: "Dog", breed: "Labrador Retriever", age: "3 Years", owner: "Chandrika Sharma" },
  { id: "pet-2", name: "Coco", species: "Cat", breed: "Persian Cat", age: "2 Years", owner: "Chandrika Sharma" }
];

const defaultVaccinations = [
  { id: "v-1", petId: "pet-1", name: "Rabies Vaccine", date: "2026-01-15", nextDue: "2027-01-15", reminder: "Active" },
  { id: "v-2", petId: "pet-1", name: "DHPP Booster", date: "2025-08-10", nextDue: "2026-08-10", reminder: "Due Soon" },
  { id: "v-3", petId: "pet-2", name: "FVRCP Vaccine", date: "2026-03-20", nextDue: "2027-03-20", reminder: "Active" },
];

const defaultPetRecords = [
  {
    id: "pet-rec-1",
    petId: "pet-1",
    title: "Annual Rabies Immunization Certificate",
    category: "Vaccination History",
    date: "2026-06-18",
    veterinarian: "Dr. Rajesh Vet Clinic",
    tags: ["Vaccination", "Rabies", "Booster"],
    fileName: "Bruno_Rabies_Cert_2026.pdf",
    fileUrl: "#",
    fileType: "application/pdf"
  },
  {
    id: "pet-rec-2",
    petId: "pet-1",
    title: "Bravecto Chewable Antiparasitic Rx",
    category: "Prescriptions",
    date: "2026-04-10",
    veterinarian: "Dr. Rajesh Vet Clinic",
    tags: ["Prescriptions", "Antiparasitic", "Medication"],
    fileName: "Bravecto_Prescription.pdf",
    fileUrl: "#",
    fileType: "application/pdf"
  },
  {
    id: "pet-rec-3",
    petId: "pet-1",
    title: "Canine Hip & Pelvis X-Ray Screening",
    category: "Scan Reports",
    date: "2026-02-14",
    veterinarian: "Apex Diagnostic Pet Radiology",
    tags: ["Imaging", "Radiology", "X-Ray"],
    fileName: "Bruno_Hip_XRay.pdf",
    fileUrl: "#",
    fileType: "application/pdf"
  },
  {
    id: "pet-rec-4",
    petId: "pet-2",
    title: "FVRCP 3-in-1 Feline Vaccine",
    category: "Vaccination History",
    date: "2026-05-22",
    veterinarian: "Feline Health Specialist Hospital",
    tags: ["Vaccination", "FVRCP", "Immunization"],
    fileName: "Coco_FVRCP_Vaccine.pdf",
    fileUrl: "#",
    fileType: "application/pdf"
  },
  {
    id: "pet-rec-5",
    petId: "pet-2",
    title: "Comprehensive Feline Blood Chemistry & Renal Panel",
    category: "Lab Reports",
    date: "2026-01-30",
    veterinarian: "Idexx Bio-Diagnostic Vet Lab",
    tags: ["Lab Reports", "Blood Panel", "Pathology"],
    fileName: "Coco_Renal_Panel_Jan2026.pdf",
    fileUrl: "#",
    fileType: "application/pdf"
  }
];

export function PetProvider({ children }) {
  const { user } = useAuth();
  const userId = user ? (user.id || user.email) : "guest";
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest internal clinical date first, "asc" = oldest first

  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem(`unicare_pets_${userId}`);
    return saved ? JSON.parse(saved) : defaultPets;
  });

  const [activePetId, setActivePetId] = useState(() => pets[0]?.id || "pet-1");

  const [vaccinations, setVaccinations] = useState(() => {
    const saved = localStorage.getItem(`unicare_pet_vaccinations_${userId}`);
    return saved ? JSON.parse(saved) : defaultVaccinations;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(`unicare_pet_appointments_${userId}`);
    return saved ? JSON.parse(saved) : [
      {
        id: "pet-app-1",
        petId: "pet-1",
        veterinarian: "Dr. Rajesh Vet Clinic",
        date: "2026-08-20",
        time: "10:00 AM",
        reason: "Annual Wellness Checkup",
        reminderEnabled: true,
        reminderTime: "1 day before",
      }
    ];
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(`unicare_pet_records_${userId}`);
    return saved ? JSON.parse(saved) : defaultPetRecords;
  });

  // Re-sync when user changes
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [petsRes, vaccRes, recRes] = await Promise.all([
            api.get("/pets"),
            api.get("/pets/vaccinations"),
            api.get(`/pets/records?sort_order=${sortOrder}`)
          ]);
          if (petsRes.data?.length > 0) {
            setPets(petsRes.data.map(p => ({ ...p, id: p._id || p.id })));
            setActivePetId(petsRes.data[0]._id || petsRes.data[0].id);
          }
          if (vaccRes.data?.length > 0) {
            setVaccinations(vaccRes.data.map(v => ({ ...v, id: v._id || v.id })));
          }
          if (recRes.data?.length > 0) {
            setRecords(recRes.data.map(r => ({ ...r, id: r._id || r.id, petId: r.pet || r.petId })));
          }
        } catch (error) {
          console.warn("Using local pet state:", error.message);
        }
      };
      fetchData();
    }
  }, [user, sortOrder]);

  useEffect(() => {
    localStorage.setItem(`unicare_pets_${userId}`, JSON.stringify(pets));
  }, [pets, userId]);

  useEffect(() => {
    localStorage.setItem(`unicare_pet_vaccinations_${userId}`, JSON.stringify(vaccinations));
  }, [vaccinations, userId]);

  useEffect(() => {
    localStorage.setItem(`unicare_pet_appointments_${userId}`, JSON.stringify(appointments));
  }, [appointments, userId]);

  useEffect(() => {
    localStorage.setItem(`unicare_pet_records_${userId}`, JSON.stringify(records));
  }, [records, userId]);

  // Extract internal clinical / vaccination date from pet document using Hybrid Engine
  const extractDateFromDocument = async (file, text) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (text) {
        formData.append("text", text);
      }

      const res = await api.post("/pets/extract-date", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.warn("Could not extract pet date via backend, falling back to local date:", err.message);
      return {
        date: new Date().toISOString().slice(0, 10),
        category: "Medical Documents",
        tags: ["Medical Document"],
        method: "fallback_today",
        confidence: "low",
      };
    }
  };

  const addPet = async (data) => {
    const newPet = { ...data, id: "pet-" + Date.now(), owner: user?.name || "Owner" };
    try {
      const res = await api.post("/pets", data);
      if (res.data?._id) newPet.id = res.data._id;
    } catch (error) {
      console.warn("Added pet locally:", error.message);
    }
    setPets((items) => [...items, newPet]);
    setActivePetId(newPet.id);
  };

  const deletePet = async (petId) => {
    try {
      await api.delete(`/pets/${petId}`);
    } catch (error) {
      console.warn("Deleted pet locally:", error.message);
    }
    setPets((items) => {
      const remaining = items.filter((p) => p.id !== petId && p._id !== petId);
      if (activePetId === petId && remaining.length > 0) {
        setActivePetId(remaining[0].id || remaining[0]._id);
      }
      return remaining;
    });
    // Clean local pet records
    setRecords((items) => items.filter((r) => r.petId !== petId));
    setVaccinations((items) => items.filter((v) => v.petId !== petId));
  };

  const addVaccination = async (data) => {
    const newVacc = { ...data, id: "v-" + Date.now(), reminder: "Scheduled" };
    try {
      const res = await api.post("/pets/vaccinations", { ...data, pet: data.petId });
      if (res.data?._id) newVacc.id = res.data._id;
    } catch (error) {
      console.warn("Added vaccination locally:", error.message);
    }
    setVaccinations((items) => [...items, newVacc]);
  };

  const addAppointment = (data) => setAppointments((items) => [
    { 
      id: "pet-app-" + Date.now(), 
      reminderEnabled: true,
      reminderTime: "1 day before",
      ...data 
    }, 
    ...items
  ]);

  const updateAppointment = (id, data) => setAppointments((items) => 
    items.map(item => item.id === id ? { ...item, ...data } : item)
  );

  const deleteAppointment = (id) => setAppointments((items) => 
    items.filter(item => item.id !== id)
  );

  const addRecord = async (data) => {
    const newRecord = { ...data, id: "pet-rec-" + Date.now() };
    try {
      const res = await api.post("/pets/records", {
        ...data,
        pet: data.petId
      });
      if (res.data?._id) newRecord.id = res.data._id;
    } catch (error) {
      console.warn("Added pet record locally:", error.message);
    }
    setRecords((items) => [newRecord, ...items]);
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/pets/records/${id}`);
    } catch (error) {
      console.warn("Deleted pet record locally:", error.message);
    }
    setRecords((items) => items.filter((r) => r.id !== id && r._id !== id));
  };

  // Strictly sort records chronologically by the internal veterinary examination date
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = new Date(a.date || "1970-01-01").getTime();
      const dateB = new Date(b.date || "1970-01-01").getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [records, sortOrder]);

  const searchRecords = (query, category, petId) => sortedRecords.filter((record) => {
    const matchPet = !petId || record.petId === petId;
    const matchCat = !category || record.category === category;
    const matchQuery = !query || 
      record.title.toLowerCase().includes(query.toLowerCase()) || 
      (record.veterinarian && record.veterinarian.toLowerCase().includes(query.toLowerCase()));
    return matchPet && matchCat && matchQuery;
  });
  
  return (
    <PetContext.Provider 
      value={{ 
        pets, 
        activePetId, 
        setActivePetId, 
        vaccinations, 
        appointments, 
        records: sortedRecords,
        rawRecords: records, 
        addPet,
        deletePet, 
        addVaccination, 
        addAppointment, 
        updateAppointment,
        deleteAppointment, 
        addRecord,
        deleteRecord,
        extractDateFromDocument,
        searchRecords,
        sortOrder,
        setSortOrder
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePets = () => useContext(PetContext);
