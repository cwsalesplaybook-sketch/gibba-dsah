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

const PAST_BAR = "oklch(86% 0.045 356)";
const GOAL_LINE = "oklch(48% 0.03 330)";

export function EvolutionChart({ data }: { data: MetasData }) {
  const { dailyChartData: chartData } = data;
  const { loading, error } = data.pipedrive;

  const highest = Math.max(0, ...chartData.flatMap((item) => [item.value, item.goal]));
  // Escala pequena (a maioria dos dias tem 0 a poucos cadastros), diferente da versão
  // mensal antiga: degraus de 1 quando o pico é baixo, maiores só se necessário.
  const step = highest <= 5 ? 1 : highest <= 10 ? 2 : highest <= 20 ? 5 : 10;
  const top = Math.max(step, Math.ceil(highest / step) * step);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  // Muitos dias no mês: mostra só ~10 rótulos no eixo X pra não amontoar.
  const tickInterval = Math.max(0, Math.ceil(chartData.length / 10) - 1);

  // Dias sem cadastro não ganham rótulo (evita uma fileira de "0").
  function renderLabel({ x, y, width, value }: LabelProps) {
    if (!value) return null;
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - 8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="var(--foreground)"
        stroke="white"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {value}
      </text>
    );
  }

  return (
    <Card className="flex h-full flex-col px-5 pb-3 pt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBox size="md">
            <BarChart3 className="h-[18px] w-[18px]" />
          </IconBox>
          <div className="leading-tight">
            <h2 className="text-base font-semibold">Evolução de cadastros</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Seus cadastros por dia, mês atual (Pipedrive)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PAST_BAR }} />
            Cadastros
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 border-t border-dashed" style={{ borderColor: GOAL_LINE }} /> Ritmo necessário
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Hoje
          </span>
        </div>
      </div>

      <div className="relative mt-2 min-h-[210px] flex-1">
        {error ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading && chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Carregando dados do Pipedrive...
          </div>
        ) : (
          <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 14, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="day"
                interval={tickInterval}
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
                cursor={{ fill: "var(--muted)", fillOpacity: 0.6 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--popover-foreground)",
                  boxShadow: "var(--shadow-card)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value, name) => [
                  typeof value === "number" && name === "goal" ? value.toFixed(1).replace(".", ",") : value,
                  name === "goal" ? "Ritmo necessário" : "Cadastros",
                ]}
                labelFormatter={(label) => `Dia ${label}`}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false}>
                {chartData.map((item) => (
                  <Cell key={item.day} fill={item.current ? "var(--primary)" : PAST_BAR} />
                ))}
                <LabelList dataKey="value" content={renderLabel} />
              </Bar>
              <Line
                type="monotone"
                dataKey="goal"
                stroke={GOAL_LINE}
                strokeWidth={1.25}
                strokeDasharray="4 3"
                isAnimationActive={false}
                dot={{ r: 2.5, fill: GOAL_LINE, stroke: "none" }}
                activeDot={{ r: 4, fill: GOAL_LINE, stroke: "white", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
