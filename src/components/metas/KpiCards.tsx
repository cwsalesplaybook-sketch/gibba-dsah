import { BarChart3, UserCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox, DeltaBadge } from "@/components/metas/parts";
import type { MetasData } from "@/lib/useMetasData";

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
    },
    {
      label: "Cadastros no mês",
      value: String(extra.cadastrosMes),
      delta: extra.cadastrosMesDelta,
      goalLabel: "Meta do mês",
      goalValue: String(targets[1]),
      icon: UserCheck,
    },
    {
      label: "Média diária",
      value: formatDecimal(data.dailyAvg),
      delta: data.dailyAvgDelta,
      goalLabel: "Meta diária",
      goalValue: formatDecimal(targets[0] / date.daysInMonth),
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className="px-5 pb-4 pt-4">
            <div className="flex items-center gap-3">
              <IconBox size="md">
                <Icon className="h-[18px] w-[18px]" />
              </IconBox>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
                {kpi.label}
              </p>
            </div>

            <div className="mt-3 flex items-stretch gap-5">
              <div className="flex-1">
                <p className="text-[28px] font-semibold leading-9">{kpi.value}</p>
                {kpi.delta !== null && (
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <DeltaBadge value={kpi.delta} plain />
                    <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                  </div>
                )}
              </div>
              <div className="flex w-[110px] shrink-0 flex-col justify-center border-l border-border pl-5">
                <p className="text-xs text-muted-foreground">{kpi.goalLabel}</p>
                <p className="mt-0.5 text-lg font-semibold">{kpi.goalValue}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
