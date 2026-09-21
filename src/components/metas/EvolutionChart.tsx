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
import { IconBox } from "@/components/metas/parts";
import type { MetasData } from "@/lib/useMetasData";

type LabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: number | string;
  index?: number;
};

export function EvolutionChart({ data }: { data: MetasData }) {
  const { chartData } = data;
  const { loading, error } = data.pipedrive;

  const highest = Math.max(0, ...chartData.flatMap((item) => [item.value, item.goal]));
  const top = Math.max(60, Math.ceil(highest / 15) * 15);
  const ticks = Array.from({ length: top / 15 + 1 }, (_, i) => i * 15);

  // Meses sem cadastro não ganham rótulo (evita uma fileira de "0").
  function renderLabel({ x, y, width, value }: LabelProps) {
    if (!value) return null;
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - 7}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        {value}
      </text>
    );
  }

  return (
    <Card className="flex h-full flex-col bg-[oklch(98.4%_0.01_322)] px-5 pb-3 pt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <IconBox size="md">
            <BarChart3 className="h-5 w-5" />
          </IconBox>
          <div className="leading-tight">
            <h2 className="text-base font-semibold">Evolução de cadastros</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Representantes cadastrados por mês (Pipedrive)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[4px] bg-gradient-to-b from-[oklch(80%_0.15_340)] to-[oklch(68%_0.2_350)]" />
            Cadastros
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 border-t-2 border-dashed border-primary" /> Meta
          </span>
          <span className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-primary/25">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Mês atual
          </span>
        </div>
      </div>

      <div className="mt-2 min-h-[210px] flex-1">
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
            <ComposedChart data={chartData} margin={{ top: 14, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="barPast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(83% 0.13 340)" />
                  <stop offset="100%" stopColor="oklch(74% 0.17 336)" />
                </linearGradient>
                <linearGradient id="barNow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(76% 0.18 345)" />
                  <stop offset="100%" stopColor="oklch(66% 0.22 352)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border)"
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
                  boxShadow: "var(--shadow-card)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value, name) => [value, name === "goal" ? "Meta" : "Cadastros"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={34} isAnimationActive={false}>
                {chartData.map((item) => (
                  <Cell
                    key={item.month}
                    fill={item.current ? "url(#barNow)" : "url(#barPast)"}
                    style={
                      item.current
                        ? { filter: "drop-shadow(0 6px 8px oklch(62% 0.22 355 / 0.4))" }
                        : undefined
                    }
                  />
                ))}
                <LabelList dataKey="value" content={renderLabel} />
              </Bar>
              <Line
                type="monotone"
                dataKey="goal"
                stroke="oklch(70% 0.213 348)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                isAnimationActive={false}
                dot={{ r: 3.5, fill: "oklch(70% 0.213 348)", stroke: "none" }}
                activeDot={{ r: 5, fill: "var(--primary)", stroke: "white", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
