import { useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import { FaUser, FaUsers, FaPhoneAlt, FaLock, FaBell, FaCheckCircle, FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";
import FamilySharingSettings from "./FamilySharingSettings";

export default function ProfileDashboard() {
  const { 
    profile, 
    setProfile, 
    family, 
    setFamily, 
    contacts, 
    setContacts, 
    notifications, 
    setNotifications 
  } = useProfile();

  const [formData, setFormData] = useState(profile);
  const [member, setMember] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("family");

  const addFamilyMember = (e) => {
    e.preventDefault();
    if (member.trim()) {
      setFamily([...family, member.trim()]);
      setMember("");
      setNotice("Family member added.");
      setTimeout(() => setNotice(""), 2000);
    }
  };

  const removeFamily = (index) => {
    setFamily(family.filter((_, i) => i !== index));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    setNotice("Profile information saved successfully!");
    setTimeout(() => setNotice(""), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (password.trim()) {
      setPassword("");
      setNotice("Password updated successfully!");
      setTimeout(() => setNotice(""), 3000);
    }
  };

  const addEmergencyContact = (e) => {
    e.preventDefault();
    if (contact.trim()) {
      setContacts([...contacts, contact.trim()]);
      setContact("");
      setNotice("Emergency contact added.");
      setTimeout(() => setNotice(""), 2000);
    }
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Navigation Tabs */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white/20 rounded-full">
            Account Management
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Family & Personal Profile</h1>
          <p className="text-blue-100 text-sm mt-1">Manage shared family vault access, profile PIN locks, personal details, and notifications.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
          <button
            onClick={() => setActiveTab("family")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "family"
                ? "bg-white text-indigo-900 shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            <FaShieldAlt /> Family Vault Sharing
          </button>
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "personal"
                ? "bg-white text-indigo-900 shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            <FaUser /> Personal Details
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <FaCheckCircle className="text-emerald-600 text-lg" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tab 1: Family Vault Sharing (Primary View for User Request) */}
      {activeTab === "family" && <FamilySharingSettings />}

      {/* Tab 2: Personal Details & Settings */}
      {activeTab === "personal" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800 text-sm">Looking for the dedicated Personal Details & Emergency ID page?</p>
              <p className="text-xs text-slate-500">Access full emergency SOS cards, addresses, blood group data, and family credentials.</p>
            </div>
            <Link
              to="/personal-details"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm shrink-0 self-start sm:self-auto"
            >
              <span>Go to Dedicated Personal Details</span>
              <FaExternalLinkAlt className="text-[10px]" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info Form */}
        <form onSubmit={handleProfileSave} className="space-y-4 rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-2">
            <FaUser className="text-blue-600" /> Personal Information
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dob || ""}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Gender</label>
              <select
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.gender || ""}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-semibold text-white transition shadow-sm">
            Save Profile Changes
          </button>
        </form>

        {/* Right Side: Family, Contacts, Password & Notifications */}
        <div className="space-y-6">
          {/* Family Members Section */}
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FaUsers className="text-indigo-600" /> Family Members
            </h2>
            <form className="mt-3 flex gap-2" onSubmit={addFamilyMember}>
              <input
                className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                value={member}
                onChange={(e) => setMember(e.target.value)}
                placeholder="Name & Relationship (e.g. Rohan - Spouse)"
              />
              <button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 text-xs font-semibold text-white transition">
                Add
              </button>
            </form>
            <div className="mt-3 space-y-2">
              {family.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-medium text-slate-800">{m}</span>
                  <button onClick={() => removeFamily(i)} className="text-red-600 hover:underline font-semibold">
                    Remove
                  </button>
                </div>
              ))}
              {!family.length && <p className="text-xs text-slate-400">No family members added.</p>}
            </div>
          </section>

          {/* Emergency Contacts */}
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FaPhoneAlt className="text-red-600" /> Emergency Contacts
            </h2>
            <form className="mt-3 flex gap-2" onSubmit={addEmergencyContact}>
              <input
                className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Name and Phone Number"
              />
              <button className="rounded-xl bg-red-600 hover:bg-red-700 px-4 text-xs font-semibold text-white transition">
                Add
              </button>
            </form>
            <div className="mt-3 space-y-2">
              {contacts.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-medium text-slate-800">{c}</span>
                  <button onClick={() => removeContact(i)} className="text-red-600 hover:underline font-semibold">
                    Remove
                  </button>
                </div>
              ))}
              {!contacts.length && <p className="text-xs text-slate-400">No emergency contacts added.</p>}
            </div>
          </section>

          {/* Change Password */}
          <form onSubmit={handlePasswordUpdate} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-3">
            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FaLock className="text-slate-700" /> Security & Password
            </h2>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-slate-500 outline-none"
              placeholder="Enter new security password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="rounded-xl bg-slate-800 hover:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition shadow-sm">
              Update Password
            </button>
          </form>

          {/* Notification Preferences */}
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2 mb-3">
              <FaBell className="text-amber-500" /> Notification Preferences
            </h2>
            <div className="space-y-3 text-xs">
              {Object.keys(notifications).map((key) => (
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 capitalize cursor-pointer" key={key}>
                  <span>{key} Notifications</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
      )}
    </div>
  );
}
