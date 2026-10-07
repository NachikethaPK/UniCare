import { Link } from "react-router-dom";
import { FiHeart, FiShield, FiArrowRight, FiCheckCircle, FiPlus, FiCalendar } from "react-icons/fi";
import { usePets } from "../../context/PetContext";

function PetCard() {
  const { pets, vaccinations } = usePets();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all duration-200">
      {/* Segregated Field Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <FiHeart className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Veterinary Health & Pet Profiles
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Pet vaccination timelines, diet logs, and veterinary health records
          </p>
        </div>

        <Link
          to="/pets"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition p-1"
        >
          <span>All ({pets.length})</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Pet List */}
      <div className="space-y-3">
        {pets.slice(0, 2).map((pet) => {
          const petVaccines = vaccinations.filter((v) => v.petId === pet.id);
          const latestVaccine = petVaccines[petVaccines.length - 1];

          return (
            <div
              key={pet.id}
              className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/60 hover:bg-emerald-50/30 hover:border-emerald-200 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {pet.species === "Cat" ? "🐱" : pet.species === "Bird" ? "🦜" : "🐶"}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {pet.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                      {pet.species}
                    </span>
                  </div>
                  <p className="text-emerald-700 text-xs font-medium mt-0.5">
                    {pet.breed || "Companion Breed"} · {pet.age ? `${pet.age} yrs` : "Registered"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs">
                  <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{latestVaccine ? latestVaccine.name : "Vaccines Up-to-Date"}</span>
                </span>
                {latestVaccine?.nextDue && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-end gap-1">
                    <FiCalendar className="w-3 h-3 text-slate-400" />
                    <span>Due: {latestVaccine.nextDue}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {pets.length === 0 && (
          <div className="text-center py-7 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <p className="text-slate-500 text-xs font-medium">No companion pets added yet.</p>
            <Link
              to="/pets"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Add Pet Profile</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Shortcut */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Comprehensive animal clinic reminders & medical vault
        </span>
        <Link
          to="/pets"
          className="text-xs font-bold text-slate-800 hover:text-emerald-600 flex items-center gap-1"
        >
          <span>Manage Pets &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default PetCard;