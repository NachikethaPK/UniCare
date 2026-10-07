import { FaPlus, FaUserPlus } from "react-icons/fa";

function AppointmentHeader({ onBook, onAddDoctor }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
          Appointments
        </h1>

        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Schedule appointments, manage doctors, and set reminders
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onAddDoctor}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4 py-3 rounded-xl flex items-center gap-2 border border-emerald-200 shadow-sm transition text-sm sm:text-base"
        >
          <FaUserPlus />
          Add Doctor
        </button>

        <button
          onClick={onBook}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition text-sm sm:text-base"
        >
          <FaPlus />
          Book Appointment
        </button>
      </div>

    </div>
  );
}

export default AppointmentHeader;