import DashboardLayout from "../../components/layout/DashboardLayout";
import HealthRecordsDashboard from "../../components/healthRecords/HealthRecordsDashboard";

function HealthRecords() {
  return (
    <DashboardLayout title="Health Records">
      <HealthRecordsDashboard />
    </DashboardLayout>
  );
}

export default HealthRecords;
