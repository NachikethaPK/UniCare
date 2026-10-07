import { useState } from "react";
import { useBloodDonation } from "../../context/BloodDonationContext";
import { FaTint, FaSearch, FaUserPlus, FaHospital, FaPhone, FaHeartbeat } from "react-icons/fa";

const initialRequest = { patient: "", bloodGroup: "A+", hospital: "", location: "", contact: "", urgency: "Normal" };
const initialDonor = { name: "", bloodGroup: "A+", age: "", location: "", phone: "" };

export default function BloodDonationDashboard() {
  const { donors, requests, addDonor, addRequest, updateRequestStatus } = useBloodDonation();
  const [group, setGroup] = useState("");
  const [location, setLocation] = useState("");
  const [request, setRequest] = useState(initialRequest);
  const [donor, setDonor] = useState(initialDonor);
  const [notice, setNotice] = useState("");

  const matches = donors.filter(
    (d) => (!group || d.bloodGroup === group) && d.location.toLowerCase().includes(location.toLowerCase())
  );

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    addRequest(request);
    setRequest(initialRequest);
    setNotice("Blood request submitted successfully!");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleDonorSubmit = (e) => {
    e.preventDefault();
    addDonor(donor);
    setDonor(initialDonor);
    setNotice("Thank you! You are registered as a blood donor.");
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white/20 rounded-full">
            Lifesaving Service
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Blood Donation Network</h1>
          <p className="text-red-100 text-sm mt-1">Connect with verified blood donors or post urgent blood requests instantly.</p>
        </div>
        <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <p className="text-2xl font-black text-white">{donors.length}</p>
          <p className="text-xs text-red-100 font-semibold">Active Donors Nearby</p>
        </div>
      </div>

      {notice && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold animate-in fade-in">
          {notice}
        </div>
      )}

      {/* Find Donors Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaSearch className="text-red-600 text-lg" /> Find Blood Donors
          </h2>
          <span className="text-xs font-semibold text-slate-400">Filtering {matches.length} donors</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none"
              placeholder="Search by location (e.g. Bangalore, Indiranagar)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((d) => (
            <article key={d.id} className="rounded-2xl border border-slate-200 p-4 hover:border-red-400 transition bg-slate-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{d.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{d.location}</p>
                </div>
                <span className="text-xl font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-xl border border-red-100">
                  {d.bloodGroup}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <FaPhone className="text-red-500" /> {d.phone}
                </span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  {d.availability || "Available"}
                </span>
              </div>
            </article>
          ))}
          {!matches.length && (
            <p className="col-span-full py-8 text-center text-slate-500 text-sm">No donors found matching criteria.</p>
          )}
        </div>
      </section>

      {/* Forms Grid: Request Blood & Register Donor */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Blood Form */}
        <form onSubmit={handleRequestSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaTint className="text-red-600" /> Submit Blood Request
          </h2>

          <input
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Patient Name"
            value={request.patient}
            onChange={(e) => setRequest({ ...request, patient: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              value={request.bloodGroup}
              onChange={(e) => setRequest({ ...request, bloodGroup: e.target.value })}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              value={request.urgency}
              onChange={(e) => setRequest({ ...request, urgency: e.target.value })}
            >
              <option value="Normal">Normal Urgency</option>
              <option value="Urgent">Urgent Priority</option>
            </select>
          </div>

          <input
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Hospital Name (e.g. Apollo Hospital)"
            value={request.hospital}
            onChange={(e) => setRequest({ ...request, hospital: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="City / Area"
              value={request.location}
              onChange={(e) => setRequest({ ...request, location: e.target.value })}
            />
            <input
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Contact Number"
              value={request.contact}
              onChange={(e) => setRequest({ ...request, contact: e.target.value })}
            />
          </div>

          <button className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 font-semibold text-white transition shadow-sm">
            Post Blood Request
          </button>
        </form>

        {/* Register Donor Form */}
        <form onSubmit={handleDonorSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaUserPlus className="text-red-600" /> Register as a Blood Donor
          </h2>

          <input
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Full Name"
            value={donor.name}
            onChange={(e) => setDonor({ ...donor, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              value={donor.bloodGroup}
              onChange={(e) => setDonor({ ...donor, bloodGroup: e.target.value })}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>

            <input
              required
              type="number"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Age"
              value={donor.age}
              onChange={(e) => setDonor({ ...donor, age: e.target.value })}
            />
          </div>

          <input
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Location / Area"
            value={donor.location}
            onChange={(e) => setDonor({ ...donor, location: e.target.value })}
          />

          <input
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Phone Number"
            value={donor.phone}
            onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
          />

          <button className="w-full rounded-xl bg-slate-800 hover:bg-slate-900 py-3 font-semibold text-white transition shadow-sm">
            Register Me as Donor
          </button>
        </form>
      </div>

      {/* Blood Requests Status Tracker */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaHeartbeat className="text-red-600" /> Active Blood Requests Status Tracker
        </h2>
        <div className="space-y-3">
          {requests.map((r) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 bg-slate-50/50" key={r.id}>
              <div>
                <span className="font-bold text-slate-800 text-sm">{r.patient}</span>
                <span className="ml-2 font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-lg text-xs">{r.bloodGroup}</span>
                <p className="text-xs text-slate-500 mt-1">
                  Hospital: {r.hospital} · Contact: {r.contact} · Urgency: <span className="font-semibold">{r.urgency}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">Status:</label>
                <select
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  value={r.status}
                  onChange={(e) => updateRequestStatus(r.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
          {!requests.length && <p className="text-slate-500 text-sm">No blood requests submitted yet.</p>}
        </div>
      </section>

      {/* Partner Blood Banks */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <FaHospital className="text-red-600" /> Partner Blood Banks & Emergency Centres
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-bold text-slate-800 text-sm">City Blood Bank</h4>
            <p className="text-xs text-slate-500 mt-1">24/7 Supply · Helpline: 080-22345678</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-bold text-slate-800 text-sm">Central Hospital Blood Centre</h4>
            <p className="text-xs text-slate-500 mt-1">Platelets & Plasma · Helpline: 080-33456789</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-bold text-slate-800 text-sm">Red Cross Blood Bank</h4>
            <p className="text-xs text-slate-500 mt-1">Voluntary Donation · Helpline: 108</p>
          </div>
        </div>
      </section>
    </div>
  );
}
