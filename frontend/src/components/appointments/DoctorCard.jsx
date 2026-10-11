import { FiUserCheck, FiStar, FiCalendar, FiPlus, FiTrash2 } from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";

function DoctorCard({ doctors, onBookDoctor, onAddDoctor }) {
  const { deleteCustomDoctor } = useAppointments();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 my-6">
      {/* Quick Add Doctor Card */}
      <div
        onClick={onAddDoctor}
        className="bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition group min-h-[260px]"
      >
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-lg group-hover:scale-105 group-hover:border-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          <FiPlus className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          Add Custom Specialist
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1 max-w-[200px]">
          Register a physician or clinic to schedule direct consultations.
        </p>
      </div>

      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all p-6 flex flex-col justify-between relative group"
        >
          {doctor.isCustom && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tracking-wider">
                Custom
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomDoctor(doctor.id);
                }}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-1 cursor-pointer"
                title="Remove Doctor"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <FiUserCheck className="w-7 h-7" />
            </div>

            <h2 className="text-base font-bold text-center text-slate-900 dark:text-white">
              {doctor.name}
            </h2>

            <p className="text-center text-blue-600 dark:text-blue-400 font-semibold text-xs mt-0.5">
              {doctor.speciality}
            </p>

            {doctor.contact && (
              <p className="text-center text-slate-400 dark:text-slate-500 text-[11px] mt-1 italic truncate">
                {doctor.contact}
              </p>
            )}

            <div className="flex justify-center items-center gap-1.5 mt-3 text-xs font-bold text-slate-700 dark:text-slate-200">
              <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{doctor.rating || 5.0}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">/ 5.0</span>
            </div>

            <p className="text-center text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
              {doctor.experience} Experience
            </p>
          </div>

          <button
            onClick={() => onBookDoctor(doctor.name)}
            className="w-full mt-6 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <FiCalendar className="w-3.5 h-3.5" />
            <span>Book Consultation</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default DoctorCard;