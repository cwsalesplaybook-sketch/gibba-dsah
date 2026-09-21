import { LineChart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/metas/parts";
import { inicioMetaInfo } from "@/data/mockData";
import type { MetasData } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

function formatDecimal(value: number) {
  return value.toFixed(1).replace(".", ",");
}

// Forecast: onde cada meta deve fechar o mês se o ritmo atual for mantido.
export function ForecastCard({ data }: { data: MetasData }) {
  const { daysElapsed, daysLeft } = data.date;

  const rows = data.targets.map((target, i) => {
    const count = data.counts[i];
    const pace = count / daysElapsed;
    // Mesma projeção linear usada no painel "Projeção final".
    const projected = Math.round(count + pace * (daysLeft - 1));
    const remaining = Math.max(0, target - count);
    const needed = remaining / daysLeft;
    return {
      key: i,
      title: inicioMetaInfo[i].title,
      subtitle: inicioMetaInfo[i].subtitle,
      target,
      count,
      projected,
      pace,
      needed,
      reached: remaining === 0,
      onTrack: remaining === 0 || projected >= target,
      currentPct: Math.min(100, Math.round((count / target) * 100)),
      projectedPct: Math.min(100, Math.round((projected / target) * 100)),
    };
  });
  const onTrackCount = rows.filter((row) => row.onTrack).length;

  return (
    <Card className="flex h-full flex-col px-5 pb-4 pt-4">
      <div className="flex items-center gap-3">
        <IconBox size="md">
          <LineChart className="h-[18px] w-[18px]" />
        </IconBox>
        <div className="flex-1 leading-tight">
          <h2 className="text-base font-semibold">Forecast</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Projeção de fechamento do mês no ritmo atual</p>
        </div>
        <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          {onTrackCount} de {rows.length} no ritmo
        </span>
      </div>

      <ul className="mt-3 flex flex-1 flex-col divide-y divide-border">
        {rows.map((row) => (
          <li key={row.key} className="flex flex-1 flex-col justify-center gap-2 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-[13px] font-medium">
                {row.title} <span className="font-normal text-muted-foreground">· {row.subtitle}</span>
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium",
                  row.onTrack ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}
              >
                {row.reached ? "Meta atingida" : row.onTrack ? "No ritmo" : "Abaixo da meta"}
              </span>
            </div>

            {/* Barra: realizado (sólido) + projeção (claro) até a meta. */}
            <div className="relative h-2 overflow-hidden rounded-full bg-[var(--track)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/30"
                style={{ width: `${row.projectedPct}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${row.currentPct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              <span>
                Projeção <span className="text-sm font-semibold text-foreground">{row.projected}</span> de{" "}
                {row.target}
              </span>
              <span>
                {row.reached
                  ? `Ritmo atual ${formatDecimal(row.pace)}/dia`
                  : `Ritmo ${formatDecimal(row.pace)}/dia · necessário ${formatDecimal(row.needed)}/dia`}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
