import DashboardLayout from "../../components/layout/DashboardLayout";
import PetHealthcareDashboard from "../../components/petHealthcare/PetHealthcareDashboard";

function PetMedicalRecords() {
  return (
    <DashboardLayout title="Pet Medical Records">
      <PetHealthcareDashboard />
    </DashboardLayout>
  );
}

export default PetMedicalRecords;
