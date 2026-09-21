import { Activity, BarChart3, TrendingUp, UserCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox, DeltaBadge } from "@/components/inicio/parts";
import type { InicioData } from "@/lib/useInicioData";

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
  cornerIcon: typeof Users;
};

export function KpiCards({ data }: { data: InicioData }) {
  const { date, targets, extra } = data;

  const kpis: Kpi[] = [
    {
      label: "Representantes cadastrados",
      value: String(data.registered),
      delta: data.projectionDelta,
      goalLabel: "Meta do mês",
      goalValue: String(targets[0]),
      icon: Users,
      cornerIcon: TrendingUp,
    },
    {
      label: "Cadastros no mês",
      value: String(extra.cadastrosMes),
      delta: extra.cadastrosMesDelta,
      goalLabel: "Meta do mês",
      goalValue: String(targets[1]),
      icon: UserCheck,
      cornerIcon: TrendingUp,
    },
    {
      label: "Média diária",
      value: formatDecimal(data.dailyAvg),
      delta: data.dailyAvgDelta,
      goalLabel: "Meta diária",
      goalValue: formatDecimal(targets[0] / date.daysInMonth),
      icon: BarChart3,
      cornerIcon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] md:grid-cols-[434fr_456fr_449fr]">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const Corner = kpi.cornerIcon;
        return (
          <Card key={kpi.label} className="px-5 pb-4 pt-3">
            <div className="flex items-center gap-4">
              <IconBox size="md">
                <Icon className="h-[18px] w-[18px]" />
              </IconBox>
              <p className="min-w-0 flex-1 truncate text-[13px] font-medium">{kpi.label}</p>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/35 text-primary-glow">
                <Corner className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mt-2 flex items-stretch gap-5">
              <div className="flex-1">
                <p className="text-[30px] font-bold leading-9">{kpi.value}</p>
                {kpi.delta !== null && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-9 gap-y-1">
                    <DeltaBadge value={kpi.delta} plain />
                    <span className="text-[11px] text-muted-foreground">vs. mês anterior</span>
                  </div>
                )}
              </div>
              <div className="flex w-[111px] shrink-0 flex-col justify-center border-l border-border pl-[26px]">
                <p className="text-[11px] text-muted-foreground">{kpi.goalLabel}</p>
                <p className="mt-1 text-base font-bold">{kpi.goalValue}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
