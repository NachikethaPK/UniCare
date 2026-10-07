import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Appointments from "../pages/Appointments/Appointments";
import HealthRecords from "../pages/HealthRecords/HealthRecords";
import BloodDonation from "../pages/BloodDonation/BloodDonation";
import PetDashboard from "../pages/PetProfile/PetDashboard";
import AIAssistant from "../pages/AIAssistant/AIAssistant";
import Profile from "../pages/HumanProfile/Profile";

function AppRoutes() {
  return (
    <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard & Features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/records" element={<HealthRecords />} />
        <Route path="/blood" element={<BloodDonation />} />
        <Route path="/pets" element={<PetDashboard />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/profile" element={<Profile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
