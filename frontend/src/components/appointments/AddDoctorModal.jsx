import { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";

function AddDoctorModal({ open, onClose }) {
  const { addCustomDoctor } = useAppointments();
  const [form, setForm] = useState({
    name: "",
    speciality: "General Physician",
    customSpeciality: "",
    experience: "5 Years",
    contact: "",
  });
  const [successMsg, setSuccessMsg] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const finalSpeciality = form.speciality === "Other" 
      ? (form.customSpeciality.trim() || "General Practitioner") 
      : form.speciality;

    addCustomDoctor({
      name: form.name.trim(),
      speciality: finalSpeciality,
      experience: form.experience || "5 Years",
      contact: form.contact || "",
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setForm({
        name: "",
        speciality: "General Physician",
        customSpeciality: "",
        experience: "5 Years",
        contact: "",
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl border border-slate-100 relative">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-1">
          Add Custom Doctor 🩺
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Add a new doctor or specialist to your personal directory.
        </p>

        {successMsg ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-6 rounded-2xl text-center space-y-2">
            <span className="text-4xl block">🎉</span>
            <h4 className="font-bold text-lg">Doctor Added!</h4>
            <p className="text-sm text-emerald-600">The doctor is now available for appointment booking.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Priya Sharma"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Speciality *</label>
                <select
                  name="speciality"
                  value={form.speciality}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Other">Other / Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 8 Years"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {form.speciality === "Other" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Custom Speciality Name</label>
                <input
                  type="text"
                  name="customSpeciality"
                  value={form.customSpeciality}
                  onChange={handleChange}
                  placeholder="e.g. Immunologist"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital / Contact Details (Optional)</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="e.g. City Hospital, Ph: +91 9876543210"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-600 font-semibold hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition text-sm flex items-center gap-2"
              >
                Add Doctor
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddDoctorModal;
