import { useState, useMemo } from "react";
import {
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiAlertCircle,
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiExternalLink,
  FiClock,
  FiHeart,
  FiShield,
} from "react-icons/fi";
import { FaTint } from "react-icons/fa";

export default function HospitalMapRadar({
  hospitals = [],
  userLocation,
  onLocateUser,
  onSelectHospital,
  selectedHospitalId,
  selectedBloodGroup,
  onSelectBloodGroup,
}) {
  const [maxRadius, setMaxRadius] = useState("all"); // "5", "10", "25", "50", "all"
  const [viewMode, setViewMode] = useState("google"); // "google" or "radar"
  const [searchQuery, setSearchQuery] = useState("");
  const [donationModalHospital, setDonationModalHospital] = useState(null);
  const [donationSuccess, setDonationSuccess] = useState("");

  // Filter hospitals based on search, radius, and blood group
  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter((h) => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesName = h.name.toLowerCase().includes(q);
          const matchesAddr = h.address.toLowerCase().includes(q);
          if (!matchesName && !matchesAddr) return false;
        }

        // Distance radius
        if (maxRadius !== "all") {
          const limit = parseFloat(maxRadius);
          if (h.distance > limit) return false;
        }

        // Blood group filter
        if (selectedBloodGroup) {
          const hasGroup = h.bloodTypesNeeded?.some((b) => b.group === selectedBloodGroup);
          if (!hasGroup) return false;
        }

        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [hospitals, searchQuery, maxRadius, selectedBloodGroup]);

  // Currently focused hospital (defaults to first filtered or selected)
  const activeHospital = useMemo(() => {
    if (selectedHospitalId) {
      return hospitals.find((h) => h.id === selectedHospitalId) || filteredHospitals[0];
    }
    return filteredHospitals[0] || hospitals[0];
  }, [selectedHospitalId, hospitals, filteredHospitals]);

  // Construct Google Maps Embed URL
  const googleMapsEmbedUrl = useMemo(() => {
    if (activeHospital && activeHospital.lat && activeHospital.lng) {
      // Direct marker on the active hospital
      return `https://maps.google.com/maps?q=${activeHospital.lat},${activeHospital.lng}&z=14&hl=en&output=embed`;
    }
    if (userLocation && userLocation.lat && userLocation.lng) {
      return `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=13&hl=en&output=embed`;
    }
    return "https://maps.google.com/maps?q=12.9716,77.5946&z=13&hl=en&output=embed";
  }, [activeHospital, userLocation]);

  // Radar Map calculations: convert lat/lng differences to 2D SVG canvas percentages
  const radarPins = useMemo(() => {
    const centerLat = userLocation?.lat || 12.9716;
    const centerLng = userLocation?.lng || 77.5946;
    // Scale factor: roughly 0.15 degrees ~ 16 km
    const latSpan = 0.25;
    const lngSpan = 0.25;

    return filteredHospitals.map((hosp) => {
      const dLat = hosp.lat - centerLat;
      const dLng = hosp.lng - centerLng;
      // Invert Y because latitude increases upwards but SVG Y increases downwards
      const xPercent = Math.min(Math.max(50 + (dLng / lngSpan) * 45, 8), 92);
      const yPercent = Math.min(Math.max(50 - (dLat / latSpan) * 45, 8), 92);

      return {
        ...hosp,
        x: xPercent,
        y: yPercent,
      };
    });
  }, [filteredHospitals, userLocation]);

  const handleRespondToDonate = (hosp) => {
    setDonationModalHospital(hosp);
    setDonationSuccess("");
  };

  const confirmDonationInterest = () => {
    setDonationSuccess(
      `Hospital notified! The blood bank team at ${donationModalHospital.name} has received your contact availability.`
    );
    setTimeout(() => {
      setDonationModalHospital(null);
      setDonationSuccess("");
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                <FiCompass className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Live Google Maps Hospital Radar
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Locate nearby verified hospitals, view real-time blood shortages, and find matching urgent blood requests.
            </p>
          </div>

          {/* Quick Action: Locate Me & Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onLocateUser}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition active:scale-95"
              title="Detect live GPS location"
            >
              <FiNavigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userLocation?.isDetected ? "GPS Active (Near You)" : "Locate My Position"}</span>
            </button>

            {/* View Mode Toggle: Google Maps vs Radar Canvas */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => setViewMode("google")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === "google"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🗺️ Google Map</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("radar")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === "radar"
                    ? "bg-white text-red-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📡 Tactical Radar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          {/* Hospital Search */}
          <div className="lg:col-span-5 relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search hospital by name, area or road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Radius Selector */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Radius:</label>
            <select
              value={maxRadius}
              onChange={(e) => setMaxRadius(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
            >
              <option value="all">Any Distance ({hospitals.length} hospitals)</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Blood Group:</label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => onSelectBloodGroup(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
            >
              <option value="">All Blood Types Needed</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((grp) => (
                <option key={grp} value={grp}>
                  {grp} Only
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Blood Group Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Select:</span>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((grp) => {
            const isSelected = selectedBloodGroup === grp;
            return (
              <button
                key={grp}
                type="button"
                onClick={() => onSelectBloodGroup(isSelected ? "" : grp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {grp}
              </button>
            );
          })}
          {selectedBloodGroup && (
            <button
              type="button"
              onClick={() => onSelectBloodGroup("")}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Main Map View & Hospital Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map Canvas or Google Maps Embed */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {viewMode === "google" ? "Live Google Maps View" : "Geographic Radar Scanner"}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Centered on: <strong className="text-white">{activeHospital?.name || "Center"}</strong>
            </div>
          </div>

          <div className="relative w-full h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden">
            {viewMode === "google" ? (
              /* Google Maps Embed */
              <div className="w-full h-full relative">
                <iframe
                  title="Google Maps Hospital Radar"
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[15%] contrast-[105%]"
                />

                {/* Floating Quick Action Overlay on Map */}
                {activeHospital && (
                  <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-200 text-slate-900 pointer-events-auto">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                          Selected Hospital Pin
                        </span>
                        <h4 className="font-extrabold text-xs sm:text-sm mt-1 leading-tight text-slate-900">
                          {activeHospital.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{activeHospital.address}</p>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl shrink-0">
                        {activeHospital.distance} km
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-bold text-red-600">
                        {activeHospital.requestsCount} Blood Request{activeHospital.requestsCount === 1 ? "" : "s"} Active
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.lat},${activeHospital.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                      >
                        <span>Directions</span>
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tactical SVG Radar Canvas */
              <div className="w-full h-full relative select-none">
                {/* Radar Grid Circles */}
                <svg className="w-full h-full absolute inset-0 text-slate-800 pointer-events-none">
                  {/* Concentric distance rings */}
                  <circle cx="50%" cy="50%" r="15%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50%" cy="50%" r="30%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="1" />
                  {/* Crosshairs */}
                  <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" />
                  <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
                  {/* Compass Labels */}
                  <text x="51%" y="5%" fill="#64748b" fontSize="10" fontWeight="bold">NORTH</text>
                  <text x="92%" y="52%" fill="#64748b" fontSize="10" fontWeight="bold">EAST</text>
                  <text x="51%" y="97%" fill="#64748b" fontSize="10" fontWeight="bold">SOUTH</text>
                  <text x="2%" y="52%" fill="#64748b" fontSize="10" fontWeight="bold">WEST</text>
                </svg>

                {/* Radar Sweep Animation */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0deg, rgba(239, 68, 68, 0.4) 60deg, transparent 65deg)",
                    animation: "spin 6s linear infinite",
                  }}
                />

                {/* User Center Pin */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md animate-pulse" />
                  <span className="text-[9px] font-bold text-blue-300 mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-blue-500/40">
                    You
                  </span>
                </div>

                {/* Hospital Markers on Radar */}
                {radarPins.map((hosp) => {
                  const isSelected = activeHospital?.id === hosp.id;
                  const isCritical = hosp.hasCritical;
                  return (
                    <button
                      key={hosp.id}
                      type="button"
                      onClick={() => onSelectHospital(hosp.id)}
                      style={{ left: `${hosp.x}%`, top: `${hosp.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 group transition-transform ${
                        isSelected ? "scale-125 z-40" : "hover:scale-110"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 transition ${
                          isCritical
                            ? "bg-rose-600 border-rose-300 animate-bounce"
                            : isSelected
                            ? "bg-blue-600 border-white ring-4 ring-blue-400/40"
                            : "bg-red-700 border-red-300"
                        }`}
                      >
                        <span className="text-[10px]">{hosp.requestsCount}</span>
                      </div>
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-700 z-50">
                        <div className="font-bold">{hosp.name}</div>
                        <div className="text-red-300">
                          {hosp.requestsCount} requests · {hosp.distance} km
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Map Footer Bar with Navigation Launcher */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-800">
                {filteredHospitals.length} Hospitals
              </span>{" "}
              within {maxRadius === "all" ? "current radius" : `${maxRadius} km`}
            </div>
            {activeHospital && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.lat},${activeHospital.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold underline"
              >
                <span>Navigate to {activeHospital.name} on Google Maps</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Focused Hospital Detail Card & Needs Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          {activeHospital ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {activeHospital.type || "Speciality Hospital"}
                    </span>
                    {activeHospital.hasCritical && (
                      <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                        Critical Need
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                    {activeHospital.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{activeHospital.address}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-slate-900">{activeHospital.distance}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Kilometers Away</div>
                </div>
              </div>

              {/* Blood Requests Counter & Summary */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-center">
                  <p className="text-2xl font-black text-red-600">{activeHospital.requestsCount}</p>
                  <p className="text-[11px] font-bold text-red-800">Active Blood Requests</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                  <p className="text-2xl font-black text-amber-700">
                    {activeHospital.totalUnitsNeeded}
                  </p>
                  <p className="text-[11px] font-bold text-amber-800">Total Units Required</p>
                </div>
              </div>

              {/* Exact Blood Types Required Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>Blood Types Needed:</span>
                  <span className="text-[11px] text-slate-400 lowercase font-normal">
                    {activeHospital.bloodTypesNeeded?.length || 0} groups needed
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeHospital.bloodTypesNeeded?.map((req) => (
                    <div
                      key={req.group}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        req.urgency === "Critical"
                          ? "bg-rose-50/80 border-rose-300 text-rose-950"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-sm flex items-center justify-center">
                          {req.group}
                        </span>
                        <div>
                          <div className="text-xs font-bold leading-tight">
                            {req.units} Unit{req.units === 1 ? "" : "s"}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {req.requestsCount} patient case{req.requestsCount === 1 ? "" : "s"}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          req.urgency === "Critical"
                            ? "bg-rose-200 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                  ))}
                  {(!activeHospital.bloodTypesNeeded || !activeHospital.bloodTypesNeeded.length) && (
                    <p className="col-span-full py-3 text-center text-xs text-slate-400">
                      No urgent blood shortages reported for this hospital currently.
                    </p>
                  )}
                </div>
              </div>

              {/* Individual Patient Cases / Requests from this Hospital */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Hospital Emergency Cases:
                </h5>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeHospital.requests?.map((r) => (
                    <div
                      key={r.id}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{r.patient}</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">
                          ({r.department || "Emergency Ward"})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-red-600">{r.bloodGroup}</span>
                        <span className="text-[10px] text-slate-600 font-medium">
                          {r.unitsNeeded || 1} unit(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact and Direct Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`tel:${activeHospital.emergencyContact || activeHospital.phone}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <FiPhone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Blood Bank ({activeHospital.emergencyContact || activeHospital.phone})</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.lat},${activeHospital.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Google Maps</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleRespondToDonate(activeHospital)}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
                >
                  <FaTint className="w-3.5 h-3.5 text-white" />
                  <span>I Can Donate Blood to {activeHospital.name}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select a hospital from the map to view detailed blood requirements.
            </div>
          )}
        </div>
      </div>

      {/* Hospital List Cards with Distance, Blood Group Need, and Request Counts */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Nearest Hospitals Ordered by Distance
            </h3>
            <p className="text-xs text-slate-500">
              Showing active hospitals with open blood requests sorted from closest to farthest
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {filteredHospitals.length} Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHospitals.map((hosp) => {
            const isSelected = activeHospital?.id === hosp.id;
            return (
              <div
                key={hosp.id}
                onClick={() => onSelectHospital(hosp.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 hover:border-red-300 bg-white hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{hosp.address}</p>
                    </div>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl shrink-0">
                      {hosp.distance} km
                    </span>
                  </div>

                  {/* Badges for requests & units */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-lg">
                      🔥 {hosp.requestsCount} Request{hosp.requestsCount === 1 ? "" : "s"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {hosp.totalUnitsNeeded} units needed
                    </span>
                    {hosp.hasCritical && (
                      <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-md">
                        CRITICAL
                      </span>
                    )}
                  </div>

                  {/* Blood Types Needed Pill Tags */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                      Blood Types Needed:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {hosp.bloodTypesNeeded?.map((b) => (
                        <span
                          key={b.group}
                          className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                            b.urgency === "Critical"
                              ? "bg-rose-600 text-white border-rose-600"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {b.group} ({b.units}u)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>Google Maps Directions</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRespondToDonate(hosp);
                    }}
                    className="text-red-600 hover:text-red-700 font-bold"
                  >
                    Donate here &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Donation Modal */}
      {donationModalHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  Voluntary Blood Donation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Donate to {donationModalHospital.name}
                </h3>
                <p className="text-xs text-slate-500">{donationModalHospital.address}</p>
              </div>
              <button
                type="button"
                onClick={() => setDonationModalHospital(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {donationSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{donationSuccess}</span>
              </div>
            ) : (
              <>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distance from you:</span>
                    <span className="font-bold text-slate-800">{donationModalHospital.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Bank Desk:</span>
                    <span className="font-bold text-slate-800">
                      {donationModalHospital.emergencyContact || donationModalHospital.phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Priority Needed:</span>
                    <div className="flex gap-1">
                      {donationModalHospital.bloodTypesNeeded?.map((b) => (
                        <span key={b.group} className="font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                          {b.group}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  By confirming, your donor interest will be logged with the emergency triage desk. You will also be redirected with instant Google Maps navigation coordinates.
                </p>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setDonationModalHospital(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDonationInterest}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
                  >
                    Confirm & Alert Hospital
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
