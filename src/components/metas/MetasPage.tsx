import { useMetasData } from "@/lib/useMetasData";
import { MetasHeader } from "@/components/metas/MetasHeader";
import { MetasDoMes } from "@/components/metas/MetasDoMes";
import { KpiCards } from "@/components/metas/KpiCards";
import { EvolutionChart } from "@/components/metas/EvolutionChart";
import { NextActions } from "@/components/metas/NextActions";

export function MetasPage() {
  const data = useMetasData();

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <MetasHeader date={data.date} />
      <MetasDoMes data={data} />
      <KpiCards data={data} />
      <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,930fr)_minmax(0,428fr)]">
        <EvolutionChart data={data} />
        <NextActions data={data} />
      </div>
    </div>
  );
}
