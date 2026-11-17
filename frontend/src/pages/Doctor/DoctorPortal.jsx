import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDoctor } from "../../context/DoctorContext";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiPlus,
  FiSearch,
  FiCheckCircle,
  FiActivity,
  FiLogOut,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiShield,
  FiChevronRight,
  FiX,
  FiPrinter,
} from "react-icons/fi";
import { FaUserMd, FaStethoscope, FaPrescriptionBottleAlt, FaHeartbeat } from "react-icons/fa";
import ThemeToggle from "../../components/common/ThemeToggle";
import UniCareLogo from "../../components/common/UniCareLogo";

function DoctorPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    schedule,
    todayStr,
    patientHistories,
    updateAppointmentStatus,
    addWalkInAppointment,
    addPatientHistory,
    updatePatientHistory,
    deletePatientHistory,
  } = useDoctor();

  const [activeTab, setActiveTab] = useState("schedule"); // "schedule" or "history"
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [statusFilter, setStatusFilter] = useState("All");
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  // Modals
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [historyForm, setHistoryForm] = useState({
    id: null,
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    diagnosis: "",
    symptoms: "",
    clinicalNotes: "",
    prescription: "",
    bp: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6 °F",
    spo2: "99%",
    weight: "",
    followUpDate: "",
  });

  const [openWalkInModal, setOpenWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    patientName: "",
    patientEmail: "",
    date: todayStr,
    time: "11:00 AM",
    symptoms: "",
  });

  const [viewHistoryItem, setViewHistoryItem] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login?role=doctor");
  };

  // Filter schedule
  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      // Date filter
      if (selectedDate !== "ALL" && item.date !== selectedDate) {
        return false;
      }
      // Status filter
      if (statusFilter !== "All" && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (scheduleSearch.trim()) {
        const query = scheduleSearch.toLowerCase();
        const matchesName = item.patientName?.toLowerCase().includes(query);
        const matchesEmail = item.patientEmail?.toLowerCase().includes(query);
        const matchesSymptoms = item.symptoms?.toLowerCase().includes(query);
        return matchesName || matchesEmail || matchesSymptoms;
      }
      return true;
    });
  }, [schedule, selectedDate, statusFilter, scheduleSearch]);

  // Today stats
  const todayAppointments = useMemo(() => {
    return schedule.filter((item) => item.date === todayStr);
  }, [schedule, todayStr]);

  const completedToday = useMemo(() => {
    return todayAppointments.filter((item) => item.status === "Completed").length;
  }, [todayAppointments]);

  const inProgressToday = useMemo(() => {
    return todayAppointments.filter((item) => item.status === "In Consultation").length;
  }, [todayAppointments]);

  // Filter patient histories
  const filteredHistories = useMemo(() => {
    if (!historySearch.trim()) return patientHistories;
    const query = historySearch.toLowerCase();
    return patientHistories.filter((item) => {
      const matchName = item.patientName?.toLowerCase().includes(query);
      const matchEmail = item.patientEmail?.toLowerCase().includes(query);
      const matchDiag = item.diagnosis?.toLowerCase().includes(query);
      const matchSymptoms = item.symptoms?.toLowerCase().includes(query);
      return matchName || matchEmail || matchDiag || matchSymptoms;
    });
  }, [patientHistories, historySearch]);

  // Open History modal pre-filled from an appointment
  const handleOpenRecordFromAppointment = (appointment) => {
    setHistoryForm({
      id: null,
      patientName: appointment.patientName || "Patient",
      patientEmail: appointment.patientEmail || "",
      patientPhone: "",
      diagnosis: "",
      symptoms: appointment.symptoms || "",
      clinicalNotes: appointment.clinicalNotes || "",
      prescription: "",
      bp: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6 °F",
      spo2: "99%",
      weight: "",
      followUpDate: "",
    });
    setOpenHistoryModal(true);
  };

  // Submit patient history
  const handleSaveHistory = async (e) => {
    e.preventDefault();
    if (!historyForm.patientName || !historyForm.diagnosis) return;

    const payload = {
      patientName: historyForm.patientName.trim(),
      patientEmail: historyForm.patientEmail.trim(),
      patientPhone: historyForm.patientPhone.trim(),
      diagnosis: historyForm.diagnosis.trim(),
      symptoms: historyForm.symptoms.trim(),
      clinicalNotes: historyForm.clinicalNotes.trim(),
      prescription: historyForm.prescription.trim(),
      followUpDate: historyForm.followUpDate,
      vitals: {
        bp: historyForm.bp,
        heartRate: historyForm.heartRate,
        temperature: historyForm.temperature,
        spo2: historyForm.spo2,
        weight: historyForm.weight,
      },
    };

    if (historyForm.id) {
      await updatePatientHistory(historyForm.id, payload);
    } else {
      await addPatientHistory(payload);
    }

    setOpenHistoryModal(false);
  };

  // Submit walk-in
  const handleSaveWalkIn = async (e) => {
    e.preventDefault();
    if (!walkInForm.patientName) return;

    await addWalkInAppointment({
      patientName: walkInForm.patientName.trim(),
      patientEmail: walkInForm.patientEmail.trim(),
      date: walkInForm.date || todayStr,
      time: walkInForm.time || "11:00 AM",
      symptoms: walkInForm.symptoms.trim() || "Walk-in consultation",
    });

    setWalkInForm({
      patientName: "",
      patientEmail: "",
      date: todayStr,
      time: "11:00 AM",
      symptoms: "",
    });
    setOpenWalkInModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UniCareLogo size="sm" subtitle="Clinical" />
            <div className="h-5 w-px bg-slate-200 dark:border-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 uppercase tracking-wider flex items-center gap-1.5">
                <FaUserMd className="text-xs" /> Doctor Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
                <span>{user?.name || "Dr. Specialist"}</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {user?.doctorDetails?.speciality || "Consulting Physician"} • {user?.doctorDetails?.hospital || "UniCare Health"}
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

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Welcome Doctor Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
            <FaStethoscope className="w-64 h-64" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-3">
              <FiActivity /> Clinical Station • {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Doctor"}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Manage your daily consultation schedule, review real-time appointment bookings, and archive comprehensive clinical patient history.
            </p>

            {user?.doctorDetails?.registrationNumber && (
              <p className="text-white/75 text-xs mt-2 font-mono">
                Medical Reg No: <span className="font-semibold text-white">{user.doctorDetails.registrationNumber}</span>
                {user.doctorDetails.qualification && ` • ${user.doctorDetails.qualification}`}
              </p>
            )}
          </div>

          {/* Quick Action Buttons on Banner */}
          <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
            <button
              onClick={() => setOpenWalkInModal(true)}
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              <FiPlus /> Add Walk-In Patient
            </button>
            <button
              onClick={() => {
                setHistoryForm({
                  id: null,
                  patientName: "",
                  patientEmail: "",
                  patientPhone: "",
                  diagnosis: "",
                  symptoms: "",
                  clinicalNotes: "",
                  prescription: "",
                  bp: "120/80 mmHg",
                  heartRate: "72 bpm",
                  temperature: "98.6 °F",
                  spo2: "99%",
                  weight: "",
                  followUpDate: "",
                });
                setOpenHistoryModal(true);
              }}
              className="bg-emerald-950/40 hover:bg-emerald-950/60 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-[0.98] cursor-pointer"
            >
              <FiFileText /> Store New Patient History
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Today's Schedule</span>
              <FiCalendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {todayAppointments.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Consultations for {todayStr}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Today</span>
              <FiCheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
              {completedToday}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sessions marked complete</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
              <FiActivity className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
              {inProgressToday}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active consultation room</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Patient History Vault</span>
              <FaPrescriptionBottleAlt className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
              {patientHistories.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Archived clinical records</p>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "schedule"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiCalendar />
            <span>Consultation Schedule for the Day ({todayAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "history"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FiFileText />
            <span>Patient Clinical History ({patientHistories.length})</span>
          </button>
        </div>

        {/* TAB 1: CONSULTATION SCHEDULE FOR THE DAY */}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              {/* Date Quick Switcher */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDate === todayStr
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  📅 Today ({todayStr})
                </button>

                <button
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split("T")[0]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedDate !== todayStr && selectedDate !== "ALL"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  Tomorrow
                </button>

                <button
                  onClick={() => setSelectedDate("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedDate === "ALL"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  All Dates
                </button>

                <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 font-semibold">Custom:</span>
                  <input
                    type="date"
                    value={selectedDate === "ALL" ? "" : selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Status & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Consultation">In Consultation</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search patient or symptoms..."
                    value={scheduleSearch}
                    onChange={(e) => setScheduleSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-44 sm:w-56"
                  />
                </div>
              </div>
            </div>

            {/* Schedule List */}
            {filteredSchedule.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  <FiCalendar />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">No appointments scheduled</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                  {selectedDate === todayStr
                    ? "You have no more appointments scheduled for today. You can add a walk-in patient using the button above."
                    : `No bookings found for ${selectedDate}.`}
                </p>
                <button
                  onClick={() => setOpenWalkInModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <FiPlus /> Add Walk-In Patient
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-emerald-500 dark:hover:border-emerald-600 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Time Indicator */}
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                        <FiClock className="w-4 h-4 mb-0.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-extrabold">{item.time}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {item.patientName || "Confidential Patient"}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === "Completed"
                                ? "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                                : item.status === "In Consultation"
                                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 animate-pulse"
                                : item.status === "Cancelled"
                                ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300"
                                : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">📅 {item.date}</span>
                        </div>

                        {item.patientEmail && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${item.patientEmail}`} className="hover:underline text-blue-600 dark:text-blue-400">
                              {item.patientEmail}
                            </a>
                          </p>
                        )}

                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700/60 mt-1 max-w-xl">
                          <strong className="text-slate-800 dark:text-slate-200">Reason / Symptoms:</strong>{" "}
                          <span>{item.symptoms || "General health consultation and routine checkup."}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls for Doctor */}
                    <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleOpenRecordFromAppointment(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-[0.98] cursor-pointer"
                      >
                        <FaStethoscope className="text-xs" />
                        <span>Record Patient History</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {item.status !== "In Consultation" && item.status !== "Completed" && (
                          <button
                            onClick={() => updateAppointmentStatus(item.id, "In Consultation")}
                            className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Start consultation with patient"
                          >
                            Start Consultation
                          </button>
                        )}

                        {item.status !== "Completed" && (
                          <button
                            onClick={() => updateAppointmentStatus(item.id, "Completed")}
                            className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Mark as completed"
                          >
                            Mark Completed
                          </button>
                        )}

                        {item.status !== "Cancelled" && item.status !== "Completed" && (
                          <button
                            onClick={() => updateAppointmentStatus(item.id, "Cancelled")}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Cancel appointment"
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

        {/* TAB 2: PATIENT CLINICAL HISTORY ARCHIVE */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {/* Search & Actions Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search patient name, email, diagnosis, or symptoms..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => {
                  setHistoryForm({
                    id: null,
                    patientName: "",
                    patientEmail: "",
                    patientPhone: "",
                    diagnosis: "",
                    symptoms: "",
                    clinicalNotes: "",
                    prescription: "",
                    bp: "120/80 mmHg",
                    heartRate: "72 bpm",
                    temperature: "98.6 °F",
                    spo2: "99%",
                    weight: "",
                    followUpDate: "",
                  });
                  setOpenHistoryModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Patient Record</span>
              </button>
            </div>

            {/* Patient History Cards */}
            {filteredHistories.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-xl">
                  <FiFileText />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">No patient history records found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                  {historySearch ? "No matches for your search query." : "You haven't stored any clinical records yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistories.map((hist) => (
                  <div
                    key={hist.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500 dark:hover:border-emerald-600 transition shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {hist.patientName}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              📅 {hist.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {hist.patientEmail && (
                              <span className="flex items-center gap-1">
                                <FiMail className="w-3 h-3 text-slate-400" />
                                {hist.patientEmail}
                              </span>
                            )}
                            {hist.patientPhone && (
                              <span className="flex items-center gap-1">
                                <FiPhone className="w-3 h-3 text-slate-400" />
                                {hist.patientPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewHistoryItem(hist)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="View Full Clinical Summary"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setHistoryForm({
                                id: hist.id,
                                patientName: hist.patientName || "",
                                patientEmail: hist.patientEmail || "",
                                patientPhone: hist.patientPhone || "",
                                diagnosis: hist.diagnosis || "",
                                symptoms: hist.symptoms || "",
                                clinicalNotes: hist.clinicalNotes || "",
                                prescription: hist.prescription || "",
                                bp: hist.vitals?.bp || "",
                                heartRate: hist.vitals?.heartRate || "",
                                temperature: hist.vitals?.temperature || "",
                                spo2: hist.vitals?.spo2 || "",
                                weight: hist.vitals?.weight || "",
                                followUpDate: hist.followUpDate || "",
                              });
                              setOpenHistoryModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Edit Record"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePatientHistory(hist.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Primary Diagnosis */}
                      <div className="mt-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-0.5">
                          Clinical Diagnosis
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200">
                          {hist.diagnosis}
                        </p>
                      </div>

                      {/* Symptoms & Notes */}
                      {hist.clinicalNotes && (
                        <div className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                          <strong className="text-slate-800 dark:text-slate-200 block mb-1">Doctor's Observation:</strong>
                          {hist.clinicalNotes}
                        </div>
                      )}

                      {/* Prescriptions */}
                      {hist.prescription && (
                        <div className="mt-2.5 text-xs bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3 rounded-xl">
                          <strong className="text-blue-900 dark:text-blue-300 flex items-center gap-1 mb-1">
                            <FaPrescriptionBottleAlt className="text-xs text-blue-600" /> Prescribed Medications:
                          </strong>
                          <pre className="font-sans whitespace-pre-wrap text-[11px] text-blue-950 dark:text-blue-200">
                            {hist.prescription}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Vitals Footer */}
                    {hist.vitals && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        {hist.vitals.bp && (
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                            BP: <strong className="text-slate-700 dark:text-slate-300">{hist.vitals.bp}</strong>
                          </span>
                        )}
                        {hist.vitals.heartRate && (
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                            HR: <strong className="text-slate-700 dark:text-slate-300">{hist.vitals.heartRate}</strong>
                          </span>
                        )}
                        {hist.vitals.spo2 && (
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                            SpO2: <strong className="text-slate-700 dark:text-slate-300">{hist.vitals.spo2}</strong>
                          </span>
                        )}
                        {hist.followUpDate && (
                          <span className="ml-auto text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                            Next Review: {hist.followUpDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: ADD / EDIT PATIENT CLINICAL HISTORY */}
      {openHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FaStethoscope className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-white">
                    {historyForm.id ? "Edit Patient Clinical Record" : "Store Patient Clinical History"}
                  </h3>
                  <p className="text-slate-400 text-xs">Record consultation diagnosis, prescriptions, and observations</p>
                </div>
              </div>
              <button
                onClick={() => setOpenHistoryModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHistory} className="space-y-4">
              {/* Patient Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chandrika Sharma"
                    value={historyForm.patientName}
                    onChange={(e) => setHistoryForm({ ...historyForm, patientName: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Patient Registered Email
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={historyForm.patientEmail}
                    onChange={(e) => setHistoryForm({ ...historyForm, patientEmail: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Diagnosis & Symptoms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Primary Medical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage 1 Essential Hypertension, Sinus Tachycardia"
                  value={historyForm.diagnosis}
                  onChange={(e) => setHistoryForm({ ...historyForm, diagnosis: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Symptoms & Chief Complaints
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exertional dyspnea, intermittent palpitations, BP 142/92"
                  value={historyForm.symptoms}
                  onChange={(e) => setHistoryForm({ ...historyForm, symptoms: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Clinical Notes & Observations */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Doctor's Clinical Notes & Lab Orders
                </label>
                <textarea
                  rows="3"
                  placeholder="Clinical observations, lab tests ordered, lifestyle advice, diet regimen..."
                  value={historyForm.clinicalNotes}
                  onChange={(e) => setHistoryForm({ ...historyForm, clinicalNotes: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Prescription */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                  <FaPrescriptionBottleAlt className="text-emerald-600" /> Prescribed Drugs & Dosage Protocol
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Amlodipine 5mg OD (morning) x 30 days&#10;Telmisartan 20mg OD (night) x 30 days"
                  value={historyForm.prescription}
                  onChange={(e) => setHistoryForm({ ...historyForm, prescription: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Vitals Grid */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
                  <FaHeartbeat className="text-rose-500" /> Patient Vital Signs
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold">BP (mmHg)</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={historyForm.bp}
                      onChange={(e) => setHistoryForm({ ...historyForm, bp: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold">Heart Rate</label>
                    <input
                      type="text"
                      placeholder="72 bpm"
                      value={historyForm.heartRate}
                      onChange={(e) => setHistoryForm({ ...historyForm, heartRate: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold">SpO2</label>
                    <input
                      type="text"
                      placeholder="99%"
                      value={historyForm.spo2}
                      onChange={(e) => setHistoryForm({ ...historyForm, spo2: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold">Temp</label>
                    <input
                      type="text"
                      placeholder="98.6 °F"
                      value={historyForm.temperature}
                      onChange={(e) => setHistoryForm({ ...historyForm, temperature: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold">Weight</label>
                    <input
                      type="text"
                      placeholder="65 kg"
                      value={historyForm.weight}
                      onChange={(e) => setHistoryForm({ ...historyForm, weight: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Next Follow-up Consultation Date
                </label>
                <input
                  type="date"
                  value={historyForm.followUpDate}
                  onChange={(e) => setHistoryForm({ ...historyForm, followUpDate: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenHistoryModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Save Record to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD WALK-IN PATIENT TO TODAY'S SCHEDULE */}
      {openWalkInModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">
              Add Walk-In / Schedule Patient
            </h3>
            <p className="text-slate-400 text-xs mb-5">Insert an immediate or direct consultation into your daily schedule</p>

            <form onSubmit={handleSaveWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={walkInForm.patientName}
                  onChange={(e) => setWalkInForm({ ...walkInForm, patientName: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Patient Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={walkInForm.patientEmail}
                  onChange={(e) => setWalkInForm({ ...walkInForm, patientEmail: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={walkInForm.date}
                    onChange={(e) => setWalkInForm({ ...walkInForm, date: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 11:30 AM"
                    value={walkInForm.time}
                    onChange={(e) => setWalkInForm({ ...walkInForm, time: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Symptoms / Reason for Visit
                </label>
                <textarea
                  rows="2"
                  placeholder="Primary complaints or clinical observations..."
                  value={walkInForm.symptoms}
                  onChange={(e) => setWalkInForm({ ...walkInForm, symptoms: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenWalkInModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Insert into Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW / PRINT CLINICAL SUMMARY */}
      {viewHistoryItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FaStethoscope className="text-emerald-600 text-lg" />
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                  Clinical Consultation Summary
                </h3>
              </div>
              <button
                onClick={() => setViewHistoryItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1">
                <p><strong>Patient Name:</strong> {viewHistoryItem.patientName}</p>
                {viewHistoryItem.patientEmail && <p><strong>Email:</strong> {viewHistoryItem.patientEmail}</p>}
                <p><strong>Attending Physician:</strong> {viewHistoryItem.doctor} ({viewHistoryItem.speciality})</p>
                <p><strong>Date & Time:</strong> {viewHistoryItem.date} {viewHistoryItem.time && `at ${viewHistoryItem.time}`}</p>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <strong className="text-emerald-900 dark:text-emerald-300 block mb-1">Clinical Diagnosis:</strong>
                <p className="text-emerald-950 dark:text-emerald-100 font-bold">{viewHistoryItem.diagnosis}</p>
              </div>

              {viewHistoryItem.symptoms && (
                <div>
                  <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">Symptoms:</strong>
                  <p className="text-slate-600 dark:text-slate-400">{viewHistoryItem.symptoms}</p>
                </div>
              )}

              {viewHistoryItem.clinicalNotes && (
                <div>
                  <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">Clinical Observations & Advice:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{viewHistoryItem.clinicalNotes}</p>
                </div>
              )}

              {viewHistoryItem.prescription && (
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <strong className="text-blue-900 dark:text-blue-300 block mb-1">Prescription:</strong>
                  <pre className="font-mono text-xs whitespace-pre-wrap text-blue-950 dark:text-blue-200">
                    {viewHistoryItem.prescription}
                  </pre>
                </div>
              )}

              {viewHistoryItem.vitals && (
                <div className="flex flex-wrap gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                  {viewHistoryItem.vitals.bp && <span>BP: <strong>{viewHistoryItem.vitals.bp}</strong></span>}
                  {viewHistoryItem.vitals.heartRate && <span>HR: <strong>{viewHistoryItem.vitals.heartRate}</strong></span>}
                  {viewHistoryItem.vitals.spo2 && <span>SpO2: <strong>{viewHistoryItem.vitals.spo2}</strong></span>}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <FiPrinter /> Print Clinical Summary
              </button>
              <button
                onClick={() => setViewHistoryItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorPortal;
