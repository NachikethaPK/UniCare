import DashboardLayout from "../../components/layout/DashboardLayout";
import AIAssistantDashboard from "../../components/aiAssistant/AIAssistantDashboard";

function AIAssistant() {
  return (
    <DashboardLayout title="AI Health Assistant">
      <AIAssistantDashboard />
    </DashboardLayout>
  );
}

export default AIAssistant;
