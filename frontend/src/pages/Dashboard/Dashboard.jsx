import DashboardLayout from "../../components/layout/DashboardLayout";
import SummaryCards from "../../components/dashboard/SummaryCards";
import AppointmentCard from "../../components/dashboard/AppointmentCard";
import AIAssistant from "../../components/dashboard/AIAssistant";
import BloodAlert from "../../components/dashboard/BloodAlert";
import PetCard from "../../components/dashboard/PetCard";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { FiCheckCircle } from "react-icons/fi";

function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const name = profile?.name || user?.name || "User";

  return (
    <DashboardLayout title="Clinical Overview">
      {/* Editorial Welcome Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-semibold tracking-wide uppercase mb-2">
            <FiCheckCircle className="w-3 h-3 text-blue-600" />
            <span>Telemetry Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Your clinical profiles, scheduled appointments, emergency donor requests, and veterinary health records are synchronized in real-time.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>HIPAA Vault Synced</span>
        </div>
      </div>

      {/* Metric Cards */}
      <SummaryCards />

      {/* Grid Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="space-y-6">
          <AppointmentCard />
          <BloodAlert />
        </div>

        <div className="space-y-6">
          <AIAssistant />
          <PetCard />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;