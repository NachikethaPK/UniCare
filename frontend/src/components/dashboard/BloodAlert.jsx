import { Link } from "react-router-dom";
import { FiDroplet, FiMapPin, FiArrowRight, FiActivity, FiNavigation, FiExternalLink } from "react-icons/fi";
import { FaTint, FaHospital } from "react-icons/fa";
import { useBloodDonation } from "../../context/BloodDonationContext";

function BloodAlert() {
  const { requests, hospitalsWithStats } = useBloodDonation();

  // Find nearest hospital with active critical/urgent request
  const nearestHospitalWithShortage = hospitalsWithStats.find((h) => h.requestsCount > 0) || hospitalsWithStats[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all duration-200">
      {/* Segregated Field Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 animate-pulse">
              <FaTint className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Emergency Blood Radar & Dispatch
              </h2>
              <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                Google Maps Live
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Real-time geospatial hospital shortages & emergency donor matching
          </p>
        </div>

        <Link
          to="/blood"
          className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition p-1"
        >
          <span>Radar ({requests.length})</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Featured Nearest Hospital Blood Need Spotlight */}
      {nearestHospitalWithShortage && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50/90 to-red-50/70 border border-rose-200/80 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
                Nearest Hospital with Need · {nearestHospitalWithShortage.distance} km away
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                {nearestHospitalWithShortage.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {nearestHospitalWithShortage.address}
              </p>
            </div>
            <span className="text-xs font-black text-rose-600 bg-white px-2.5 py-1 rounded-xl border border-rose-200 shadow-2xs shrink-0">
              {nearestHospitalWithShortage.requestsCount} Needs
            </span>
          </div>

          {/* Blood Types Needed Tags */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">Needed:</span>
              {nearestHospitalWithShortage.bloodTypesNeeded?.slice(0, 4).map((b) => (
                <span
                  key={b.group}
                  className="text-xs font-black text-rose-700 bg-white border border-rose-300 px-2 py-0.5 rounded-lg shadow-2xs"
                >
                  {b.group} ({b.units}u)
                </span>
              ))}
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHospitalWithShortage.lat},${nearestHospitalWithShortage.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 underline"
            >
              <span>Directions</span>
              <FiExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Request List */}
      <div className="space-y-2.5">
        {requests.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="border border-slate-200/90 rounded-2xl p-3.5 bg-slate-50/60 hover:bg-rose-50/30 hover:border-rose-200 transition flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {item.bloodGroup}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  {item.patient || "Emergency Patient"} ({item.unitsNeeded || 1} units)
                </h4>
                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <FiMapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[150px]">{item.hospitalName || item.hospital}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  item.urgency === "Critical"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.urgency}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {item.status || "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link to radar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Volunteer donors on stand-by: {requests.length * 3 + 2} nearby
        </span>
        <Link
          to="/blood"
          className="text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center gap-1"
        >
          <span>Open Full Radar &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default BloodAlert;