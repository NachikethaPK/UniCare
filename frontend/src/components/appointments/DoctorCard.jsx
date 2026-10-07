import { FiUserCheck, FiStar, FiCalendar, FiPlus, FiTrash2 } from "react-icons/fi";
import { useAppointments } from "../../context/AppointmentContext";

function DoctorCard({ doctors, onBookDoctor, onAddDoctor }) {
  const { deleteCustomDoctor } = useAppointments();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 my-6">
      {/* Quick Add Doctor Card */}
      <div
        onClick={onAddDoctor}
        className="bg-slate-50 hover:bg-white border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition group min-h-[260px]"
      >
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-lg group-hover:scale-105 group-hover:border-blue-500 group-hover:text-blue-600 transition">
          <FiPlus className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 mt-4 group-hover:text-blue-600 transition">
          Add Custom Specialist
        </h3>
        <p className="text-xs text-slate-500 text-center mt-1 max-w-[200px]">
          Register a physician or clinic to schedule direct consultations.
        </p>
      </div>

      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all p-6 flex flex-col justify-between relative group"
        >
          {doctor.isCustom && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 tracking-wider">
                Custom
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomDoctor(doctor.id);
                }}
                className="text-slate-400 hover:text-rose-600 transition p-1"
                title="Remove Doctor"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FiUserCheck className="w-7 h-7" />
            </div>

            <h2 className="text-base font-bold text-center text-slate-900">
              {doctor.name}
            </h2>

            <p className="text-center text-blue-600 font-semibold text-xs mt-0.5">
              {doctor.speciality}
            </p>

            {doctor.contact && (
              <p className="text-center text-slate-400 text-[11px] mt-1 italic truncate">
                {doctor.contact}
              </p>
            )}

            <div className="flex justify-center items-center gap-1.5 mt-3 text-xs font-bold text-slate-700">
              <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{doctor.rating || 5.0}</span>
              <span className="text-slate-400 font-normal">/ 5.0</span>
            </div>

            <p className="text-center text-slate-500 text-xs font-medium mt-1">
              {doctor.experience} Experience
            </p>
          </div>

          <button
            onClick={() => onBookDoctor(doctor.name)}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-2 text-xs"
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