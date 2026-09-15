import { GoalCard } from "@/components/GoalCard";
import { MetricCards } from "@/components/MetricCards";
import { RegistrationsChart } from "@/components/RegistrationsChart";

export function MetasPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <GoalCard />
      <MetricCards />
      <RegistrationsChart />
    </div>
  );
}
