import { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";

function BookAppointment() {
  const { addAppointment } = useAppointments();
  const [form, setForm] = useState({
    doctor: "",
    speciality: "",
    date: "",
    time: "",
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();
    addAppointment(form);
    alert("Appointment Booked Successfully");
    setForm({ doctor: "", speciality: "", date: "", time: "" });
  };

  return (
    <div className="appointment-form">
      <h2>Book Appointment</h2>

      <form onSubmit={submit}>
        <input
          name="doctor"
          placeholder="Doctor Name"
          value={form.doctor}
          onChange={handleChange}
          required
        />

        <input
          name="speciality"
          placeholder="Speciality"
          value={form.speciality}
          onChange={handleChange}
          required
        />

        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <input type="time" name="time" value={form.time} onChange={handleChange} required />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default BookAppointment;
