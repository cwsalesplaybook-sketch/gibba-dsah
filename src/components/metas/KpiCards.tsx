import { BarChart3, UserCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox, DeltaBadge } from "@/components/metas/parts";
import type { MetasData } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

function formatDecimal(value: number) {
  return value.toFixed(1).replace(".", ",");
}

type Kpi = {
  label: string;
  value: string;
  delta: number | null;
  goalLabel: string;
  goalValue: string;
  icon: typeof Users;
  tone: "pink" | "mint" | "violet";
};

export function KpiCards({ data }: { data: MetasData }) {
  const { date, targets, extra } = data;

  const kpis: Kpi[] = [
    {
      label: "Representantes cadastrados",
      value: String(data.registered),
      delta: data.projectionDelta,
      goalLabel: "Meta do mês",
      goalValue: String(targets[0]),
      icon: Users,
      tone: "pink",
    },
    {
      label: "Cadastros no mês",
      value: String(extra.cadastrosMes),
      delta: extra.cadastrosMesDelta,
      goalLabel: "Meta do mês",
      goalValue: String(targets[1]),
      icon: UserCheck,
      tone: "mint",
    },
    {
      label: "Média diária",
      value: formatDecimal(data.dailyAvg),
      delta: data.dailyAvgDelta,
      goalLabel: "Meta diária",
      goalValue: formatDecimal(targets[0] / date.daysInMonth),
      icon: BarChart3,
      tone: "violet",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className={cn("px-5 pb-3.5 pt-3.5", `kpi-${kpi.tone}`)}>
            <div className="flex items-center gap-3.5">
              <IconBox size="md" tone={kpi.tone}>
                <Icon className="h-5 w-5" />
              </IconBox>
              <p className="min-w-0 flex-1 truncate text-[15px] font-medium">{kpi.label}</p>
            </div>

            <div className="mt-2 flex items-stretch gap-5">
              <div className="flex-1">
                <p className="text-[28px] font-bold leading-9">{kpi.value}</p>
                {kpi.delta !== null && (
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <DeltaBadge value={kpi.delta} plain />
                    <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                  </div>
                )}
              </div>
              <div className="flex w-[110px] shrink-0 flex-col justify-center border-l border-border pl-5">
                <p className="text-xs text-muted-foreground">{kpi.goalLabel}</p>
                <p className="mt-1 text-lg font-bold">{kpi.goalValue}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
