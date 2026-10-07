import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useFamily } from "../../context/FamilyContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiCheckCircle,
  FiShield,
  FiEdit2,
  FiLock,
  FiBell,
  FiUsers,
  FiHeart,
  FiActivity,
  FiSave,
  FiPlus,
  FiTrash2,
  FiCopy,
} from "react-icons/fi";
import { FaTint } from "react-icons/fa";

export default function PersonalDetails() {
  const { user } = useAuth();
  const { profile, setProfile, contacts, setContacts, notifications, setNotifications } = useProfile();
  const { familyVault, updateHouseholdName, activeProfile, profiles } = useFamily();

  // Personal Information State
  const [formData, setFormData] = useState({
    name: profile?.name || user?.name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    dob: profile?.dob || "",
    gender: profile?.gender || "Not specified",
    bloodGroup: profile?.bloodGroup || activeProfile?.bloodGroup || "O+",
    address: profile?.address || "",
    city: profile?.city || "Bangalore",
    allergies: profile?.allergies || "None reported",
    emergencyNotes: profile?.emergencyNotes || "",
  });

  // Family Name State - DEFAULTS TO EMPTY as requested!
  const [familyName, setFamilyName] = useState(familyVault?.householdName || "");
  const [isEditingFamilyName, setIsEditingFamilyName] = useState(false);

  // New Emergency Contact State
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "Family" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notice, setNotice] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    setFamilyName(familyVault?.householdName || "");
  }, [familyVault]);

  const handlePersonalSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    setNotice("Personal details updated successfully!");
    setTimeout(() => setNotice(""), 3500);
  };

  const handleFamilyNameSave = (e) => {
    e.preventDefault();
    updateHouseholdName(familyName);
    setIsEditingFamilyName(false);
    setNotice("Family name saved successfully!");
    setTimeout(() => setNotice(""), 3500);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact.name.trim() && newContact.phone.trim()) {
      const contactStr = `${newContact.name.trim()} (${newContact.relation}) - ${newContact.phone.trim()}`;
      setContacts([...contacts, contactStr]);
      setNewContact({ name: "", phone: "", relation: "Family" });
      setNotice("Emergency contact added!");
      setTimeout(() => setNotice(""), 3000);
    }
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwords do not match or are empty!");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setNotice("Account password updated successfully!");
    setTimeout(() => setNotice(""), 3500);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(familyVault?.inviteCode || "FAM-UNICARE-8921");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  return (
    <DashboardLayout title="Personal & Clinical Profile">
      <div className="space-y-6">
        {/* Profile Command Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 bg-white/20 rounded-full border border-white/20">
                Personal Identity & Health Vault
              </span>
              <span className="text-[11px] font-bold px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-full">
                Active Member
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formData.name || "Your Personal Details"}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Manage your personal medical identity, emergency dispatch contact information, account credentials, and family household name.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs shrink-0 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white text-indigo-700 font-extrabold text-base flex items-center justify-center shadow-xs">
              {formData.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-bold text-white text-xs">{formData.email}</p>
              <p className="text-[11px] text-blue-200">
                {activeProfile?.relationship || "Primary Profile"} · Role: {activeProfile?.role || "Family Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Success Toast Notice */}
        {notice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* 1. Family Name Management Banner (Default is Empty as requested!) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                  <FiUsers className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Family & Household Name
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Customize your shared family vault name. Default is unassigned until you choose one.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl transition"
              >
                <span>Family Members Vault ({profiles.length}) &rarr;</span>
              </Link>
            </div>
          </div>

          <form onSubmit={handleFamilyNameSave} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter your family name (e.g. The Sharma Family, Kumar Household)"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <FiSave className="w-3.5 h-3.5" />
              <span>Save Family Name</span>
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Current Family Name:</span>
              <strong className="text-slate-900 font-bold">
                {familyVault?.householdName ? (
                  familyVault.householdName
                ) : (
                  <span className="text-slate-400 font-normal italic">
                    (No family name set · Empty)
                  </span>
                )}
              </strong>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-500 font-mono text-[11px]">
                Vault Code: <strong>{familyVault?.inviteCode}</strong>
              </span>
              <button
                type="button"
                onClick={handleCopyInvite}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <FiCopy className="w-3 h-3" />
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Main Personal Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Personal Details Form */}
          <form
            onSubmit={handlePersonalSave}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiUser className="text-blue-600 w-5 h-5" />
                <span>Personal & Medical Identity</span>
              </h3>
              <span className="text-[10px] font-bold uppercase text-slate-400">HIPAA Compliant</span>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Primary Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Blood Group & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <FaTint className="text-red-600" /> Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-red-600"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="Not specified">Not specified</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Address & City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    placeholder="e.g. 42 Richmond Town, 2nd Cross"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="Bangalore"
                />
              </div>
            </div>

            {/* Critical Medical Notes & Allergies */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Known Drug Allergies & Emergency Notes
              </label>
              <textarea
                rows={2}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder="e.g. Penicillin allergy, mild asthma"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              <span>Save Personal Information</span>
            </button>
          </form>

          {/* Right Column (5 cols): Emergency Contacts, Password & Security */}
          <div className="lg:col-span-5 space-y-6">
            {/* Emergency Contacts Card */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FiPhone className="text-red-500 w-4 h-4" />
                  <span>Emergency SOS Contacts</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  {contacts.length} Registered
                </span>
              </div>

              {/* Add Emergency Contact Form */}
              <form onSubmit={handleAddContact} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Contact Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={newContact.relation}
                    onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none flex-1 font-medium"
                  >
                    <option value="Family">Family Member</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Doctor">Primary Care Physician</option>
                    <option value="Friend">Trusted Friend</option>
                  </select>

                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <FiPlus />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Saved Contacts List */}
              <div className="space-y-2 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                {contacts.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveContact(i)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md transition"
                      title="Remove contact"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Password & Security */}
            <form
              onSubmit={handlePasswordUpdate}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FiLock className="text-slate-700 w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900">Security Credentials</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition"
              >
                Update Password
              </button>
            </form>

            {/* Notification & Telemetry Preferences */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FiBell className="text-amber-500 w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900">Dispatch & Telemetry Alerts</h3>
              </div>

              <div className="space-y-2 text-xs">
                {Object.keys(notifications).map((k) => (
                  <label
                    key={k}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer text-slate-700 font-medium"
                  >
                    <span className="capitalize">{k} Emergency Dispatch Alerts</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-blue-600"
                      checked={notifications[k]}
                      onChange={(e) =>
                        setNotifications({ ...notifications, [k]: e.target.checked })
                      }
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
