import { FaHistory, FaCheckCircle } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";

function AppointmentHistory() {
  const { appointments } = useAppointments();
  const history = appointments.filter((item) => ["Completed", "Cancelled"].includes(item.status));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <FaHistory className="text-blue-600 text-2xl" />
        <h2 className="text-2xl font-bold">Appointment History</h2>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-5 flex justify-between items-center hover:border-blue-500 transition"
          >
            <div>
              <h3 className="font-semibold">{item.doctor}</h3>
              <p className="text-gray-500">{item.speciality}</p>
              <p className="text-sm text-gray-400 mt-1">{item.date}</p>
            </div>

            <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${item.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              <FaCheckCircle />
              {item.status}
            </span>
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-gray-500">No completed or cancelled appointments.</p>}
      </div>
    </div>
  );
}

export default AppointmentHistory;
