import { useState } from "react";
import { useFamily } from "../../context/FamilyContext";
import { usePets } from "../../context/PetContext";
import { FaUsers, FaKey, FaLock, FaUnlock, FaPlus, FaCopy, FaCheckCircle, FaShieldAlt, FaTrash, FaUserPlus, FaHistory, FaEdit, FaPaw } from "react-icons/fa";

export default function FamilySharingSettings() {
  const { 
    familyVault, 
    profiles, 
    auditLogs, 
    addFamilyMemberProfile, 
    updateFamilyMemberProfile,
    updateProfilePin, 
    deleteProfile 
  } = useFamily();

  const { pets, addPet, deletePet } = usePets();

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", relationship: "Spouse", age: "", bloodGroup: "O+", pin: "" });
  
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPetData, setNewPetData] = useState({ name: "", species: "Dog", breed: "", age: "" });

  const [editingMemberProfile, setEditingMemberProfile] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", relationship: "Spouse", age: "", bloodGroup: "O+", pin: "" });

  const [editingPinProfile, setEditingPinProfile] = useState(null);
  const [pinValue, setPinValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(familyVault.inviteCode || "FAM-UNICARE-8921");
    setCopied(true);
    setNotice("Family Vault invite code copied to clipboard!");
    setTimeout(() => { setCopied(false); setNotice(""); }, 3000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    addFamilyMemberProfile(newMember);
    setNewMember({ name: "", relationship: "Spouse", age: "", bloodGroup: "O+", pin: "" });
    setShowAddMemberModal(false);
    setNotice("Family member profile created!");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleOpenEditMember = (p) => {
    setEditingMemberProfile(p);
    setEditFormData({
      name: p.name || "",
      relationship: p.relationship || "Spouse",
      age: p.age || "",
      bloodGroup: p.bloodGroup || "O+",
      pin: p.pin || "",
    });
  };

  const handleEditMemberSubmit = (e) => {
    e.preventDefault();
    if (editingMemberProfile && editFormData.name.trim()) {
      updateFamilyMemberProfile(editingMemberProfile.id, editFormData);
      setEditingMemberProfile(null);
      setNotice("Profile information updated successfully!");
      setTimeout(() => setNotice(""), 3000);
    }
  };

  const handleAddPetSubmit = (e) => {
    e.preventDefault();
    if (!newPetData.name.trim()) return;

    addPet(newPetData);
    setNewPetData({ name: "", species: "Dog", breed: "", age: "" });
    setShowAddPetModal(false);
    setNotice("New pet profile added to family vault!");
    setTimeout(() => setNotice(""), 3000);
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (editingPinProfile) {
      updateProfilePin(editingPinProfile.id, pinValue);
      setEditingPinProfile(null);
      setPinValue("");
      setNotice("Profile PIN updated successfully!");
      setTimeout(() => setNotice(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <FaCheckCircle className="text-emerald-600 text-lg" />
          <span>{notice}</span>
        </div>
      )}

      {/* Family Vault Invite Code Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-white/10 rounded-full text-indigo-200 border border-white/10">
            Family Account Vault
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-2">{familyVault.householdName || "Family Vault"}</h2>
          <p className="text-indigo-200 text-xs md:text-sm mt-1 max-w-xl">
            Share access safely with your whole family. Everyone has access to all features while individual health logs remain organized per family member.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0 w-full md:w-auto">
          <p className="text-[11px] uppercase font-bold tracking-wider text-indigo-200">Family Vault Key</p>
          <div className="text-xl md:text-2xl font-black font-mono tracking-wider mt-1 text-amber-300">
            {familyVault.inviteCode}
          </div>
          <button
            onClick={handleCopyInvite}
            className="mt-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 w-full active:scale-95"
          >
            <FaCopy />
            <span>{copied ? "Copied Key!" : "Copy Vault Invite"}</span>
          </button>
        </div>
      </div>

      {/* Family Members & Profiles Grid */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <FaUsers className="text-indigo-600" /> Family Profiles & Privacy Controls
            </h3>
            <p className="text-slate-500 text-xs mt-1">Manage family members and set 4-digit PIN locks for individual privacy.</p>
          </div>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition shadow-sm flex items-center gap-2 shrink-0 active:scale-95"
          >
            <FaUserPlus />
            <span>Add Family Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 space-y-4 transition bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${p.avatarColor || "bg-blue-600"} text-white flex items-center justify-center font-bold text-lg shadow-inner`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{p.name}</h4>
                      <p className="text-indigo-600 text-xs font-semibold">{p.relationship}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600">
                    {p.role || "Member"}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Group</span>
                    <strong className="text-red-600">{p.bloodGroup || "O+"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age</span>
                    <strong className="text-slate-800">{p.age} Yrs</strong>
                  </div>
                </div>
              </div>

              {/* Security PIN Controls & Edit Profile */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {p.pinEnabled ? (
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5 text-[11px]">
                      <FaLock className="text-amber-600" /> Locked
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[11px]">
                      <FaUnlock className="text-slate-400" /> Open Access
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditMember(p)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1"
                    title="Edit Profile Information"
                  >
                    <FaEdit className="text-xs" /> Edit Profile
                  </button>

                  <button
                    onClick={() => { setEditingPinProfile(p); setPinValue(p.pin || ""); }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg transition"
                    title="Configure PIN"
                  >
                    <FaLock className="text-xs" />
                  </button>

                  {p.role !== "Family Admin" && (
                    <button
                      onClick={() => deleteProfile(p.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition"
                      title="Remove Member"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family Pets Directory */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <FaPaw className="text-emerald-600" /> Family Pets Directory
            </h3>
            <p className="text-slate-500 text-xs mt-1">Add and remove pets in your family vault to track vaccinations, vet visits, and health reports.</p>
          </div>

          <button
            onClick={() => setShowAddPetModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition shadow-sm flex items-center gap-2 shrink-0 active:scale-95"
          >
            <FaPlus />
            <span>Add Family Pet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id || pet._id}
              className="border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 space-y-3 transition bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-inner">
                      <FaPaw />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{pet.name}</h4>
                      <p className="text-emerald-700 text-xs font-semibold">{pet.species} · {pet.breed}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                  <span>Age: <strong>{pet.age}</strong></span>
                  <span className="text-slate-400">Owner: {pet.owner || "Family Parent"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove ${pet.name}'s profile from family vault?`)) {
                      deletePet(pet.id || pet._id);
                      setNotice(`${pet.name}'s profile has been removed.`);
                      setTimeout(() => setNotice(""), 3000);
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <FaTrash className="text-xs" />
                  <span>Remove Pet</span>
                </button>
              </div>
            </div>
          ))}

          {!pets.length && (
            <p className="text-slate-400 text-xs py-4 col-span-full">No pets registered in the family vault yet.</p>
          )}
        </div>
      </section>

      {/* Safety & Audit Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Audit Log */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <FaHistory className="text-indigo-600" /> Family Activity Audit Trail
          </h3>
          <p className="text-slate-500 text-xs">Transparent log of health appointments and record updates made by family members.</p>

          <div className="space-y-2 max-h-64 overflow-y-auto pt-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">{log.user}</span>
                  <p className="text-slate-600 mt-0.5">{log.action}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Guidelines Card */}
        <section className="bg-indigo-50/70 border border-indigo-100 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-indigo-950 flex items-center gap-2">
            <FaShieldAlt className="text-indigo-600" /> Family Safety Rules
          </h3>

          <ul className="space-y-3 text-xs text-indigo-900 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">1.</span>
              <span><strong>Full Access for Everyone:</strong> All family members share access to appointments, blood donations, pet care, and AI consultation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">2.</span>
              <span><strong>Personal Profile Lock:</strong> Set a 4-digit PIN on your profile to prevent accidental modifications to personal health history.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">3.</span>
              <span><strong>Emergency Quick Access:</strong> In medical emergencies, family members can bypass profile PINs to view emergency contacts and blood groups.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Add Family Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <FaUserPlus className="text-indigo-600" /> Add Family Member Profile
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Rohan Sharma"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Relationship</label>
                <select
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandparent">Grandparent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 32"
                  value={newMember.age}
                  onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group</label>
                <select
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newMember.bloodGroup}
                  onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">4-Digit PIN Lock (Optional)</label>
                <input
                  type="password"
                  maxLength={4}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 1234"
                  value={newMember.pin}
                  onChange={(e) => setNewMember({ ...newMember, pin: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit 4-Digit PIN Modal */}
      {editingPinProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in">
          <form onSubmit={handleSavePin} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mx-auto">
              <FaLock />
            </div>
            <h4 className="text-xl font-extrabold text-slate-800">
              Configure PIN for {editingPinProfile.name}
            </h4>
            <p className="text-xs text-slate-500">Enter a 4-digit PIN to lock this profile, or leave empty to allow open access.</p>

            <input
              type="password"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value)}
              className="w-40 text-center text-xl font-bold tracking-widest border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none mx-auto"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingPinProfile(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm"
              >
                Save PIN
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Family Member Profile Modal */}
      {editingMemberProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in">
          <form onSubmit={handleEditMemberSubmit} className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <FaEdit className="text-indigo-600" /> Edit Profile Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Relationship</label>
                <select
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={editFormData.relationship}
                  onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
                >
                  <option value="Self (Primary)">Self (Primary)</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandparent">Grandparent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={editFormData.age}
                  onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group</label>
                <select
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={editFormData.bloodGroup}
                  onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">4-Digit PIN Lock</label>
                <input
                  type="password"
                  maxLength={4}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 1234"
                  value={editFormData.pin}
                  onChange={(e) => setEditFormData({ ...editFormData, pin: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingMemberProfile(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Family Pet Modal */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in">
          <form onSubmit={handleAddPetSubmit} className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <FaPaw className="text-emerald-600" /> Add Family Pet Profile
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pet Name *</label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Bruno"
                value={newPetData.name}
                onChange={(e) => setNewPetData({ ...newPetData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Species</label>
                <select
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newPetData.species}
                  onChange={(e) => setNewPetData({ ...newPetData, species: e.target.value })}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Breed *</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Labrador"
                  value={newPetData.breed}
                  onChange={(e) => setNewPetData({ ...newPetData, breed: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age *</label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 2 Years"
                value={newPetData.age}
                onChange={(e) => setNewPetData({ ...newPetData, age: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddPetModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                Save Pet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
