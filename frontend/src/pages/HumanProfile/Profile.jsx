import DashboardLayout from "../../components/layout/DashboardLayout";
import ProfileDashboard from "../../components/profile/ProfileDashboard";

function Profile() {
  return (
    <DashboardLayout title="My Profile">
      <ProfileDashboard />
    </DashboardLayout>
  );
}

export default Profile;
