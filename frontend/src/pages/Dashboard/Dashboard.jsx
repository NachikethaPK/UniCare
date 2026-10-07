import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SummaryCards from "../../components/dashboard/SummaryCards";
import AppointmentCard from "../../components/dashboard/AppointmentCard";
import AIAssistant from "../../components/dashboard/AIAssistant";
import BloodAlert from "../../components/dashboard/BloodAlert";
import PetCard from "../../components/dashboard/PetCard";
import HealthRecordCard from "../../components/dashboard/HealthRecordCard";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useFamily } from "../../context/FamilyContext";
import {
  FiCheckCircle,
  FiPlus,
  FiCalendar,
  FiDroplet,
  FiHeart,
  FiFileText,
  FiCpu,
  FiShield,
  FiActivity,
  FiLayers,
  FiUser,
  FiCompass,
} from "react-icons/fi";
import { FaTint, FaHospital } from "react-icons/fa";

function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { activeProfile } = useFamily();
  const navigate = useNavigate();

  // Segregated Feature View Filter
  const [activeFilter, setActiveFilter] = useState("all");

  const displayName = activeProfile?.name || profile?.name || user?.name || "Patient";

  // Dynamic Time Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <DashboardLayout title="Clinical Operations Hub">
      {/* Dynamic Command Center Welcome Hub */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background rings */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 -mb-12 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time Telemetry Live</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-semibold">
                  <FiUser className="w-3.5 h-3.5 text-blue-400" />
                  <span>Profile: {displayName}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {greeting}, {displayName}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Your unified health records, active emergency blood shortage radars, specialist consultations, and veterinary vault timelines are synchronized.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <FiShield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">HIPAA & NABH Ready</p>
                <p className="text-[11px] text-slate-400">256-Bit Encrypted Vault</p>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Dock */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Quick Actions:
            </span>

            <Link
              to="/blood"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <FaTint className="w-3 h-3" />
              <span>Google Maps Blood Radar</span>
            </Link>

            <Link
              to="/appointments"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Book Doctor Visit</span>
            </Link>

            <Link
              to="/pets"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <FiHeart className="w-3.5 h-3.5" />
              <span>Pet Health Vault</span>
            </Link>

            <Link
              to="/records"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <FiFileText className="w-3.5 h-3.5" />
              <span>Upload Health Record</span>
            </Link>

            <Link
              to="/ai"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <FiCpu className="w-3.5 h-3.5" />
              <span>AI Triage Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Pillar Segregation Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: "all", label: "🌟 Unified Overview (All)", icon: <FiLayers /> },
            { id: "blood", label: "🩸 Emergency Blood Radar", icon: <FaTint /> },
            { id: "clinical", label: "🩺 Doctor Consultations", icon: <FiCalendar /> },
            { id: "pets", label: "🐾 Veterinary Care", icon: <FiHeart /> },
            { id: "records", label: "📁 Health Records", icon: <FiFileText /> },
            { id: "ai", label: "🤖 AI Clinical Intelligence", icon: <FiCpu /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing: <strong className="text-slate-700 capitalize">{activeFilter === "all" ? "All Segregated Fields" : activeFilter}</strong>
        </span>
      </div>

      {/* Telemetry Metric Cards */}
      <SummaryCards />

      {/* Segregated Layout Grid */}
      <div className="space-y-6">
        {/* Clinical Consultations & Health Records Zone */}
        {(activeFilter === "all" || activeFilter === "clinical" || activeFilter === "records") && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                  Clinical Care & Diagnostic Vault
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">Patient Centered Care</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(activeFilter === "all" || activeFilter === "clinical") && <AppointmentCard />}
              {(activeFilter === "all" || activeFilter === "records") && <HealthRecordCard />}
            </div>
          </div>
        )}

        {/* Emergency Blood Radar & Veterinary Care Zone */}
        {(activeFilter === "all" || activeFilter === "blood" || activeFilter === "pets") && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                  Emergency Dispatch & Companion Health
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">Geospatial Networks</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(activeFilter === "all" || activeFilter === "blood") && <BloodAlert />}
              {(activeFilter === "all" || activeFilter === "pets") && <PetCard />}
            </div>
          </div>
        )}

        {/* AI Clinical Assistant Intelligence Zone */}
        {(activeFilter === "all" || activeFilter === "ai") && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                  Artificial Intelligence Health Terminal
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">Instant Clinical Triage</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AIAssistant />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;