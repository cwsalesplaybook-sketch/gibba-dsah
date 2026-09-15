import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GoalCard } from "@/components/GoalCard";
import { MetricCards } from "@/components/MetricCards";
import { RegistrationsChart } from "@/components/RegistrationsChart";
import { RecruitmentFunnel } from "@/components/RecruitmentFunnel";
import { RepresentativesTable } from "@/components/RepresentativesTable";
import { ChannelAcquisitionChart } from "@/components/ChannelAcquisitionChart";

export default function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <DashboardHeader />
          <GoalCard />
          <MetricCards />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RegistrationsChart />
            <RecruitmentFunnel />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RepresentativesTable />
            <ChannelAcquisitionChart />
          </div>
        </div>
      </main>
    </div>
  );
}
