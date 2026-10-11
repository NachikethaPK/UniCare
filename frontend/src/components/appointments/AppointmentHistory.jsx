import { FaHistory, FaCheckCircle } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";

function AppointmentHistory() {
  const { appointments } = useAppointments();
  const history = appointments.filter((item) => ["Completed", "Cancelled"].includes(item.status));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-6 mt-8 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <FaHistory className="text-blue-600 dark:text-blue-400 text-2xl" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Appointment History</h2>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex justify-between items-center hover:border-blue-500 dark:hover:border-blue-400 transition bg-slate-50/50 dark:bg-slate-800/40"
          >
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">{item.doctor}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{item.speciality}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{item.date}</p>
            </div>

            <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${item.status === "Cancelled" ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300" : "bg-green-100 dark:bg-emerald-950/60 text-green-700 dark:text-emerald-300"}`}>
              <FaCheckCircle />
              {item.status}
            </span>
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No completed or cancelled appointments.</p>}
      </div>
    </div>
  );
}

export default AppointmentHistory;
