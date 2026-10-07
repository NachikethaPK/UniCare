import { useState } from "react";
import { FaCalendarAlt, FaClock, FaEdit, FaTimes, FaUserMd, FaBell, FaBellSlash } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";

function UpcomingAppointments() {
  const { appointments, cancelAppointment, updateAppointment } = useAppointments();
  const [editing, setEditing] = useState(null);
  const upcoming = appointments.filter((item) => item.status === "Upcoming");
  
  const save = (event) => {
    event.preventDefault();
    updateAppointment(editing.id, editing);
    setEditing(null);
  };

  const toggleReminderQuick = (item) => {
    const updated = {
      ...item,
      reminderEnabled: !item.reminderEnabled,
      reminderTime: item.reminderTime || "1 hour before",
    };
    updateAppointment(item.id, updated);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 md:p-6 mt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Upcoming Appointments
      </h2>

      <div className="space-y-4">
        {upcoming.length === 0 && <p className="text-slate-500 text-sm">No upcoming appointments.</p>}
        {upcoming.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-2xl p-4 md:p-5 hover:border-blue-400 transition bg-white"
          >
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">

              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0 mt-1">
                    <FaUserMd />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {item.doctor}
                    </h3>

                    <p className="text-blue-600 text-xs font-semibold">
                      {item.speciality}
                    </p>

                    {item.symptoms && (
                      <p className="text-slate-500 text-xs mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-md">
                        {item.symptoms}
                      </p>
                    )}

                    {/* Reminder Status Badge */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => toggleReminderQuick(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          item.reminderEnabled
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title="Click to toggle reminder"
                      >
                        {item.reminderEnabled ? (
                          <>
                            <FaBell className="text-amber-500 text-xs animate-bounce" />
                            <span>Reminder: {item.reminderTime || "Set"}</span>
                          </>
                        ) : (
                          <>
                            <FaBellSlash className="text-slate-400 text-xs" />
                            <span>Reminder Off</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:text-right text-sm text-slate-600 flex flex-col md:items-end justify-between">

                <div className="space-y-1">
                  <div className="flex items-center gap-2 md:justify-end font-medium text-slate-700">
                    <FaCalendarAlt className="text-blue-500" />
                    {item.date}
                  </div>

                  <div className="flex items-center gap-2 md:justify-end text-slate-500 text-xs">
                    <FaClock className="text-blue-500" />
                    {item.time}
                  </div>

                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-100 text-blue-700 tracking-wider">
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex gap-2 md:justify-end">
                  <button
                    onClick={() => setEditing(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => cancelAppointment(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form onSubmit={save} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Edit Appointment</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor</label>
              <input
                className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                value={editing.doctor}
                onChange={(e) => setEditing({ ...editing, doctor: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Speciality</label>
              <input
                className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                value={editing.speciality}
                onChange={(e) => setEditing({ ...editing, speciality: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                <input
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                <input
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                  type="time"
                  value={editing.time}
                  onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Reminder Config */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label htmlFor="editReminderEnabled" className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase cursor-pointer">
                <FaBell className="text-amber-500" /> Enable Reminder
                <input
                  id="editReminderEnabled"
                  type="checkbox"
                  checked={editing.reminderEnabled || false}
                  onChange={(e) => setEditing({ ...editing, reminderEnabled: e.target.checked })}
                  className="ml-auto w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </label>

              {editing.reminderEnabled && (
                <select
                  value={editing.reminderTime || "1 hour before"}
                  onChange={(e) => setEditing({ ...editing, reminderTime: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white"
                >
                  <option value="15 minutes before">15 minutes before</option>
                  <option value="30 minutes before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="2 hours before">2 hours before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="Day of appointment (08:00 AM)">Day of appointment (08:00 AM)</option>
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default UpcomingAppointments;
