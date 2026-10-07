import { useState } from "react";
import {
  FaDownload,
  FaFileMedical,
  FaPlus,
  FaTrash,
  FaSearch,
  FaEye,
  FaTimes,
  FaCloudDownloadAlt,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaMagic,
  FaSpinner,
  FaCheckCircle,
  FaTag,
  FaTags,
  FaVial,
  FaPrescriptionBottleAlt,
  FaXRay,
  FaSyringe,
  FaNotesMedical,
} from "react-icons/fa";
import { useHealthRecords } from "../../context/HealthRecordContext";

const categories = ["Prescriptions", "Lab Reports", "Scan Reports", "Vaccination History", "Medical Documents"];

const categoryConfig = {
  "Scan Reports": {
    label: "Scan Reports / Imaging",
    icon: FaXRay,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "Prescriptions": {
    label: "Prescriptions",
    icon: FaPrescriptionBottleAlt,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Vaccination History": {
    label: "Vaccination History",
    icon: FaSyringe,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "Lab Reports": {
    label: "Lab Reports",
    icon: FaVial,
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  "Medical Documents": {
    label: "Medical Documents",
    icon: FaNotesMedical,
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export default function HealthRecordsDashboard() {
  const { records, addRecord, deleteRecord, searchRecords, extractDateFromDocument, sortOrder, setSortOrder } = useHealthRecords();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    date: new Date().toISOString().slice(0, 10),
    doctor: "",
    tags: [],
    file: null,
  });
  const [isExtractingDate, setIsExtractingDate] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [notice, setNotice] = useState("");

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      if (!file) resolve("#");
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve("#");
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setForm((prev) => ({
      ...prev,
      file: selectedFile,
      title: prev.title || selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    }));

    // Trigger Hybrid OCR & Date + Category/Tag Extraction
    setIsExtractingDate(true);
    setExtractedInfo(null);
    try {
      const result = await extractDateFromDocument(selectedFile);
      if (result) {
        const detectedCategory = result.category && categories.includes(result.category) ? result.category : form.category;
        const detectedTags = Array.isArray(result.tags) && result.tags.length > 0 ? result.tags : [detectedCategory];

        setForm((prev) => ({
          ...prev,
          date: result.date || prev.date,
          title: result.title || prev.title,
          doctor: result.doctor || prev.doctor,
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
      console.error("Date & Tag extraction failed:", err);
    } finally {
      setIsExtractingDate(false);
    }
  };

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setCustomTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    let fileUrl = "#";
    if (form.file) {
      fileUrl = await readFileAsDataURL(form.file);
    } else {
      // Create a sample downloadable text data URL
      const sampleText = `UniCare Health Record\nTitle: ${form.title}\nCategory: ${form.category}\nDate: ${form.date}\nDoctor: ${form.doctor}\nTags: ${form.tags.join(", ")}\nStatus: Verified Digital Record`;
      fileUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(sampleText)}`;
    }

    addRecord({
      ...form,
      tags: form.tags.length > 0 ? form.tags : [form.category],
      fileName: form.file?.name || `${form.title.replace(/\s+/g, "_")}.pdf`,
      fileUrl,
      fileType: form.file?.type || "application/pdf",
    });

    setForm({
      title: "",
      category: categories[0],
      date: new Date().toISOString().slice(0, 10),
      doctor: "",
      tags: [],
      file: null,
    });
    setExtractedInfo(null);
    setShowUploadModal(false);
    setNotice("Health record organized & stored in chronological order by report date!");
    setTimeout(() => setNotice(""), 4000);
  };

  const handleDelete = (id) => {
    deleteRecord(id);
    setNotice("Record deleted.");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleDownload = (record) => {
    if (!record.fileUrl || record.fileUrl === "#") {
      const sampleText = `UniCare Health Record\nTitle: ${record.title}\nCategory: ${record.category}\nDate: ${record.date}\nDoctor: ${record.doctor}\nTags: ${(record.tags || []).join(", ")}\nDocument File: ${record.fileName}`;
      const blob = new Blob([sampleText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = record.fileName || "health_record.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const a = document.createElement("a");
      a.href = record.fileUrl;
      a.download = record.fileName || "health_record";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Filter records by query, category, and selected tag
  const filtered = searchRecords(query, selectedCategory).filter((rec) => {
    if (!selectedTag) return true;
    const recTags = rec.tags || [];
    return recTags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  // Extract all unique tags across records for tag quick-filters
  const allUniqueTags = Array.from(
    new Set(records.flatMap((r) => r.tags || []).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white/20 rounded-full">
              Secure Medical Vault
            </span>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 rounded-full flex items-center gap-1.5">
              <FaCalendarAlt className="text-[10px]" />
              Chronological Timeline & OCR Tagging
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Health Records & Medical Vault</h1>
          <p className="text-blue-100 text-sm mt-1">
            Automatically organized chronologically with <strong>AI Vision OCR tagging</strong> for imaging, prescriptions, vaccinations, and lab tests.
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              title: "",
              category: categories[0],
              date: new Date().toISOString().slice(0, 10),
              doctor: "",
              tags: [],
              file: null,
            });
            setExtractedInfo(null);
            setShowUploadModal(true);
          }}
          className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 py-3 rounded-2xl transition shadow-md flex items-center gap-2 text-sm shrink-0 active:scale-95"
        >
          <FaPlus />
          <span>Upload & Analyze Report</span>
        </button>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
          <FaCloudDownloadAlt className="text-emerald-600 text-lg" />
          <span>{notice}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex items-center gap-3.5">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <FaXRay className="text-xl" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Imaging / Scans</p>
            <p className="text-2xl font-black text-slate-800">
              {records.filter((r) => r.category === "Scan Reports" || (r.tags && r.tags.includes("Imaging"))).length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FaPrescriptionBottleAlt className="text-xl" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Prescriptions</p>
            <p className="text-2xl font-black text-blue-600">
              {records.filter((r) => r.category === "Prescriptions").length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FaSyringe className="text-xl" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Vaccinations</p>
            <p className="text-2xl font-black text-emerald-600">
              {records.filter((r) => r.category === "Vaccination History").length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <FaVial className="text-xl" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Lab Reports</p>
            <p className="text-2xl font-black text-amber-600">
              {records.filter((r) => r.category === "Lab Reports").length}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filter & Chronological Sorting Bar */}
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              placeholder="Search health records by title, doctor, or test name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <select
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
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
                  <FaSortAmountDown className="text-indigo-600" />
                  <span>Newest Date First</span>
                </>
              ) : (
                <>
                  <FaSortAmountUp className="text-indigo-600" />
                  <span>Oldest Date First</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tag Filters Bar */}
        {allUniqueTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <FaTags className="text-indigo-500 text-xs" /> Tags:
            </span>
            <button
              onClick={() => setSelectedTag("")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedTag === ""
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Tags
            </button>
            {allUniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1 ${
                  selectedTag === tag
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <FaTag className="text-[9px] opacity-70" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}

        {/* Record Cards List Sorted Chronologically */}
        <div className="space-y-3 pt-2">
          {filtered.map((record) => {
            const conf = categoryConfig[record.category] || categoryConfig["Medical Documents"];
            const CategoryIcon = conf.icon;
            const recTags = record.tags || [record.category];

            return (
              <article
                key={record.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/80 p-4 hover:border-indigo-400 hover:shadow-md transition bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3.5 rounded-2xl ${conf.bg} ${conf.text} shrink-0`}>
                    <CategoryIcon className="text-2xl" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-slate-900 text-base">{record.title}</h2>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                        <FaCalendarAlt className="text-[9px]" />
                        Report Date: {record.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${conf.badge}`}>
                        {record.category}
                      </span>
                      {record.doctor && <span>· Doctor/Clinic: <strong className="text-slate-700">{record.doctor}</strong></span>}
                    </div>

                    {/* Tag Badges List */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {recTags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedTag(tag)}
                          className="cursor-pointer text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition flex items-center gap-1"
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
                    onClick={() => handleDownload(record)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-xs"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => handleDelete(record.id)}
                    className="rounded-xl bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition"
                    title="Delete Record"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })}

          {!filtered.length && (
            <div className="py-12 text-center text-slate-500 font-medium space-y-2">
              <FaFileMedical className="text-4xl text-slate-300 mx-auto" />
              <p>No medical records found matching your query or tag filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload New Report Modal with Hybrid Date & Category OCR Extraction */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload & Analyze Medical Document</h3>
                <p className="text-xs text-slate-500">Report date, category & diagnostic tags are auto-detected by OCR AI.</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4 text-xs">
              {/* File Upload Input */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Medical Document (PDF, Image, Text)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                  className="w-full rounded-2xl border border-slate-200 p-2.5 bg-slate-50 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Date & OCR Extraction Loading Banner */}
              {isExtractingDate && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center gap-2.5 text-xs font-semibold animate-pulse">
                  <FaSpinner className="animate-spin text-indigo-600 text-base shrink-0" />
                  <div>
                    <p>Analyzing document content with Gemini Vision OCR...</p>
                    <p className="text-[11px] text-indigo-500 font-normal">Extracting clinical examination date, category & medical tags</p>
                  </div>
                </div>
              )}

              {/* Extraction Success Banner with Extracted Details */}
              {extractedInfo && !isExtractingDate && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <FaCheckCircle className="text-emerald-600 text-sm" />
                    <span>Clinical Date Extracted: {extractedInfo.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-emerald-800">Auto Category:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 font-bold text-emerald-800 text-[10px]">
                      {extractedInfo.category}
                    </span>
                  </div>
                  {extractedInfo.tags && extractedInfo.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[11px] font-semibold text-emerald-800">Tags:</span>
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
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Annual Blood Chemistry, Chest X-Ray, or Amoxicillin Rx"
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category / Classification</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
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
                    <span>Clinical Examination Date</span>
                    <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-0.5">
                      <FaMagic /> Auto-sorted
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Doctor / Clinic */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Doctor / Clinic / Hospital Name</label>
                <input
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  placeholder="e.g. Dr. Amanda Evans or Apex Diagnostic Center"
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>

              {/* Tags Management */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Medical & Diagnostic Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add custom tag (e.g. MRI, Antibiotics, Booster) and press Enter"
                    className="flex-1 rounded-2xl border border-slate-200 p-2.5 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap min-h-[30px]">
                  {form.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-[11px] flex items-center gap-1.5"
                    >
                      <FaTag className="text-[9px]" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600 transition"
                      >
                        <FaTimes className="text-[9px]" />
                      </button>
                    </span>
                  ))}
                  {!form.tags.length && (
                    <span className="text-[11px] text-slate-400 italic">No tags added yet.</span>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  Save & Organize Chronologically
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600">{previewRecord.category}</span>
                <h3 className="text-xl font-extrabold text-slate-800">{previewRecord.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clinical Examination Date: <strong>{previewRecord.date}</strong> · Doctor/Clinic: {previewRecord.doctor || "N/A"}
                </p>
                {previewRecord.tags && previewRecord.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {previewRecord.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
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
                  <FaFileMedical className="text-5xl text-indigo-600 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">{previewRecord.fileName}</p>
                  <p className="text-xs text-slate-500">Document securely archived in UniCare Medical Vault.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400 font-mono">ID: {previewRecord.id}</span>
              <button
                onClick={() => handleDownload(previewRecord)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <FaDownload />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
