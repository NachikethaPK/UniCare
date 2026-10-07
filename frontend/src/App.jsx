import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { HealthRecordProvider } from "./context/HealthRecordContext";
import { BloodDonationProvider } from "./context/BloodDonationContext";
import { PetProvider } from "./context/PetContext";
import { AIProvider } from "./context/AIContext";
import { ProfileProvider } from "./context/ProfileContext";
import { FamilyProvider } from "./context/FamilyContext";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FamilyProvider>
            <AppointmentProvider>
              <HealthRecordProvider>
                <BloodDonationProvider>
                  <PetProvider>
                    <AIProvider>
                      <ProfileProvider>
                        <AppRoutes />
                      </ProfileProvider>
                    </AIProvider>
                  </PetProvider>
                </BloodDonationProvider>
              </HealthRecordProvider>
            </AppointmentProvider>
          </FamilyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
