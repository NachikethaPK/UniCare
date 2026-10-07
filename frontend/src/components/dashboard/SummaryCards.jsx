import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiCalendar,
  FiDroplet,
  FiHeart,
  FiArrowUpRight,
  FiCpu,
  FiShield,
  FiActivity,
} from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";
import { useBloodDonation } from "../../context/BloodDonationContext";
import { usePets } from "../../context/PetContext";
import { useHealthRecords } from "../../context/HealthRecordContext";

function SummaryCards() {
  const navigate = useNavigate();
  const { appointments } = useAppointments();
  const { requests, hospitalsWithStats } = useBloodDonation();
  const { pets } = usePets();
  const { records } = useHealthRecords();

  const upcomingCount = appointments.filter((a) => a.status === "Upcoming").length;
  const totalUnitsNeeded = hospitalsWithStats.reduce((acc, h) => acc + (h.totalUnitsNeeded || 0), 0);
  const petCount = pets.length;
  const healthRecordsCount = records.length;

  const cards = [
    {
      id: "records",
      title: "Clinical Health Vault",
      subtitle: "Encrypted Diagnostic Files",
      value: String(healthRecordsCount).padStart(2, "0"),
      badge: `${records.length} Documents Active`,
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      gradient: "from-blue-600 to-sky-700",
      iconBg: "bg-blue-500/10 text-blue-600 border border-blue-200/60",
      borderColor: "hover:border-blue-400",
      icon: <FiFileText className="w-5 h-5" />,
      path: "/records",
      metricDetail: "Pathology & Prescriptions",
    },
    {
      id: "appointments",
      title: "Physician Consultations",
      subtitle: "Outpatient & Specialist Visits",
      value: String(upcomingCount).padStart(2, "0"),
      badge: `${upcomingCount} Upcoming Visits`,
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      gradient: "from-indigo-600 to-violet-700",
      iconBg: "bg-indigo-500/10 text-indigo-600 border border-indigo-200/60",
      borderColor: "hover:border-indigo-400",
      icon: <FiCalendar className="w-5 h-5" />,
      path: "/appointments",
      metricDetail: "Board-Certified MDs",
    },
    {
      id: "blood",
      title: "Emergency Blood Radar",
      subtitle: "Google Maps Hospital Dispatch",
      value: String(totalUnitsNeeded || requests.length).padStart(2, "0"),
      badge: `${hospitalsWithStats.length} Hospitals on Radar`,
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse",
      gradient: "from-rose-600 to-red-700",
      iconBg: "bg-rose-500/10 text-rose-600 border border-rose-200/60",
      borderColor: "hover:border-rose-400",
      icon: <FiDroplet className="w-5 h-5" />,
      path: "/blood",
      metricDetail: "Units Urgently Needed",
    },
    {
      id: "pets",
      title: "Veterinary Vault",
      subtitle: "Pet Records & Immunizations",
      value: String(petCount).padStart(2, "0"),
      badge: `${petCount} Active Pets`,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      gradient: "from-emerald-600 to-teal-700",
      iconBg: "bg-emerald-500/10 text-emerald-600 border border-emerald-200/60",
      borderColor: "hover:border-emerald-400",
      icon: <FiHeart className="w-5 h-5" />,
      path: "/pets",
      metricDetail: "Vaccines Tracked",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => navigate(card.path)}
          className={`bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg ${card.borderColor} cursor-pointer transition-all duration-200 flex flex-col justify-between group relative overflow-hidden`}
        >
          {/* Subtle Top Accent Gradient Line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

          <div>
            <div className="flex items-center justify-between mb-3 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                {card.value}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
              <FiActivity className="w-3 h-3 text-slate-400" />
              <span>{card.metricDetail}</span>
            </span>
            <div className="inline-flex items-center gap-1 font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
              <span className="text-[11px]">Manage</span>
              <FiArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;