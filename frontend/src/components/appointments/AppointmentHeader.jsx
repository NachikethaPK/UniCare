import { FaPlus, FaUserPlus } from "react-icons/fa";

function AppointmentHeader({ onBook, onAddDoctor }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
          Appointments
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
          Schedule appointments, manage doctors, and set reminders
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onAddDoctor}
          className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold px-4 py-3 rounded-xl flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 shadow-sm transition text-sm sm:text-base cursor-pointer"
        >
          <FaUserPlus />
          Add Doctor
        </button>

        <button
          onClick={onBook}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition text-sm sm:text-base cursor-pointer"
        >
          <FaPlus />
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default AppointmentHeader;