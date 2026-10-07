import { useState } from "react";
import { usePets } from "../../context/PetContext";
import {
  FaPaw,
  FaSyringe,
  FaUserMd,
  FaFileUpload,
  FaPlus,
  FaCheckCircle,
  FaBell,
  FaBellSlash,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTag,
  FaTags,
  FaEye,
  FaDownload,
  FaTimes,
  FaMagic,
  FaSpinner,
  FaVial,
  FaPrescriptionBottleAlt,
  FaXRay,
  FaNotesMedical,
  FaFileMedical,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

const categories = ["Vaccination History", "Prescriptions", "Scan Reports", "Lab Reports", "Medical Documents"];

const categoryConfig = {
  "Vaccination History": {
    label: "Vaccination & Immunization",
    icon: FaSyringe,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "Prescriptions": {
    label: "Prescriptions & Meds",
    icon: FaPrescriptionBottleAlt,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Scan Reports": {
    label: "Imaging & Scans",
    icon: FaXRay,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "Lab Reports": {
    label: "Lab & Diagnostics",
    icon: FaVial,
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  "Medical Documents": {
    label: "Vet Notes & Documents",
    icon: FaNotesMedical,
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export default function PetHealthcareDashboard() {
  const { 
    pets, 
    activePetId, 
    setActivePetId, 
    vaccinations, 
    appointments, 
    records, 
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
  } = usePets();

  const activePet = pets.find((p) => p.id === activePetId || p._id === activePetId) || pets[0] || {
    id: "default-pet",
    name: "My Pet",
    species: "Dog",
    breed: "Labrador",
    age: "2 Years",
    owner: "Pet Parent"
  };

  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPet, setNewPet] = useState({ name: "", species: "Dog", breed: "", age: "" });

  const [vaccine, setVaccine] = useState({ name: "", date: "", nextDue: "" });
  const [vet, setVet] = useState({ 
    veterinarian: "", 
    date: "", 
    time: "", 
    reason: "Routine Checkup", 
    reminderEnabled: true, 
    reminderTime: "1 day before" 
  });

  // Pet Medical Records state
  const [recordQuery, setRecordQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showRecordUploadModal, setShowRecordUploadModal] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [customTagInput, setCustomTagInput] = useState("");
  const [isExtractingDate, setIsExtractingDate] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [recordForm, setRecordForm] = useState({
    title: "",
    category: categories[0],
    date: new Date().toISOString().slice(0, 10),
    veterinarian: "",
    tags: [],
    file: null,
  });

  const [notice, setNotice] = useState("");

  // --- Nearby Vets (Google Maps) ---
  const [showNearbyVets, setShowNearbyVets] = useState(false);
  const [vetMapQuery, setVetMapQuery] = useState("veterinary+clinic+near+me");
  const [locating, setLocating] = useState(false);

  const handleFindNearbyVets = () => {
    if (showNearbyVets) {
      setShowNearbyVets(false);
      return;
    }
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setVetMapQuery(`veterinary+clinic+near+${latitude},${longitude}`);
          setShowNearbyVets(true);
          setLocating(false);
        },
        () => {
          // Fallback – just use generic query
          setVetMapQuery("veterinary+clinic+near+me");
          setShowNearbyVets(true);
          setLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setVetMapQuery("veterinary+clinic+near+me");
      setShowNearbyVets(true);
      setLocating(false);
    }
  };

  const petVaccinations = vaccinations.filter((v) => (v.petId || v.pet) === (activePet.id || activePet._id));
  const petAppointments = appointments.filter((a) => (a.petId || a.pet) === (activePet.id || activePet._id));
  
  // Filtered records for the currently active pet
  const petRecords = searchRecords(recordQuery, selectedCategory, activePet.id || activePet._id).filter((rec) => {
    if (!selectedTag) return true;
    const recTags = rec.tags || [];
    return recTags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  // Extract unique tags for active pet records
  const activePetUniqueTags = Array.from(
    new Set(
      records
        .filter((r) => (r.petId || r.pet) === (activePet.id || activePet._id))
        .flatMap((r) => r.tags || [])
        .filter(Boolean)
    )
  );

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      if (!file) resolve("#");
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve("#");
      reader.readAsDataURL(file);
    });
  };

  const handleAddPetSubmit = (e) => {
    e.preventDefault();
    addPet(newPet);
    setNewPet({ name: "", species: "Dog", breed: "", age: "" });
    setShowAddPetModal(false);
    setNotice("New pet added successfully!");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleVaccineSubmit = (e) => {
    e.preventDefault();
    addVaccination({ ...vaccine, petId: activePet.id || activePet._id });
    setVaccine({ name: "", date: "", nextDue: "" });
    setNotice("Vaccination recorded!");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleVetSubmit = (e) => {
    e.preventDefault();
    addAppointment({ ...vet, petId: activePet.id || activePet._id });
    if (vet.reminderEnabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    setNotice(`Vet appointment booked for ${activePet.name}! Reminder set for ${vet.reminderEnabled ? vet.reminderTime : "disabled"}.`);
    setVet({ 
      veterinarian: "", 
      date: "", 
      time: "", 
      reason: "Routine Checkup", 
      reminderEnabled: true, 
      reminderTime: "1 day before" 
    });
    setTimeout(() => setNotice(""), 4000);
  };

  const handleRecordFileChange = async (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setRecordForm((prev) => ({
      ...prev,
      file: selectedFile,
      title: prev.title || selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    }));

    setIsExtractingDate(true);
    setExtractedInfo(null);

    try {
      const result = await extractDateFromDocument(selectedFile);
      if (result) {
        const detectedCategory = result.category && categories.includes(result.category) ? result.category : recordForm.category;
        const detectedTags = Array.isArray(result.tags) && result.tags.length > 0 ? result.tags : [detectedCategory];

        setRecordForm((prev) => ({
          ...prev,
          date: result.date || prev.date,
          title: result.title || prev.title,
          veterinarian: result.doctor || prev.veterinarian,
          category: detectedCategory,
          tags: detectedTags,
        }));

        setExtractedInfo({
          date: result.date,
          category: detectedCategory,
          tags: detectedTags,
          title: result.title,
          doctor: result.doctor,
          method: result.method === "vision_ai" ? "Gemini Multimodal Vision OCR" : result.method === "regex" ? "Deterministic Rule Analysis" : result.method === "ai_nlp" ? "AI / NLP Contextual Analysis" : "Default",
          confidence: result.confidence,
        });
      }
    } catch (err) {
      console.error("Pet document extraction failed:", err);
    } finally {
      setIsExtractingDate(false);
    }
  };

  const handleAddCustomTag = (e) => {
    if (e) e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !recordForm.tags.includes(tag)) {
      setRecordForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setCustomTagInput("");
    }
  };

  const handleRemoveRecordTag = (tagToRemove) => {
    setRecordForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    let fileUrl = "#";
    if (recordForm.file) {
      fileUrl = await readFileAsDataURL(recordForm.file);
    } else {
      const sampleText = `UniCare Pet Medical Record\nPet Name: ${activePet.name} (${activePet.species})\nTitle: ${recordForm.title}\nCategory: ${recordForm.category}\nDate: ${recordForm.date}\nVeterinarian/Clinic: ${recordForm.veterinarian}\nTags: ${recordForm.tags.join(", ")}\nStatus: Verified Digital Record`;
      fileUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(sampleText)}`;
    }

    addRecord({
      ...recordForm,
      petId: activePet.id || activePet._id,
      tags: recordForm.tags.length > 0 ? recordForm.tags : [recordForm.category],
      fileName: recordForm.file?.name || `${recordForm.title.replace(/\s+/g, "_")}.pdf`,
      fileUrl,
      fileType: recordForm.file?.type || "application/pdf",
    });

    setRecordForm({
      title: "",
      category: categories[0],
      date: new Date().toISOString().slice(0, 10),
      veterinarian: "",
      tags: [],
      file: null,
    });
    setExtractedInfo(null);
    setShowRecordUploadModal(false);
    setNotice(`Pet health record organized & stored in chronological order for ${activePet.name}!`);
    setTimeout(() => setNotice(""), 4000);
  };

  const handleDeleteRecord = (id) => {
    deleteRecord(id);
    setNotice("Pet record deleted.");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleDownloadPetRecord = (r) => {
    if (!r.fileUrl || r.fileUrl === "#") {
      const sampleText = `UniCare Pet Medical Record\nPet Name: ${activePet.name} (${activePet.species})\nTitle: ${r.title}\nCategory: ${r.category}\nDate: ${r.date}\nVeterinarian: ${r.veterinarian}\nTags: ${(r.tags || []).join(", ")}\nFile: ${r.fileName}`;
      const blob = new Blob([sampleText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.fileName || "pet_health_record.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const a = document.createElement("a");
      a.href = r.fileUrl;
      a.download = r.fileName || "pet_health_record";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white/20 rounded-full">
              Pet Care & Medical Vault
            </span>
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 border border-white/20 rounded-full flex items-center gap-1.5">
              <FaCalendarAlt className="text-[10px]" />
              Chronological Timeline & OCR Tagging
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Pet Healthcare & Digital Vault</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Vaccination tracking, vet appointments, and <strong>AI OCR-analyzed medical records</strong> organized by treatment date.
          </p>
        </div>

        <button
          onClick={() => setShowAddPetModal(true)}
          className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-6 py-3 rounded-2xl transition shadow-md flex items-center gap-2 text-sm shrink-0 active:scale-95"
        >
          <FaPlus />
          <span>Add New Pet</span>
        </button>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
          <FaCheckCircle className="text-emerald-600 text-base" />
          <span>{notice}</span>
        </div>
      )}

      {/* Pet Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {pets.map((p) => {
          const isSelected = (activePet.id || activePet._id) === (p.id || p._id);
          return (
            <button
              key={p.id || p._id}
              onClick={() => setActivePetId(p.id || p._id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition shadow-sm whitespace-nowrap ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <FaPaw className={isSelected ? "text-white" : "text-emerald-600"} />
              <span>{p.name}</span>
              <span className="text-xs font-normal opacity-80">({p.species})</span>
            </button>
          );
        })}
      </div>

      {/* Active Pet Overview Card */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shrink-0">
            <FaPaw />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-800">{activePet.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activePet.species}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mt-0.5">
              Breed: <strong className="text-emerald-700">{activePet.breed}</strong> · Age: {activePet.age}
            </p>
            <p className="text-xs text-slate-400 mt-1">Parent / Guardian: {activePet.owner || "Pet Parent"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-center">
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Vaccinations</span>
            <p className="text-lg font-black text-slate-800">{petVaccinations.length}</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Vet Visits</span>
            <p className="text-lg font-black text-slate-800">{petAppointments.length}</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Medical Reports</span>
            <p className="text-lg font-black text-emerald-600">{petRecords.length}</p>
          </div>

          <button
            onClick={handleFindNearbyVets}
            disabled={locating}
            className={`px-3.5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 ${
              showNearbyVets
                ? "bg-teal-600 text-white shadow-md"
                : "bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200"
            }`}
            title="Find nearby veterinary clinics on Google Maps"
          >
            {locating ? (
              <FaSpinner className="text-xs animate-spin" />
            ) : (
              <FaMapMarkerAlt className="text-xs" />
            )}
            <span>{showNearbyVets ? "Hide Map" : "Nearby Vets"}</span>
          </button>

          {pets.length > 1 && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove ${activePet.name}'s profile and records?`)) {
                  deletePet(activePet.id || activePet._id);
                  setNotice(`${activePet.name}'s profile has been removed.`);
                  setTimeout(() => setNotice(""), 3000);
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3.5 py-3 rounded-2xl transition text-xs flex items-center gap-1.5 shrink-0"
              title="Remove this pet profile"
            >
              <FaTrash className="text-xs" />
              <span>Remove Pet</span>
            </button>
          )}
        </div>
      </section>

      {/* Nearby Vets – Collapsible Google Maps Panel */}
      {showNearbyVets && (
        <section className="bg-white rounded-3xl shadow-sm border border-teal-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-teal-100 bg-teal-50/50">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-teal-600 text-sm" />
              <h3 className="text-sm font-bold text-slate-800">Nearby Veterinary Clinics</h3>
              <span className="text-[10px] font-medium text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">Google Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/search/${vetMapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 transition"
              >
                Open in Google Maps <FaExternalLinkAlt className="text-[9px]" />
              </a>
              <button
                onClick={() => setShowNearbyVets(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>
          <iframe
            title="Nearby Veterinary Clinics"
            src={`https://www.google.com/maps?q=${vetMapQuery}&output=embed`}
            className="w-full h-[340px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>
      )}

      {/* ---------------- Pet Medical Records Section (OCR & Chronological Vault) ---------------- */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <FaFileUpload className="text-xl" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">
                {activePet.name}'s Medical Records & Vault
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Chronologically organized by <strong>actual examination / vaccination date</strong> inside each document.
            </p>
          </div>

          <button
            onClick={() => {
              setRecordForm({
                title: "",
                category: categories[0],
                date: new Date().toISOString().slice(0, 10),
                veterinarian: "",
                tags: [],
                file: null,
              });
              setExtractedInfo(null);
              setShowRecordUploadModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl transition shadow-md flex items-center gap-2 text-xs shrink-0 active:scale-95"
          >
            <FaPlus />
            <span>Upload & Analyze Pet Report</span>
          </button>
        </div>

        {/* Search, Filter & Chronological Sorting Bar */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                placeholder={`Search ${activePet.name}'s records by title, doctor, or test...`}
                value={recordQuery}
                onChange={(e) => setRecordQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <select
                className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedTag("");
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Chronological Sort Toggle Button */}
              <button
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-2 transition shrink-0"
                title="Toggle Chronological Sort Order"
              >
                {sortOrder === "desc" ? (
                  <>
                    <FaSortAmountDown className="text-emerald-600" />
                    <span>Newest Date First</span>
                  </>
                ) : (
                  <>
                    <FaSortAmountUp className="text-emerald-600" />
                    <span>Oldest Date First</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tag Filter Chips Bar */}
          {activePetUniqueTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <FaTags className="text-emerald-600 text-xs" /> Tags:
              </span>
              <button
                onClick={() => setSelectedTag("")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  selectedTag === ""
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Tags
              </button>
              {activePetUniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1 ${
                    selectedTag === tag
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <FaTag className="text-[9px] opacity-70" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pet Record Cards List */}
        <div className="space-y-3 pt-2">
          {petRecords.map((record) => {
            const conf = categoryConfig[record.category] || categoryConfig["Medical Documents"];
            const CategoryIcon = conf.icon;
            const recTags = record.tags || [record.category];

            return (
              <article
                key={record.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/80 p-4 hover:border-emerald-400 hover:shadow-md transition bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3.5 rounded-2xl ${conf.bg} ${conf.text} shrink-0`}>
                    <CategoryIcon className="text-2xl" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">{record.title}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <FaCalendarAlt className="text-[9px]" />
                        Treatment Date: {record.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${conf.badge}`}>
                        {record.category}
                      </span>
                      {record.veterinarian && (
                        <span>· Vet Clinic: <strong className="text-slate-700">{record.veterinarian}</strong></span>
                      )}
                    </div>

                    {/* Tag Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {recTags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedTag(tag)}
                          className="cursor-pointer text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition flex items-center gap-1"
                        >
                          <FaTag className="text-[8px] text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-400 font-mono">{record.fileName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setPreviewRecord(record)}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
                  >
                    <FaEye />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPetRecord(record)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-xs"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="rounded-xl bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition"
                    title="Delete Record"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })}

          {!petRecords.length && (
            <div className="py-12 text-center text-slate-500 font-medium space-y-2">
              <FaFileMedical className="text-4xl text-slate-300 mx-auto" />
              <p>No pet medical records found matching your query or tag filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tracker Forms Grid: Vaccination Tracker & Vet Consultation */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vaccination Tracker Form */}
        <form onSubmit={handleVaccineSubmit} className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaSyringe className="text-emerald-600" /> Quick Vaccination Entry ({activePet.name})
          </h2>

          <input
            required
            type="text"
            className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Vaccine Name (e.g. Rabies Booster, DHPP, FVRCP)"
            value={vaccine.name}
            onChange={(e) => setVaccine({ ...vaccine, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Administered Date</label>
              <input
                required
                type="date"
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                value={vaccine.date}
                onChange={(e) => setVaccine({ ...vaccine, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Next Due Date</label>
              <input
                required
                type="date"
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                value={vaccine.nextDue}
                onChange={(e) => setVaccine({ ...vaccine, nextDue: e.target.value })}
              />
            </div>
          </div>

          <button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 font-bold text-white transition shadow-sm text-xs">
            Record Vaccination
          </button>

          <div className="space-y-2 pt-2">
            {petVaccinations.map((v) => (
              <div key={v.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">{v.name}</span>
                  <p className="text-slate-500 mt-0.5">Administered: {v.date} · Next Due: {v.nextDue}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  {v.reminder || "Active"}
                </span>
              </div>
            ))}
            {!petVaccinations.length && <p className="text-slate-400 text-xs py-2">No vaccination history recorded for this pet.</p>}
          </div>
        </form>

        {/* Vet Appointment & Reminder Form */}
        <form onSubmit={handleVetSubmit} className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaUserMd className="text-emerald-600" /> Book Vet Appointment & Set Reminder ({activePet.name})
            </h2>
            <p className="text-slate-500 text-xs mt-1">Book consultation and schedule automated notification reminders.</p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Veterinarian / Clinic Name *</label>
                <input
                  required
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Dr. Rajesh Vet Clinic"
                  value={vet.veterinarian}
                  onChange={(e) => setVet({ ...vet, veterinarian: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Visit Date *</label>
                  <input
                    required
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={vet.date}
                    onChange={(e) => setVet({ ...vet, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time *</label>
                  <input
                    required
                    type="time"
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={vet.time}
                    onChange={(e) => setVet({ ...vet, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason / Notes</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Annual Vaccination & Wellness Check"
                  value={vet.reason}
                  onChange={(e) => setVet({ ...vet, reason: e.target.value })}
                />
              </div>

              {/* Reminder Controls */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="petVetReminderToggle" className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase cursor-pointer">
                    <FaBell className="text-amber-500" /> Set Reminder (Day Before)
                  </label>
                  <input
                    id="petVetReminderToggle"
                    type="checkbox"
                    checked={vet.reminderEnabled}
                    onChange={(e) => setVet({ ...vet, reminderEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {vet.reminderEnabled && (
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">Remind Me</label>
                    <select
                      value={vet.reminderTime}
                      onChange={(e) => setVet({ ...vet, reminderTime: e.target.value })}
                      className="w-full border border-emerald-200 rounded-xl p-2 text-xs bg-white text-slate-700 font-medium"
                    >
                      <option value="1 day before">1 day before appointment (Default)</option>
                      <option value="12 hours before">12 hours before</option>
                      <option value="2 hours before">2 hours before</option>
                      <option value="Day of appointment (08:00 AM)">Day of appointment (08:00 AM)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="w-full mt-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 py-3 font-bold text-white transition shadow-sm flex items-center justify-center gap-2 text-xs">
            <FaBell />
            <span>Book Appointment & Set Reminder</span>
          </button>

          <div className="space-y-2 pt-4 border-t border-slate-100 mt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Scheduled Vet Appointments</h4>
            {petAppointments.map((a) => (
              <div key={a.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center gap-2">
                <div>
                  <span className="font-bold text-slate-800">{a.veterinarian}</span>
                  {a.reason && <span className="text-slate-500 ml-1.5 font-normal">({a.reason})</span>}
                  <p className="text-slate-600 mt-0.5 font-medium">{a.date} at {a.time}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateAppointment && updateAppointment(a.id, { reminderEnabled: !a.reminderEnabled })}
                    className={`px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 transition text-[11px] ${
                      a.reminderEnabled
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-200 text-slate-600"
                    }`}
                    title="Click to toggle reminder"
                  >
                    {a.reminderEnabled ? <FaBell className="text-amber-600 text-xs" /> : <FaBellSlash className="text-xs" />}
                    <span>{a.reminderEnabled ? `Remind: ${a.reminderTime || "1 day before"}` : "Off"}</span>
                  </button>

                  {deleteAppointment && (
                    <button
                      type="button"
                      onClick={() => deleteAppointment(a.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition"
                      title="Cancel Appointment"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!petAppointments.length && <p className="text-slate-400 text-xs py-2">No vet appointments booked for {activePet.name}.</p>}
          </div>
        </form>
      </div>

      {/* ---------------- Upload & Analyze Pet Report Modal ---------------- */}
      {showRecordUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload & Analyze Pet Document ({activePet.name})</h3>
                <p className="text-xs text-slate-500">Treatment date, category & veterinary tags are auto-detected by OCR AI.</p>
              </div>
              <button
                onClick={() => setShowRecordUploadModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              {/* File Upload Input */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Pet Medical Document (PDF, Image, Text)</label>
                <input
                  type="file"
                  onChange={handleRecordFileChange}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                  className="w-full rounded-2xl border border-slate-200 p-2.5 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Date & OCR Extraction Loading Banner */}
              {isExtractingDate && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-2.5 text-xs font-semibold animate-pulse">
                  <FaSpinner className="animate-spin text-emerald-600 text-base shrink-0" />
                  <div>
                    <p>Analyzing document content with Gemini Vision OCR...</p>
                    <p className="text-[11px] text-emerald-600 font-normal">Extracting examination date, category & veterinary tags</p>
                  </div>
                </div>
              )}

              {/* Extraction Success Banner */}
              {extractedInfo && !isExtractingDate && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <FaCheckCircle className="text-emerald-600 text-sm" />
                    <span>Clinical Examination Date: {extractedInfo.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-emerald-800">Detected Category:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 font-bold text-emerald-800 text-[10px]">
                      {extractedInfo.category}
                    </span>
                  </div>
                  {extractedInfo.tags && extractedInfo.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[11px] font-semibold text-emerald-800">Veterinary Tags:</span>
                      {extractedInfo.tags.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-white/80 border border-emerald-300 rounded text-[10px] text-emerald-900 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-emerald-700">
                    Extracted via <strong>{extractedInfo.method}</strong> ({extractedInfo.confidence} confidence).
                  </p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Document Title</label>
                <input
                  required
                  value={recordForm.title}
                  onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                  placeholder="e.g. Annual Rabies Vaccine Certificate or Hip X-Ray"
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category / Classification</label>
                  <select
                    value={recordForm.category}
                    onChange={(e) => setRecordForm({ ...recordForm, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1 flex items-center justify-between">
                    <span>Clinical / Vaccine Date</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <FaMagic /> Auto-sorted
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    value={recordForm.date}
                    onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Veterinarian / Clinic */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Veterinarian / Animal Hospital</label>
                <input
                  value={recordForm.veterinarian}
                  onChange={(e) => setRecordForm({ ...recordForm, veterinarian: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Vet Clinic or Apex Pet Hospital"
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              {/* Tags Management */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Veterinary & Diagnostic Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Add custom tag (e.g. Rabies, Deworming, X-Ray) and press Enter"
                    className="flex-1 rounded-2xl border border-slate-200 p-2.5 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap min-h-[30px]">
                  {recordForm.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[11px] flex items-center gap-1.5"
                    >
                      <FaTag className="text-[9px]" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecordTag(tag)}
                        className="hover:text-red-600 transition"
                      >
                        <FaTimes className="text-[9px]" />
                      </button>
                    </span>
                  ))}
                  {!recordForm.tags.length && (
                    <span className="text-[11px] text-slate-400 italic">No tags added yet.</span>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecordUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  Save & Organize Chronologically
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- View/Preview Pet Record Modal ---------------- */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600">{previewRecord.category}</span>
                <h3 className="text-xl font-extrabold text-slate-800">{previewRecord.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Treatment / Examination Date: <strong>{previewRecord.date}</strong> · Veterinarian: {previewRecord.veterinarian || "N/A"}
                </p>
                {previewRecord.tags && previewRecord.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {previewRecord.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <FaTag className="text-[8px]" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setPreviewRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Document Preview Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-200/80 min-h-[220px] flex flex-col items-center justify-center text-center">
              {previewRecord.fileUrl && previewRecord.fileUrl.startsWith("data:image") ? (
                <img src={previewRecord.fileUrl} alt={previewRecord.title} className="max-h-72 object-contain rounded-xl shadow-sm" />
              ) : previewRecord.fileUrl && previewRecord.fileUrl.startsWith("data:text") ? (
                <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap text-left w-full">
                  {decodeURIComponent(previewRecord.fileUrl.split(",")[1] || "")}
                </pre>
              ) : (
                <div className="space-y-3 py-6">
                  <FaPaw className="text-5xl text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">{previewRecord.fileName}</p>
                  <p className="text-xs text-slate-500">Pet health document securely archived in UniCare Vault.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400 font-mono">ID: {previewRecord.id}</span>
              <button
                onClick={() => handleDownloadPetRecord(previewRecord)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <FaDownload />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Add New Pet Modal ---------------- */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <form
            onSubmit={handleAddPetSubmit}
            className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100"
          >
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <FaPaw className="text-emerald-600" /> Add New Pet Profile
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pet Name</label>
              <input
                required
                className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Max"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Species</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newPet.species}
                  onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Breed</label>
                <input
                  required
                  className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Beagle"
                  value={newPet.breed}
                  onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Age</label>
              <input
                required
                className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 2 Years"
                value={newPet.age}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddPetModal(false)}
                className="rounded-2xl px-5 py-2.5 text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm"
              >
                Save Pet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
