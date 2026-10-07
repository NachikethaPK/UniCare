import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiUserCheck, FiArrowRight } from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";

function AppointmentCard() {
  const { appointments } = useAppointments();
  const upcoming = appointments.filter((a) => a.status === "Upcoming");

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider text-xs">
            Upcoming Consultations
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Verified physician schedules
          </p>
        </div>

        <Link
          to="/appointments"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
        >
          <span>View all</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Appointment List */}
      <div className="space-y-3">
        {upcoming.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="border border-slate-200/80 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FiUserCheck className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {item.doctor}
                </h3>
                <p className="text-slate-500 text-xs font-medium">
                  {item.speciality}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-600 font-medium">
                <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.date}</span>
              </div>

              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 mt-1 font-mono">
                <FiClock className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}

        {upcoming.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No upcoming consultations scheduled.
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;