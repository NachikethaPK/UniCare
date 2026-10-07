import { useState } from "react";
import { Link } from "react-router-dom";
import { useBloodDonation } from "../../context/BloodDonationContext";
import { useAuth } from "../../context/AuthContext";
import HospitalMapRadar from "./HospitalMapRadar";
import HospitalPortalDesk from "./HospitalPortalDesk";
import {
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiSearch,
  FiUserPlus,
  FiPlusSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiHeart,
  FiCompass,
  FiLayers,
} from "react-icons/fi";
import { FaTint, FaHospital, FaHeartbeat } from "react-icons/fa";

const initialDonor = { name: "", bloodGroup: "O+", age: "", location: "Bangalore", phone: "" };

export default function BloodDonationDashboard() {
  const {
    hospitalsWithStats,
    userLocation,
    setUserLocation,
    donors,
    requests,
    addDonor,
  } = useBloodDonation();
  const { user, isHospital } = useAuth();

  const [activeTab, setActiveTab] = useState("map"); // "map", "hospital_portal", "donors"
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");

  // Donor Search State
  const [donorGroup, setDonorGroup] = useState("");
  const [donorLocationQuery, setDonorLocationQuery] = useState("");
  const [donorForm, setDonorForm] = useState(initialDonor);
  const [donorNotice, setDonorNotice] = useState("");

  // Geolocation trigger
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: "Live GPS Location",
            isDetected: true,
          });
        },
        (err) => {
          alert("GPS detection unavailable or denied. Using default city coordinates.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleDonorSubmit = (e) => {
    e.preventDefault();
    addDonor(donorForm);
    setDonorForm(initialDonor);
    setDonorNotice("Thank you! You are now registered on the UniCare emergency blood donor network.");
    setTimeout(() => setDonorNotice(""), 4000);
  };

  const filteredDonors = donors.filter(
    (d) =>
      (!donorGroup || d.bloodGroup === donorGroup) &&
      d.location.toLowerCase().includes(donorLocationQuery.toLowerCase())
  );

  // Overall statistics
  const totalUnitsNeeded = hospitalsWithStats.reduce((acc, h) => acc + (h.totalUnitsNeeded || 0), 0);
  const criticalHospitalsCount = hospitalsWithStats.filter((h) => h.hasCritical).length;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase font-black tracking-wider px-3 py-1 bg-white/20 rounded-full backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Google Maps Integrated Radar</span>
            </span>
            {isHospital && (
              <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 bg-white/30 rounded-full">
                Logged in as Hospital: {user.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Emergency Blood Dispatch & Hospital Radar
          </h1>
          <p className="text-red-100 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            Live geographic mapping connecting voluntary donors with verified hospitals facing acute blood shortages. Track required blood types, open hospital requests, and navigate via Google Maps.
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0 w-full lg:w-auto">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
            <p className="text-2xl font-black text-white">{hospitalsWithStats.length}</p>
            <p className="text-[10px] text-red-200 font-bold uppercase">Hospitals on Radar</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
            <p className="text-2xl font-black text-amber-300">{totalUnitsNeeded}</p>
            <p className="text-[10px] text-red-200 font-bold uppercase">Units Shortage</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
            <p className="text-2xl font-black text-rose-300">{criticalHospitalsCount}</p>
            <p className="text-[10px] text-red-200 font-bold uppercase">Critical Centers</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
            <p className="text-2xl font-black text-emerald-300">{donors.length}</p>
            <p className="text-[10px] text-red-200 font-bold uppercase">Active Donors</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === "map"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FiCompass className="w-4 h-4 text-red-500" />
            <span>Google Maps Radar & Nearest Hospitals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hospital_portal")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === "hospital_portal"
                ? "bg-rose-700 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FiPlusSquare className="w-4 h-4 text-rose-500" />
            <span>Hospital Dispatch Desk {isHospital ? "(Active)" : "(Sign In)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("donors")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === "donors"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FiUserPlus className="w-4 h-4 text-blue-500" />
            <span>Donor Registry & Community</span>
          </button>
        </div>

        {/* Hospital Portal Link for Unauthenticated / Non-Hospital visitors */}
        {!isHospital && (
          <Link
            to="/login?role=hospital"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
          >
            <FaHospital className="w-3.5 h-3.5" />
            <span>Hospital Portal Sign In &rarr;</span>
          </Link>
        )}
      </div>

      {/* Tab 1: Google Maps & Nearest Hospitals Radar */}
      {activeTab === "map" && (
        <HospitalMapRadar
          hospitals={hospitalsWithStats}
          userLocation={userLocation}
          onLocateUser={handleLocateMe}
          selectedHospitalId={selectedHospitalId}
          onSelectHospital={(id) => setSelectedHospitalId(id)}
          selectedBloodGroup={selectedBloodGroup}
          onSelectBloodGroup={(grp) => setSelectedBloodGroup(grp)}
        />
      )}

      {/* Tab 2: Hospital Sign In & Post Blood Requests Portal */}
      {activeTab === "hospital_portal" && (
        <HospitalPortalDesk
          onFocusMap={(hospId) => {
            setSelectedHospitalId(hospId);
            setActiveTab("map");
          }}
        />
      )}

      {/* Tab 3: Donor Registration & Community Directory */}
      {activeTab === "donors" && (
        <div className="space-y-6">
          {donorNotice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{donorNotice}</span>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Donor Registration Form (5 cols) */}
            <form
              onSubmit={handleDonorSubmit}
              className="lg:col-span-5 space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <FiHeart className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Register as a Blood Donor</h3>
                  <p className="text-xs text-slate-500">
                    Be on-call for emergency blood dispatch near your locality
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="e.g. Rahul Sharma"
                  value={donorForm.name}
                  onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-red-600 focus:ring-2 focus:ring-red-500 outline-none"
                    value={donorForm.bloodGroup}
                    onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    required
                    type="number"
                    min="18"
                    max="65"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="e.g. 25"
                    value={donorForm.age}
                    onChange={(e) => setDonorForm({ ...donorForm, age: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Area</label>
                <input
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="e.g. Indiranagar, Bangalore"
                  value={donorForm.location}
                  onChange={(e) => setDonorForm({ ...donorForm, location: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  required
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="+91 98765 43210"
                  value={donorForm.phone}
                  onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                />
              </div>

              <button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3 font-bold text-xs text-white transition shadow-sm">
                Complete Donor Registration
              </button>
            </form>

            {/* Active Donor Directory (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <FiSearch className="text-red-600" /> Community Donors Directory
                  </h3>
                  <p className="text-xs text-slate-500">Contact verified donors on stand-by</p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {filteredDonors.length} Donors
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Filter by locality (e.g. Koramangala)"
                    value={donorLocationQuery}
                    onChange={(e) => setDonorLocationQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-bold"
                  value={donorGroup}
                  onChange={(e) => setDonorGroup(e.target.value)}
                >
                  <option value="">All Groups</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredDonors.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{d.name}</h4>
                        <p className="text-[10px] text-slate-500">{d.location}</p>
                      </div>
                      <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">
                        {d.bloodGroup}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                      <a
                        href={`tel:${d.phone}`}
                        className="text-slate-700 hover:text-red-600 font-semibold flex items-center gap-1"
                      >
                        <FiPhone className="w-3 h-3 text-red-500" />
                        <span>{d.phone}</span>
                      </a>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {d.availability || "Available"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Blood Banks Section */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <FaHospital className="text-red-600" /> Partner Blood Transfusion Centers & Helplines
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Government and institutional blood banks operational 24/7 for critical platelet and plasma units
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">Karnataka Red Cross Blood Centre</h4>
            <p className="text-[11px] text-slate-500 mt-1">24/7 Voluntary Blood & Platelet Bank</p>
            <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
              <FiPhone className="w-3.5 h-3.5" /> 080-2226 8435 / Toll Free 108
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">Victoria Hospital BMCRI Blood Bank</h4>
            <p className="text-[11px] text-slate-500 mt-1">State Referral Blood Component Facility</p>
            <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
              <FiPhone className="w-3.5 h-3.5" /> 080-2670 1150 (Ext 204)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">Narayana Health Central Blood Bank</h4>
            <p className="text-[11px] text-slate-500 mt-1">Specialized Cardiac & Pediatric Units</p>
            <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
              <FiPhone className="w-3.5 h-3.5" /> 080-7122 2233
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
