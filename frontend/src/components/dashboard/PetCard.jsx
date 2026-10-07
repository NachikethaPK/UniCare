import { Link } from "react-router-dom";
import { FiHeart, FiShield, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { usePets } from "../../context/PetContext";

function PetCard() {
  const { pets, vaccinations } = usePets();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider text-xs">
            Pet Healthcare Vault
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Vaccination schedules and veterinary records
          </p>
        </div>

        <Link
          to="/pets"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
        >
          <span>View all</span>
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
              className="border border-slate-200/80 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <FiHeart className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {pet.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium">
                    {pet.species} · {pet.breed}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                  <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{latestVaccine ? latestVaccine.name : "Vaccines Current"}</span>
                </span>
                {latestVaccine?.nextDue && (
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Due: {latestVaccine.nextDue}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {pets.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No pet profiles registered yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default PetCard;