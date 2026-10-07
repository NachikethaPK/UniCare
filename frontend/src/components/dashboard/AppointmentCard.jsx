import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiUserCheck, FiArrowRight, FiPlus, FiMapPin } from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";

function AppointmentCard() {
  const { appointments } = useAppointments();
  const upcoming = appointments.filter((a) => a.status === "Upcoming");

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all duration-200">
      {/* Segregated Field Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <FiCalendar className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Physician Consultations & Outpatient Visits
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Confirmed doctor appointments & clinical follow-ups
          </p>
        </div>

        <Link
          to="/appointments"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition p-1"
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
            className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/60 hover:bg-indigo-50/30 hover:border-indigo-200 transition flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                {item.doctor.split(" ").slice(-1)[0]?.charAt(0) || "D"}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {item.doctor}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Confirmed
                  </span>
                </div>
                <p className="text-indigo-600 text-xs font-semibold mt-0.5">
                  {item.speciality}
                </p>
                {item.hospital && (
                  <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                    <FiMapPin className="w-3 h-3" />
                    <span>{item.hospital}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-700 font-bold bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{item.date}</span>
              </div>

              <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 mt-1 font-mono font-medium">
                <FiClock className="w-3 h-3 text-slate-400" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}

        {upcoming.length === 0 && (
          <div className="text-center py-7 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <p className="text-slate-500 text-xs font-medium">No upcoming consultations booked.</p>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Book Doctor Visit</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Booking CTA Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Multi-specialty hospital tele-consultation
        </span>
        <Link
          to="/appointments"
          className="text-xs font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-1"
        >
          <span>Schedule Visit &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default AppointmentCard;