import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBloodDonation } from "../../context/BloodDonationContext";
import {
  FiPlusSquare,
  FiActivity,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiPhone,
  FiMapPin,
  FiShield,
  FiLogIn,
  FiUserPlus,
  FiLayers,
} from "react-icons/fi";
import { FaTint } from "react-icons/fa";

export default function HospitalPortalDesk({ onFocusMap }) {
  const { user, isHospital, login } = useAuth();
  const { requests, addHospitalRequest, updateRequestStatus, deleteRequest, hospitals } =
    useBloodDonation();

  // Form State
  const [bloodGroup, setBloodGroup] = useState("O-");
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState("Critical");
  const [department, setDepartment] = useState("Emergency ICU");
  const [patient, setPatient] = useState("");
  const [contact, setContact] = useState(user?.hospitalDetails?.emergencyContact || "+91 80 2630 4055");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Hospital's own requests
  const hospitalRequests = requests.filter(
    (r) =>
      (user?.id && r.hospitalId === user.id) ||
      (user?.name && r.hospitalName?.toLowerCase() === user.name.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const hospitalDetails = user?.hospitalDetails || {};
    const payload = {
      hospitalId: user?.id || "hosp-custom",
      hospitalName: user?.name || "Verified Hospital",
      hospitalAddress: hospitalDetails.address || "Medical District, Bangalore",
      lat: Number(hospitalDetails.lat) || 12.8932,
      lng: Number(hospitalDetails.lng) || 77.5975,
      patient: patient.trim() || "Emergency Patient",
      bloodGroup,
      unitsNeeded: Number(unitsNeeded),
      urgency,
      department,
      contact: contact.trim() || hospitalDetails.phone || "+91 80 0000 0000",
      location: hospitalDetails.city || "Bangalore",
    };

    await addHospitalRequest(payload);
    setSubmitting(false);
    setMessage(`Emergency request for ${bloodGroup} (${unitsNeeded} units) published to the Google Maps Radar!`);
    setPatient("");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDemoSignIn = async (email) => {
    await login(email, "password123");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <FiShield className="w-3.5 h-3.5" />
              <span>Hospital Blood Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Portal & Emergency Blood Dispatch
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Post real-time institutional blood shortages directly to the live Google Maps Radar. Verified donors within geographic proximity are instantly notified.
            </p>
          </div>

          {/* Hospital Account Badge or Quick Login Controls */}
          {isHospital ? (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Authorized Hospital Desk
              </span>
              <p className="text-sm font-black text-white mt-1.5">{user.name}</p>
              <p className="text-xs text-slate-300">{user.hospitalDetails?.licenseNo || "NABH Verified"}</p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                to="/login?role=hospital"
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <FiLogIn className="w-3.5 h-3.5" />
                <span>Hospital Sign In</span>
              </Link>
              <Link
                to="/signup?role=hospital"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 flex items-center gap-1.5"
              >
                <FiUserPlus className="w-3.5 h-3.5" />
                <span>Register Hospital</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* If user is not logged in as hospital, show instant gateway & demo switcher */}
        {!isHospital && (
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <FiAlertTriangle className="text-rose-600 w-4 h-4" />
                Are you a Hospital Doctor, Administrator or Blood Bank Officer?
              </h4>
              <p className="text-xs text-rose-700 mt-1">
                You can sign into an institutional account to publish real-time blood requirements directly to the public map, or test the hospital workflow right now with one click.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleDemoSignIn("apollo@hospital.unicare")}
                className="px-3 py-2 bg-white hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-300 shadow-xs transition"
              >
                ⚡ Sign in as Apollo Hospital
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("manipal@hospital.unicare")}
                className="px-3 py-2 bg-white hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-300 shadow-xs transition"
              >
                ⚡ Sign in as Manipal Hospital
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Blood Request Form (7 columns) */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiPlusSquare className="text-rose-600 w-5 h-5" />
                <span>Post Urgent Blood Request</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                Live Broadcast
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Blood Group & Units Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Blood Group Needed *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-red-600 focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  >
                    {["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Units Required *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Urgency & Department Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency Level *</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none ${
                      urgency === "Critical"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : "bg-white text-slate-800"
                    }`}
                  >
                    <option value="Critical">Critical (Immediate / ICU)</option>
                    <option value="Urgent">Urgent (Within 4 Hours)</option>
                    <option value="Normal">Routine (Scheduled Surgery)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Department / Ward *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiac OT, Trauma ICU"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Patient Case Reference & Helpline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Patient Reference / Case
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Case #8921 / Trauma"
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Emergency Desk Phone *
                  </label>
                  <input
                    type="text"
                    placeholder="+91 80 2630 4055"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Broadcast Target Hospital Indicator */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-rose-600 w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">
                      {user?.name || "Apollo Multispeciality Hospital"}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Coordinates: {user?.hospitalDetails?.lat || 12.8932},{" "}
                      {user?.hospitalDetails?.lng || 77.5975}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  GPS Ready
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <FaTint className="w-3.5 h-3.5" />
                <span>
                  {submitting
                    ? "Broadcasting to Donors..."
                    : `Publish Request (${bloodGroup} · ${unitsNeeded} Units)`}
                </span>
              </button>
            </form>
          </div>

          {/* Active Hospital Requests Manager (6 columns) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHospital
                    ? `Live Requests from ${user.name}`
                    : "Currently Broadcasted Hospital Requests"}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage statuses, mark fulfilled cases, or revoke emergency requests.
                </p>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                {isHospital ? hospitalRequests.length : requests.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {(isHospital ? hospitalRequests : requests).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                        {req.bloodGroup}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {req.patient || "Patient Need"} ({req.unitsNeeded || 1} units)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {req.hospitalName} · {req.department || "Emergency"}
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Helpline: {req.contact} · Priority:{" "}
                      <span
                        className={`font-bold ${
                          req.urgency === "Critical" ? "text-rose-600" : "text-amber-600"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </p>
                  </div>

                  {/* Status Dropdown & Delete Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <select
                      value={req.status}
                      onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                      className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border outline-none ${
                        req.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : req.status === "Accepted"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Completed">Fulfilled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => deleteRequest(req.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete request"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {!(isHospital ? hospitalRequests : requests).length && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                  No active requests found. Use the form to publish a new blood requirement.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
