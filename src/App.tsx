import { Sidebar } from "@/components/Sidebar";
import { GoalCard } from "@/components/GoalCard";
import { MetricCards } from "@/components/MetricCards";
import { RegistrationsChart } from "@/components/RegistrationsChart";
import { RecruitmentFunnel } from "@/components/RecruitmentFunnel";

export default function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-8 lg:px-12 lg:pt-8">
        <div className="flex w-full flex-col gap-6">
          <GoalCard />
          <MetricCards />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RegistrationsChart />
            <RecruitmentFunnel />
          </div>
        </div>
      </main>
    </div>
  );
}
