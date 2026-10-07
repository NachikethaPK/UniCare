import { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AppointmentHeader from "../../components/appointments/AppointmentHeader";
import AppointmentStats from "../../components/appointments/AppointmentStats";
import SearchDoctors from "../../components/appointments/SearchDoctors";
import DoctorCard from "../../components/appointments/DoctorCard";
import UpcomingAppointments from "../../components/appointments/UpcomingAppointments";
import AppointmentHistory from "../../components/appointments/AppointmentHistory";
import BookAppointmentModal from "../../components/appointments/BookAppointmentModal";
import AddDoctorModal from "../../components/appointments/AddDoctorModal";
import { useAppointments } from "../../context/AppointmentContext";

function Appointments() {
  const { customDoctors } = useAppointments();
  const [openModal, setOpenModal] = useState(false);
  const [openAddDoctorModal, setOpenAddDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [speciality, setSpeciality] = useState("");

  const defaultDoctors = [
    {
      id: "default-1",
      name: "Dr. Ananya Rao",
      speciality: "Cardiologist",
      experience: "12 Years",
      rating: 4.9,
    },
    {
      id: "default-2",
      name: "Dr. Vivek Sharma",
      speciality: "Dermatologist",
      experience: "9 Years",
      rating: 4.8,
    },
    {
      id: "default-3",
      name: "Dr. Sneha Kapoor",
      speciality: "Neurologist",
      experience: "15 Years",
      rating: 5.0,
    },
  ];

  const allDoctors = useMemo(() => {
    return [...defaultDoctors, ...customDoctors];
  }, [customDoctors]);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      const matchesSearch = doctor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesSpeciality =
        speciality === "" || doctor.speciality === speciality;

      return matchesSearch && matchesSpeciality;
    });
  }, [allDoctors, searchTerm, speciality]);

  const handleBookForDoctor = (doctorName) => {
    setSelectedDoctor(doctorName);
    setOpenModal(true);
  };

  return (
    <DashboardLayout title="Appointments">
      <AppointmentHeader
        onBook={() => { setSelectedDoctor(""); setOpenModal(true); }}
        onAddDoctor={() => setOpenAddDoctorModal(true)}
      />

      <AppointmentStats />

      <SearchDoctors
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        speciality={speciality}
        setSpeciality={setSpeciality}
      />

      <DoctorCard
        doctors={filteredDoctors}
        onBookDoctor={handleBookForDoctor}
        onAddDoctor={() => setOpenAddDoctorModal(true)}
      />

      <UpcomingAppointments />

      <AppointmentHistory />

      <BookAppointmentModal
        open={openModal}
        selectedDoctor={selectedDoctor}
        onClose={() => setOpenModal(false)}
        onOpenAddDoctor={() => setOpenAddDoctorModal(true)}
      />

      <AddDoctorModal
        open={openAddDoctorModal}
        onClose={() => setOpenAddDoctorModal(false)}
      />
    </DashboardLayout>
  );
}

export default Appointments;
