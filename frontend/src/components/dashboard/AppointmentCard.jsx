import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiArrowRight, FiPlus, FiMapPin } from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";

function AppointmentCard() {
  const { appointments } = useAppointments();
  const upcoming = appointments.filter((a) => a.status === "Upcoming");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200">
      {/* Segregated Field Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400">
              <FiCalendar className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Physician Consultations & Outpatient Visits
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Confirmed doctor appointments & clinical follow-ups
          </p>
        </div>

        <Link
          to="/appointments"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition p-1"
        >
          <span>All ({appointments.length})</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Appointment List */}
      <div className="space-y-3">
        {upcoming.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 hover:border-indigo-200 dark:hover:border-indigo-800/60 transition flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                {item.doctor.split(" ").slice(-1)[0]?.charAt(0) || "D"}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.doctor}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-900/50">
                    Confirmed
                  </span>
                </div>
                <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mt-0.5">
                  {item.speciality}
                </p>
                {item.hospital && (
                  <p className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <FiMapPin className="w-3 h-3" />
                    <span>{item.hospital}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-bold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <FiCalendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{item.date}</span>
              </div>

              <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono font-medium">
                <FiClock className="w-3 h-3 text-slate-400" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}

        {upcoming.length === 0 && (
          <div className="text-center py-7 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">No upcoming consultations booked.</p>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-2xs"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Book Doctor Visit</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Booking CTA Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Multi-specialty hospital tele-consultation
        </span>
        <Link
          to="/appointments"
          className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
        >
          <span>Schedule Visit &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default AppointmentCard;