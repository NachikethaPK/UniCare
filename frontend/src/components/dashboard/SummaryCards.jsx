import { useNavigate } from "react-router-dom";
import { FiFileText, FiCalendar, FiDroplet, FiHeart, FiArrowUpRight } from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";
import { useBloodDonation } from "../../context/BloodDonationContext";
import { usePets } from "../../context/PetContext";
import { useHealthRecords } from "../../context/HealthRecordContext";

function SummaryCards() {
  const navigate = useNavigate();
  const { appointments } = useAppointments();
  const { requests } = useBloodDonation();
  const { pets } = usePets();
  const { records } = useHealthRecords();

  const upcomingCount = appointments.filter((a) => a.status === "Upcoming").length;
  const urgentRequestsCount = requests.filter((r) => r.urgency === "Urgent" || r.status === "Pending").length;
  const petCount = pets.length;
  const healthRecordsCount = records.length;

  const cards = [
    {
      title: "Health Records",
      value: String(healthRecordsCount).padStart(2, "0"),
      change: `${records.length} Documents Verified`,
      icon: <FiFileText className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border-blue-100",
      path: "/records",
    },
    {
      title: "Upcoming Visits",
      value: String(upcomingCount).padStart(2, "0"),
      change: `${upcomingCount} Consultations`,
      icon: <FiCalendar className="w-5 h-5 text-indigo-600" />,
      iconBg: "bg-indigo-50 border-indigo-100",
      path: "/appointments",
    },
    {
      title: "Blood Requests",
      value: String(requests.length).padStart(2, "0"),
      change: `${urgentRequestsCount} Active Dispatches`,
      icon: <FiDroplet className="w-5 h-5 text-rose-600" />,
      iconBg: "bg-rose-50 border-rose-100",
      path: "/blood",
    },
    {
      title: "Pet Healthcare",
      value: String(petCount).padStart(2, "0"),
      change: `${petCount} Active Profiles`,
      icon: <FiHeart className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      path: "/pets",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => navigate(card.path)}
          className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-150 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {card.title}
            </span>
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {card.value}
              </span>
              <FiArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1">
              {card.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;