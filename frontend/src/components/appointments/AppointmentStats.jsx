import {
  FaCalendarCheck,
  FaUserMd,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";

function AppointmentStats() {
  const { appointments } = useAppointments();

  const upcomingCount = appointments.filter((a) => a.status === "Upcoming").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  const stats = [
    {
      title: "Total Booked",
      value: String(appointments.length).padStart(2, "0"),
      icon: <FaCalendarCheck />,
      color: "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Doctors",
      value: "03",
      icon: <FaUserMd />,
      color: "bg-green-100 dark:bg-emerald-950/60 text-green-600 dark:text-emerald-400",
    },
    {
      title: "Completed",
      value: String(completedCount).padStart(2, "0"),
      icon: <FaCheckCircle />,
      color: "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Upcoming",
      value: String(upcomingCount).padStart(2, "0"),
      icon: <FaClock />,
      color: "bg-orange-100 dark:bg-amber-950/60 text-orange-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {item.title}
              </p>

              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppointmentStats;