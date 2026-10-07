import DashboardLayout from "../../components/layout/DashboardLayout";
import PetHealthcareDashboard from "../../components/petHealthcare/PetHealthcareDashboard";

function PetDashboard() {
  return (
    <DashboardLayout title="Pet Healthcare">
      <PetHealthcareDashboard />
    </DashboardLayout>
  );
}

export default PetDashboard;
