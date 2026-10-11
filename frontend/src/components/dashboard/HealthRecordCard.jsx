import { Link } from "react-router-dom";
import { FiFileText, FiArrowRight, FiShield, FiPlus } from "react-icons/fi";
import { useHealthRecords } from "../../context/HealthRecordContext";

function HealthRecordCard() {
  const { records } = useHealthRecords();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-200">
      {/* Segregated Field Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400">
              <FiFileText className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Encrypted Health Records Vault
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Verified laboratory panels, clinical prescriptions, and diagnostic scans
          </p>
        </div>

        <Link
          to="/records"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition p-1"
        >
          <span>Vault ({records.length})</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Records List */}
      <div className="space-y-3">
        {records.slice(0, 2).map((rec) => (
          <div
            key={rec.id}
            className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800/60 transition flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                <FiFileText className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {rec.title}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.2 rounded-full border border-blue-200 dark:border-blue-900/50">
                    {rec.category || "General"}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Issued by {rec.doctor || "Medical Center"} · {rec.date}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <Link
                to="/records"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-700 transition"
              >
                <span>View</span>
                <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-7 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">No diagnostic records stored yet.</p>
            <Link
              to="/records"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-700 shadow-2xs"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Upload Health Record</span>
            </Link>
          </div>
        )}
      </div>

      {/* Security Status Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
          <FiShield className="w-3 h-3 text-emerald-500" />
          <span>256-Bit AES Encryption · Zero-Knowledge Storage</span>
        </span>
        <Link
          to="/records"
          className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
        >
          <span>Open Vault &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default HealthRecordCard;
