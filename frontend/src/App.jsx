import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { HealthRecordProvider } from "./context/HealthRecordContext";
import { BloodDonationProvider } from "./context/BloodDonationContext";
import { PetProvider } from "./context/PetContext";
import { AIProvider } from "./context/AIContext";
import { ProfileProvider } from "./context/ProfileContext";
import { FamilyProvider } from "./context/FamilyContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DoctorProvider } from "./context/DoctorContext";
import { HospitalProvider } from "./context/HospitalContext";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
        <AuthProvider>
          <FamilyProvider>
            <AppointmentProvider>
              <DoctorProvider>
                <HealthRecordProvider>
                  <BloodDonationProvider>
                    <HospitalProvider>
                      <PetProvider>
                        <AIProvider>
                          <ProfileProvider>
                            <AppRoutes />
                          </ProfileProvider>
                        </AIProvider>
                      </PetProvider>
                    </HospitalProvider>
                  </BloodDonationProvider>
                </HealthRecordProvider>
              </DoctorProvider>
            </AppointmentProvider>
          </FamilyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>
);
}

export default App;
