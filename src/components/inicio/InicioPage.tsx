import { useInicioData } from "@/lib/useInicioData";
import type { PageId } from "@/components/Sidebar";
import { InicioHeader } from "@/components/inicio/InicioHeader";
import { MetasDoMes } from "@/components/inicio/MetasDoMes";
import { KpiCards } from "@/components/inicio/KpiCards";
import { EvolutionChart } from "@/components/inicio/EvolutionChart";
import { NextActions } from "@/components/inicio/NextActions";

export function InicioPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const data = useInicioData();

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <InicioHeader date={data.date} onOpenAvisos={() => onNavigate("avisos")} />
      <MetasDoMes data={data} onOpenMetas={() => onNavigate("metas")} />
      <KpiCards data={data} />
      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] xl:grid-cols-[minmax(0,930fr)_minmax(0,428fr)]">
        <EvolutionChart data={data} />
        <NextActions data={data} onOpenMetas={() => onNavigate("metas")} />
      </div>
    </div>
  );
}
