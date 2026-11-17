import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useHospital } from "../../context/HospitalContext";
import {
  FiDroplet,
  FiAlertCircle,
  FiPlus,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiMapPin,
  FiLogOut,
  FiX,
  FiCopy,
  FiTrash2,
  FiActivity,
  FiShield,
  FiRadio,
} from "react-icons/fi";
import { FaUserMd, FaHospital, FaStethoscope, FaSyringe } from "react-icons/fa";
import ThemeToggle from "../../components/common/ThemeToggle";
import UniCareLogo from "../../components/common/UniCareLogo";

function HospitalPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    hospitalName,
    hospitalRequests,
    postBloodEmergency,
    updateRequestStatus,
    deleteRequest,
    hospitalDoctors,
    updateDoctorStatus,
    addDoctorToRoster,
    removeDoctorFromRoster,
  } = useHospital();

  const [activeTab, setActiveTab] = useState("blood"); // "blood" or "doctors"
  const [bloodSearch, setBloodSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorStatusFilter, setDoctorStatusFilter] = useState("All");

  // Modals
  const [openBloodModal, setOpenBloodModal] = useState(false);
  const [bloodForm, setBloodForm] = useState({
    bloodGroup: "O-",
    unitsNeeded: 2,
    urgency: "Critical",
    department: "Emergency Trauma ICU",
    patient: "",
    contact: user?.hospitalDetails?.emergencyContact || "+91 80 2630 4055",
    clinicalNotes: "",
  });

  const [openDoctorModal, setOpenDoctorModal] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    speciality: "General Physician",
    department: "Emergency Triage",
    status: "Available",
    shift: "08:00 AM - 04:00 PM",
    room: "OPD Room 101",
    contact: "",
    experience: "5 Years",
  });

  const [copiedId, setCopiedId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login?role=hospital");
  };

  // Metrics
  const activeEmergencies = useMemo(() => {
    return hospitalRequests.filter((r) => r.status !== "Completed" && r.status !== "Cancelled");
  }, [hospitalRequests]);

  const criticalUnitsCount = useMemo(() => {
    return activeEmergencies.reduce((acc, r) => acc + (Number(r.unitsNeeded) || 1), 0);
  }, [activeEmergencies]);

  const availableDoctorsCount = useMemo(() => {
    return hospitalDoctors.filter((d) => d.status === "Available").length;
  }, [hospitalDoctors]);

  // Filtered Blood Requests
  const filteredRequests = useMemo(() => {
    if (!bloodSearch.trim()) return hospitalRequests;
    const query = bloodSearch.toLowerCase();
    return hospitalRequests.filter((r) => {
      const matchGroup = r.bloodGroup?.toLowerCase().includes(query);
      const matchDept = r.department?.toLowerCase().includes(query);
      const matchPatient = r.patient?.toLowerCase().includes(query);
      return matchGroup || matchDept || matchPatient;
    });
  }, [hospitalRequests, bloodSearch]);

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return hospitalDoctors.filter((doc) => {
      if (doctorStatusFilter !== "All" && doc.status !== doctorStatusFilter) {
        return false;
      }
      if (doctorSearch.trim()) {
        const query = doctorSearch.toLowerCase();
        const matchName = doc.name?.toLowerCase().includes(query);
        const matchSpec = doc.speciality?.toLowerCase().includes(query);
        const matchDept = doc.department?.toLowerCase().includes(query);
        return matchName || matchSpec || matchDept;
      }
      return true;
    });
  }, [hospitalDoctors, doctorStatusFilter, doctorSearch]);

  // Submit Blood Alert
  const handlePostBlood = async (e) => {
    e.preventDefault();
    await postBloodEmergency(bloodForm);
    setBloodForm({
      bloodGroup: "O-",
      unitsNeeded: 2,
      urgency: "Critical",
      department: "Emergency Trauma ICU",
      patient: "",
      contact: user?.hospitalDetails?.emergencyContact || "+91 80 2630 4055",
      clinicalNotes: "",
    });
    setOpenBloodModal(false);
  };

  // Submit Doctor Roster
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!doctorForm.name) return;

    await addDoctorToRoster(doctorForm);
    setDoctorForm({
      name: "",
      email: "",
      speciality: "General Physician",
      department: "Emergency Triage",
      status: "Available",
      shift: "08:00 AM - 04:00 PM",
      room: "OPD Room 101",
      contact: "",
      experience: "5 Years",
    });
    setOpenDoctorModal(false);
  };

  const copyBroadcastText = (req) => {
    const text = `🚨 [EMERGENCY BLOOD BROADCAST]\nHospital: ${hospitalName}\nBlood Group: ${req.bloodGroup} (${req.urgency.toUpperCase()})\nUnits Needed: ${req.unitsNeeded}\nWard: ${req.department}\nContact: ${req.contact}\nPatient ID: ${req.patient || "Trauma Emergency"}\nVerified on UniCare Platform.`;
    navigator.clipboard.writeText(text);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Hospital Operations Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UniCareLogo size="sm" subtitle="Operations" />
            <div className="h-5 w-px bg-slate-200 dark:border-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 uppercase tracking-wider flex items-center gap-1.5">
                <FaHospital className="text-xs" /> Hospital Operations Desk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
                <span>{hospitalName}</span>
                {user?.hospitalDetails?.licenseNo && (
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                    {user.hospitalDetails.licenseNo}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[260px]">
                {user?.hospitalDetails?.address || "Emergency Response Center"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Operations Console */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Hospital Mission Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 opacity-10 pointer-events-none">
            <FaHospital className="w-72 h-72" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
              <FiRadio className="animate-pulse" /> Dedicated Hospital Operations Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {hospitalName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Publish emergency blood broadcasts to donor radar in real-time, and monitor on-duty medical specialists currently available in your wards.
            </p>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span>Hotline: <strong className="text-white">{user?.hospitalDetails?.emergencyContact || user?.hospitalDetails?.phone || "+91 80 2630 4055"}</strong></span>
              <span>•</span>
              <span>Accreditation: <strong className="text-white">NABH / Blood Bank Protocol</strong></span>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
            <button
              onClick={() => setOpenBloodModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition active:scale-[0.98] cursor-pointer"
            >
              <FiDroplet className="text-sm animate-bounce" />
              <span>Broadcast Blood Emergency</span>
            </button>

            <button
              onClick={() => setOpenDoctorModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition active:scale-[0.98] cursor-pointer"
            >
              <FaUserMd />
              <span>Add Doctor to Duty Roster</span>
            </button>
          </div>
        </div>

        {/* Real-Time Operational Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Emergencies</span>
              <FiRadio className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
              {activeEmergencies.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Broadcasts on live radar</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Units Needed</span>
              <FiDroplet className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
              {criticalUnitsCount}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Units required across wards</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Doctors Available</span>
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
              {availableDoctorsCount}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Currently on active duty</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Medical Staff</span>
              <FaUserMd className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
              {hospitalDoctors.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Specialists on duty shift</p>
          </div>
        </div>

        {/* Tab Switching: Purely Blood Emergency vs Available Doctors */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("blood")}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "blood"
                ? "border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiDroplet />
            <span>Blood Emergency Broadcasts ({hospitalRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "doctors"
                ? "border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FaUserMd />
            <span>Available Doctors on Duty ({hospitalDoctors.length})</span>
          </button>
        </div>

        {/* TAB 1: BLOOD EMERGENCY BROADCASTS */}
        {activeTab === "blood" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Filter by blood group (e.g. O-, B+), ward, or patient..."
                  value={bloodSearch}
                  onChange={(e) => setBloodSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={() => setOpenBloodModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Broadcast New Emergency</span>
              </button>
            </div>

            {/* Emergency Cards List */}
            {filteredRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-xl">
                  <FiDroplet />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">No active blood emergency alerts</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                  {bloodSearch ? "No alerts match your filter." : "Your hospital has no active emergency broadcasts."}
                </p>
                <button
                  onClick={() => setOpenBloodModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <FiPlus /> Broadcast Emergency Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      req.status === "Completed"
                        ? "border-slate-200/80 dark:border-slate-800 opacity-70"
                        : req.urgency === "Critical"
                        ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10"
                        : "border-slate-200/90 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Blood Group Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-xl font-black tracking-tight">{req.bloodGroup}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100">
                          {req.unitsNeeded} {req.unitsNeeded === 1 ? "Unit" : "Units"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              req.urgency === "Critical"
                                ? "bg-red-600 text-white animate-pulse"
                                : req.urgency === "Urgent"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                            }`}
                          >
                            ⚡ {req.urgency}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === "Completed"
                                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                                : req.status === "In Progress"
                                ? "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300"
                                : req.status === "Cancelled"
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                : "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300"
                            }`}
                          >
                            Status: {req.status}
                          </span>

                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Ward: {req.department || "Emergency ICU"}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>Patient / Case: <strong className="text-slate-700 dark:text-slate-300">{req.patient || "Trauma Case"}</strong></span>
                          <span>Emergency Contact: <strong className="text-slate-700 dark:text-slate-300">{req.contact}</strong></span>
                        </div>

                        {req.clinicalNotes && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mt-1 max-w-xl">
                            {req.clinicalNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyBroadcastText(req)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                          title="Copy broadcast dispatch text"
                        >
                          <FiCopy className="w-3.5 h-3.5" />
                          <span>{copiedId === req.id ? "Copied!" : "Copy Alert"}</span>
                        </button>

                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Delete Request"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {req.status !== "Completed" && (
                          <button
                            onClick={() => updateRequestStatus(req.id, "Completed")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                          >
                            <FiCheckCircle /> Mark Fulfilled
                          </button>
                        )}

                        {req.status === "Pending" && (
                          <button
                            onClick={() => updateRequestStatus(req.id, "In Progress")}
                            className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            In Transfusion
                          </button>
                        )}

                        {req.status !== "Cancelled" && req.status !== "Completed" && (
                          <button
                            onClick={() => updateRequestStatus(req.id, "Cancelled")}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1.5 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AVAILABLE DOCTORS ON DUTY */}
        {activeTab === "doctors" && (
          <div className="space-y-4">
            {/* Doctor Controls Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 flex-wrap flex-1">
                <div className="relative flex-1 max-w-xs">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search doctor or speciality..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <select
                  value={doctorStatusFilter}
                  onChange={(e) => setDoctorStatusFilter(e.target.value)}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="All">All Duty Statuses</option>
                  <option value="Available">Available Now</option>
                  <option value="In Consultation">In Consultation</option>
                  <option value="In Surgery">In Surgery</option>
                  <option value="On Call">On Call</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              <button
                onClick={() => setOpenDoctorModal(true)}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-rose-700 dark:hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Doctor to Shift Roster</span>
              </button>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-xl">
                  <FaUserMd />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">No doctors match this filter</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                  Adjust your search or add a new doctor to the duty roster.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs flex flex-col justify-between space-y-4 relative"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xl shrink-0">
                            <FaUserMd />
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                              {doc.speciality}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeDoctorFromRoster(doc.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Remove from roster"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Location & Department */}
                      <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Department:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.department}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Station / Room:</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">{doc.room}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Shift Timings:</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">{doc.shift}</span>
                        </p>
                        {doc.contact && (
                          <p className="flex items-center justify-between">
                            <span className="text-slate-400">Direct Contact:</span>
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{doc.contact}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duty Availability Selector */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Availability:
                      </span>

                      <select
                        value={doc.status}
                        onChange={(e) => updateDoctorStatus(doc.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border transition cursor-pointer ${
                          doc.status === "Available"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300"
                            : doc.status === "In Surgery"
                            ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-300"
                            : doc.status === "In Consultation"
                            ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-800 dark:text-amber-300"
                            : doc.status === "On Call"
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 text-blue-800 dark:text-blue-300"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-500"
                        }`}
                      >
                        <option value="Available">🟢 Available</option>
                        <option value="In Consultation">🟡 In Consultation</option>
                        <option value="In Surgery">🔴 In Surgery</option>
                        <option value="On Call">🔵 On Call</option>
                        <option value="Off Duty">⚪ Off Duty</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: BROADCAST NEW BLOOD EMERGENCY */}
      {openBloodModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FiDroplet className="text-rose-600 text-xl" />
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                  Broadcast Blood Emergency
                </h3>
              </div>
              <button
                onClick={() => setOpenBloodModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostBlood} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Blood Group Required *
                  </label>
                  <select
                    value={bloodForm.bloodGroup}
                    onChange={(e) => setBloodForm({ ...bloodForm, bloodGroup: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-black text-rose-600"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O- (Universal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={bloodForm.unitsNeeded}
                    onChange={(e) => setBloodForm({ ...bloodForm, unitsNeeded: Number(e.target.value) })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={bloodForm.urgency}
                    onChange={(e) => setBloodForm({ ...bloodForm, urgency: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Critical">Critical (Immediate OT)</option>
                    <option value="Urgent">Urgent (Within 2 Hours)</option>
                    <option value="Priority">Priority (Within 6 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Hospital Ward / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICU Bed 4, OT 2"
                    value={bloodForm.department}
                    onChange={(e) => setBloodForm({ ...bloodForm, department: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Patient Case / Token (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trauma Case #812"
                  value={bloodForm.patient}
                  onChange={(e) => setBloodForm({ ...bloodForm, patient: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Emergency Dispatch Hotline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 80 2630 4055"
                  value={bloodForm.contact}
                  onChange={(e) => setBloodForm({ ...bloodForm, contact: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Clinical Cross-Match Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Cross-match instructions, platelet requirement, etc."
                  value={bloodForm.clinicalNotes}
                  onChange={(e) => setBloodForm({ ...bloodForm, clinicalNotes: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenBloodModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Broadcast to Radar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD DOCTOR TO DUTY ROSTER */}
      {openDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FaUserMd className="text-slate-800 dark:text-white text-xl" />
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                  Add Doctor to Shift Roster
                </h3>
              </div>
              <button
                onClick={() => setOpenDoctorModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Doctor Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Sharma"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Speciality *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Critical Care, Neurosurgeon"
                    value={doctorForm.speciality}
                    onChange={(e) => setDoctorForm({ ...doctorForm, speciality: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trauma ICU, Cardiac OT"
                    value={doctorForm.department}
                    onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Station / Room *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OPD Room 204"
                    value={doctorForm.room}
                    onChange={(e) => setDoctorForm({ ...doctorForm, room: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Shift Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM - 04:00 PM"
                    value={doctorForm.shift}
                    onChange={(e) => setDoctorForm({ ...doctorForm, shift: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Initial Status
                  </label>
                  <select
                    value={doctorForm.status}
                    onChange={(e) => setDoctorForm({ ...doctorForm, status: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="In Consultation">In Consultation</option>
                    <option value="In Surgery">In Surgery</option>
                    <option value="On Call">On Call</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Direct Contact / Ext
                  </label>
                  <input
                    type="text"
                    placeholder="Ext 405 / +91 98765 00000"
                    value={doctorForm.contact}
                    onChange={(e) => setDoctorForm({ ...doctorForm, contact: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenDoctorModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Add to Shift Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalPortal;
