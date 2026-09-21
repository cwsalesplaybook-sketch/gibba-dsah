import { BarChart3 } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/inicio/parts";
import type { InicioData } from "@/lib/useInicioData";

type LabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: number | string;
  index?: number;
};

export function EvolutionChart({ data }: { data: InicioData }) {
  const { chartData } = data;
  const { loading, error } = data.pipedrive;

  const highest = Math.max(0, ...chartData.flatMap((item) => [item.value, item.goal]));
  const top = Math.max(60, Math.ceil(highest / 15) * 15);
  const ticks = Array.from({ length: top / 15 + 1 }, (_, i) => i * 15);

  function renderLabel({ x, y, width, value, index }: LabelProps) {
    const isCurrent = chartData[index ?? -1]?.current;
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - 8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={isCurrent ? 700 : 400}
        fill={isCurrent ? "var(--foreground)" : "var(--muted-foreground)"}
      >
        {value}
      </text>
    );
  }

  return (
    <Card className="flex h-full flex-col px-5 pb-3 pt-[15px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBox size="sm">
            <BarChart3 className="h-4 w-4" />
          </IconBox>
          <div className="leading-tight">
            <h2 className="text-sm font-semibold">Evolução de cadastros</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Representantes cadastrados por mês (Pipedrive)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-primary" /> Cadastros
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 border-t border-dashed border-primary" /> Meta
          </span>
          <span className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-primary/30">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Mês atual
          </span>
        </div>
      </div>

      <div className="mt-2 min-h-[196px] flex-1">
        {error ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading && chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Carregando dados do Pipedrive...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="barPast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.42} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="barNow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(73% 0.17 351)" />
                  <stop offset="100%" stopColor="var(--primary)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border)"
                strokeOpacity={0.7}
                strokeDasharray="3 4"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                domain={[0, top]}
                ticks={ticks}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                width={44}
              />
              <Tooltip
                cursor={{ fill: "var(--primary)", fillOpacity: 0.06 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value, name) => [value, name === "goal" ? "Meta" : "Cadastros"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={false}>
                {chartData.map((item) => (
                  <Cell
                    key={item.month}
                    fill={item.current ? "url(#barNow)" : "url(#barPast)"}
                    style={item.current ? { filter: "drop-shadow(0 0 10px var(--primary))" } : undefined}
                  />
                ))}
                <LabelList dataKey="value" content={renderLabel} />
              </Bar>
              <Line
                type="monotone"
                dataKey="goal"
                stroke="var(--primary)"
                strokeOpacity={0.75}
                strokeWidth={1.25}
                strokeDasharray="4 3"
                isAnimationActive={false}
                dot={{ r: 3.5, fill: "var(--primary)", stroke: "none" }}
                activeDot={{ r: 5, fill: "var(--primary-glow)", stroke: "none" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
