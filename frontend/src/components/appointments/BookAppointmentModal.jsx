import { useState, useEffect } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { FaBell, FaPlus } from "react-icons/fa";

function BookAppointmentModal({ open, onClose, selectedDoctor = "", onOpenAddDoctor }) {
  const { addAppointment, customDoctors } = useAppointments();
  const [form, setForm] = useState({
    doctor: "",
    customDoctorName: "",
    speciality: "",
    date: "",
    time: "",
    symptoms: "",
    reminderEnabled: true,
    reminderTime: "1 hour before",
  });
  const [successMsg, setSuccessMsg] = useState(false);

  const defaultDoctors = [
    { name: "Dr. Ananya Rao", speciality: "Cardiologist" },
    { name: "Dr. Vivek Sharma", speciality: "Dermatologist" },
    { name: "Dr. Sneha Kapoor", speciality: "Neurologist" },
  ];

  const allDoctors = [
    ...defaultDoctors,
    ...customDoctors.map(d => ({ name: d.name, speciality: d.speciality }))
  ];

  useEffect(() => {
    if (selectedDoctor) {
      setForm((prev) => ({ ...prev, doctor: selectedDoctor, customDoctorName: "" }));
    }
  }, [selectedDoctor, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalDoctor = form.doctor === "OTHER_CUSTOM" ? form.customDoctorName.trim() : form.doctor;
    if (!finalDoctor) return;

    let finalSpeciality = form.speciality;
    if (!finalSpeciality) {
      const match = allDoctors.find(d => d.name === finalDoctor);
      finalSpeciality = match ? match.speciality : "General Consultation";
    }
    
    await addAppointment({
      doctor: finalDoctor,
      speciality: finalSpeciality,
      date: form.date,
      time: form.time,
      symptoms: form.symptoms,
      reminderEnabled: form.reminderEnabled,
      reminderTime: form.reminderTime,
    });

    // Ask browser notification permission if reminder is enabled
    if (form.reminderEnabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setForm({
        doctor: "",
        customDoctorName: "",
        speciality: "",
        date: "",
        time: "",
        symptoms: "",
        reminderEnabled: true,
        reminderTime: "1 hour before",
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
          Book Appointment
        </h2>
        <p className="text-slate-500 text-sm mb-6">Select a doctor, time slot, and set a reminder.</p>

        {successMsg ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center space-y-2">
            <span className="text-4xl block">✅</span>
            <h4 className="font-bold text-lg">Appointment Booked!</h4>
            <p className="text-sm text-green-600">
              {form.reminderEnabled 
                ? `Saved! Reminder set for ${form.reminderTime}.`
                : "Your appointment has been added to your schedule."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Doctor</label>
                {onOpenAddDoctor && (
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenAddDoctor(); }}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <FaPlus className="text-[10px]" /> Add new doctor
                  </button>
                )}
              </div>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Doctor</option>
                {allDoctors.map((doc, idx) => (
                  <option key={idx} value={doc.name}>
                    {doc.name} ({doc.speciality})
                  </option>
                ))}
                <option value="OTHER_CUSTOM">+ Type doctor name manually...</option>
              </select>
            </div>

            {form.doctor === "OTHER_CUSTOM" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    name="customDoctorName"
                    value={form.customDoctorName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    value={form.speciality}
                    onChange={handleChange}
                    placeholder="e.g. Cardiologist"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Reminder Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="reminderEnabled" className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase cursor-pointer">
                  <FaBell className="text-amber-500 text-sm" /> Set Appointment Reminder
                </label>
                <input
                  id="reminderEnabled"
                  type="checkbox"
                  name="reminderEnabled"
                  checked={form.reminderEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {form.reminderEnabled && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Remind Me</label>
                  <select
                    name="reminderTime"
                    value={form.reminderTime}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15 minutes before">15 minutes before</option>
                    <option value="30 minutes before">30 minutes before</option>
                    <option value="1 hour before">1 hour before</option>
                    <option value="2 hours before">2 hours before</option>
                    <option value="1 day before">1 day before</option>
                    <option value="Day of appointment (08:00 AM)">Day of appointment (08:00 AM)</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Symptoms / Notes</label>
              <textarea
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                rows="2"
                placeholder="Describe your health symptoms or notes for the doctor..."
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
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookAppointmentModal;
