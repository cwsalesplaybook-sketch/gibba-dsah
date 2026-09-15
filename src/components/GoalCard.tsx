import { Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { goal } from "@/data/mockData";

function GoalRing({ percent }: { percent: number }) {
  const size = 168;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 12px var(--primary))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-primary">{percent}%</span>
        <span className="text-sm text-muted-foreground">da meta</span>
      </div>
    </div>
  );
}

export function GoalCard() {
  return (
    <Card>
      <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center">
        <GoalRing percent={goal.percent} />
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Target className="h-3.5 w-3.5" />
            Meta do mês
          </div>
          <h2 className="text-xl font-bold sm:text-2xl">
            {goal.current} de {goal.target} representantes cadastrados
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Faltam <span className="font-semibold text-foreground">{goal.remaining} cadastros</span> em{" "}
            {goal.daysLeft} dias. Ritmo necessário:{" "}
            <span className="font-semibold text-foreground">{goal.paceNeeded}/dia</span>.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <p className="text-xs text-muted-foreground">Hoje</p>
              <p className="text-lg font-bold">{goal.today}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <p className="text-xs text-muted-foreground">Semana</p>
              <p className="text-lg font-bold">{goal.week}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <p className="text-xs text-muted-foreground">Média diária</p>
              <p className="text-lg font-bold">{goal.dailyAverage.toString().replace(".", ",")}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
