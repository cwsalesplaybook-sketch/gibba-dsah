import { useMetasData } from "@/lib/useMetasData";
import { MetasDoMes } from "@/components/metas/MetasDoMes";
import { KpiCards } from "@/components/metas/KpiCards";
import { EvolutionChart } from "@/components/metas/EvolutionChart";
import { ForecastCard } from "@/components/metas/ForecastCard";

export function MetasPage() {
  const data = useMetasData();

  return (
    <div className="flex w-full flex-1 flex-col gap-[18px]">
      <MetasDoMes data={data} />
      <KpiCards data={data} />
      {/* Ocupa todo o espaço que sobra até o fim da tela. */}
      <div className="grid flex-1 grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,930fr)_minmax(0,428fr)]">
        <EvolutionChart data={data} />
        <ForecastCard data={data} />
      </div>
    </div>
  );
}
