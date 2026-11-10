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
import PersonalDetails from "../pages/PersonalDetails/PersonalDetails";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Healthcare Features & Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <HealthRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blood"
        element={
          <ProtectedRoute>
            <BloodDonation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blood-donation"
        element={
          <ProtectedRoute>
            <BloodDonation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets"
        element={
          <ProtectedRoute>
            <PetDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pet-dashboard"
        element={
          <ProtectedRoute>
            <PetDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIAssistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <AIAssistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal-details"
        element={
          <ProtectedRoute>
            <PersonalDetails />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
