import { useState } from "react";
import { useFamily } from "../../context/FamilyContext";
import {
  FiUsers,
  FiLock,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
  FiShield,
  FiPhone,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

export default function FamilyProfileSwitcher({ onOpenAddMember }) {
  const { profiles, activeProfile, switchProfile } = useFamily();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // PIN Modal State
  const [pinModalTarget, setPinModalTarget] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handleSelectProfile = (p) => {
    setDropdownOpen(false);
    if (p.id === activeProfile.id) return;

    if (p.pinEnabled && p.pin) {
      setPinModalTarget(p);
      setPinInput("");
      setPinError("");
    } else {
      switchProfile(p.id);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pinModalTarget) return;

    const res = switchProfile(pinModalTarget.id, pinInput);
    if (res.success) {
      setPinModalTarget(null);
      setPinInput("");
      setPinError("");
    } else {
      setPinError(res.message || "Incorrect PIN");
    }
  };

  return (
    <div className="relative">
      {/* Topbar Profile Switcher Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition"
        title="Switch Family Profile"
      >
        <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
          {activeProfile.name.charAt(0)}
        </div>

        <div className="text-left hidden md:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate">
              {activeProfile.name}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              ({activeProfile.relationship})
            </span>
          </div>
        </div>

        <FiChevronDown className="text-xs text-slate-400" />
      </button>

      {/* Profile Switcher Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <FiUsers className="text-blue-600 text-xs" />
              <span className="text-xs font-bold text-slate-900">Family Members</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{profiles.length} Profiles</span>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto">
            {profiles.map((p) => {
              const isActive = p.id === activeProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProfile(p)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition text-left text-xs ${
                    isActive
                      ? "bg-blue-50 text-blue-900 font-bold border border-blue-100"
                      : "hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="truncate max-w-[120px] text-xs">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.relationship}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {p.pinEnabled && (
                      <span className="text-amber-500 text-xs" title="PIN Protected">
                        <FiLock className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isActive && (
                      <span className="text-blue-600 font-bold">
                        <FiCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {onOpenAddMember && (
            <button
              onClick={() => { setDropdownOpen(false); onOpenAddMember(); }}
              className="w-full mt-2 border-t border-slate-100 pt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 py-1 rounded-lg hover:bg-blue-50/50 transition"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      )}

      {/* 4-Digit Profile PIN Verification Modal */}
      {pinModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-xl mx-auto mb-3">
              <FiLock className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Enter Profile PIN
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Profile of <strong className="text-slate-800">{pinModalTarget.name}</strong> is protected.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-32 text-center text-xl font-bold tracking-widest border border-slate-300 rounded-lg py-2.5 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              {pinError && (
                <p className="text-xs text-rose-600 font-semibold">{pinError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalTarget(null)}
                  className="w-1/2 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition"
                >
                  Unlock
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setPinModalTarget(null); setShowEmergencyModal(true); }}
                className="text-xs text-rose-600 font-semibold hover:underline flex items-center justify-center gap-1.5 mx-auto"
              >
                <FiAlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Emergency Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Quick Access Bypass Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-rose-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Emergency Family Health Data</h3>
                  <p className="text-xs text-slate-500">Critical vitals and emergency contacts.</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Family Blood Types:</p>
                <ul className="space-y-1 text-slate-700">
                  {profiles.map((p) => (
                    <li key={p.id} className="flex justify-between font-medium">
                      <span>{p.name} ({p.relationship}):</span>
                      <span className="font-bold font-mono text-rose-700">{p.bloodGroup || "O+"}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                  <FiPhone className="text-slate-500" />
                  <span>Emergency Dispatch Contacts</span>
                </p>
                <p className="text-slate-700 font-medium">National Emergency: 911 / 112</p>
                <p className="text-slate-500 mt-0.5">Primary Contact: +1 (800) 456-CARE</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
