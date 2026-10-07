import DashboardLayout from "../../components/layout/DashboardLayout";
import BloodDonationDashboard from "../../components/bloodDonation/BloodDonationDashboard";

function BloodDonation() {
  return (
    <DashboardLayout title="Blood Donation">
      <BloodDonationDashboard />
    </DashboardLayout>
  );
}

export default BloodDonation;
