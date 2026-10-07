import { Link } from "react-router-dom";
import { FiDroplet, FiMapPin, FiArrowRight, FiActivity } from "react-icons/fi";
import { useBloodDonation } from "../../context/BloodDonationContext";

function BloodAlert() {
  const { requests } = useBloodDonation();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider text-xs">
            Blood Donation Dispatches
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time geospatial donor network
          </p>
        </div>

        <Link
          to="/blood"
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition"
        >
          <span>View all</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {requests.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="border border-slate-200/80 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <FiDroplet className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {item.patient}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-0.5">
                  <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.hospital}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-rose-100/70 border border-rose-200 text-rose-800 font-mono font-bold text-xs">
                {item.bloodGroup}
              </span>
              <div className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center justify-end gap-1">
                <FiActivity className="w-3 h-3" />
                <span>{item.urgency || "High Priority"}</span>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No active emergency blood requests.
          </div>
        )}
      </div>
    </div>
  );
}

export default BloodAlert;