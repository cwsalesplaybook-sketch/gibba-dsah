import { useMetasData } from "@/lib/useMetasData";
import { MetasDoMes, MetasFooterInfo } from "@/components/metas/MetasDoMes";
import { KpiCards } from "@/components/metas/KpiCards";
import { EvolutionChart } from "@/components/metas/EvolutionChart";
import { ForecastCard } from "@/components/metas/ForecastCard";

const MONTH_LABEL: Record<string, string> = {
  janeiro: "Janeiro",
  fevereiro: "Fevereiro",
  março: "Março",
  abril: "Abril",
  maio: "Maio",
  junho: "Junho",
  julho: "Julho",
  agosto: "Agosto",
  setembro: "Setembro",
  outubro: "Outubro",
  novembro: "Novembro",
  dezembro: "Dezembro",
};

export function MetasPage() {
  const data = useMetasData();
  const { date } = data;

  return (
    <div className="flex w-full flex-1 flex-col gap-[18px]">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <p className="label-caps mb-1.5" style={{ color: "var(--pink-300)" }}>
            {MONTH_LABEL[date.monthName] ?? date.monthName} {date.year} · dia {date.day} de {date.daysInMonth}
          </p>
          <h1 className="m-0 text-[32px] leading-[0.95] sm:text-[40px]">Cadastro de novos representantes</h1>
        </div>
        <div className="whitespace-nowrap text-xs" style={{ color: "var(--ink-400)" }}>
          Pipedrive {data.pipedriveCount} + ajuste manual {data.manualAdjustment}
        </div>
      </header>

      <MetasDoMes data={data} />
      <MetasFooterInfo data={data} />
      <KpiCards data={data} />
      {/* Ocupa todo o espaço que sobra até o fim da tela. */}
      <div className="grid flex-1 grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,930fr)_minmax(0,428fr)]">
        <EvolutionChart data={data} />
        <ForecastCard data={data} />
      </div>
    </div>
  );
}
