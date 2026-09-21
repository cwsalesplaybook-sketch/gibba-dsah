import { useId, useState } from "react";
import {
  Calendar,
  CalendarDays,
  Pencil,
  RefreshCw,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { IconBox, DeltaBadge, StatusPill } from "@/components/metas/parts";
import { inicioMetaInfo } from "@/data/mockData";
import type { MetasData } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

const metaIcons = { users: Users, calendar: CalendarDays, target: Target };
const metaTones = ["pink", "coral", "pink"] as const;

function Ring({ percent, size = 112 }: { percent: number; size?: number }) {
  const id = useId();
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(72% 0.2 350)" />
            <stop offset="100%" stopColor="oklch(62% 0.23 8)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          style={{ filter: "drop-shadow(0 4px 6px oklch(62% 0.22 355 / 0.35))" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[22px] font-bold">
        {percent}%
      </span>
    </div>
  );
}

function MetaCard({
  index,
  target,
  count,
}: {
  index: number;
  target: number;
  count: number;
}) {
  const info = inicioMetaInfo[index];
  const Icon = metaIcons[info.icon];
  const percent = Math.round((count / target) * 100);
  const remaining = Math.max(0, target - count);

  return (
    <div className="rounded-[20px] border border-border/80 bg-[oklch(97.8%_0.011_339)] px-5 pb-3.5 pt-3.5 shadow-card">
      <div className="flex items-center gap-4">
        <IconBox tone={metaTones[index]}>
          <Icon className="h-[22px] w-[22px]" />
        </IconBox>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold">{info.title}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{info.subtitle}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-6 xl:gap-9">
        <Ring percent={percent} />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch py-1">
          <div>
            <p className="text-xs text-muted-foreground">Alcançados</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="text-lg font-bold text-foreground">{count}</span> de{" "}
              <span className="text-lg font-bold text-foreground">{target}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">Faltam</p>
              <p className="mt-1 text-lg font-bold">{remaining}</p>
            </div>
            <StatusPill>{remaining === 0 ? "Atingida" : "Em andamento"}</StatusPill>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ data, onClose }: { data: MetasData; onClose: () => void }) {
  const [targets, setTargets] = useState(data.targets);
  const [manual, setManual] = useState(data.manualAdjustment);
  const [extra, setExtra] = useState(data.extra);

  function save() {
    data.setGoal({
      ...data.goal,
      tiers: data.goal.tiers.map((tier, i) => ({ ...tier, target: targets[i] ?? tier.target })),
    });
    data.setManualAdjustment(manual);
    data.setExtra(extra);
    onClose();
  }

  return (
    <Modal
      title="Editar metas do mês"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={save}>Salvar</Button>
        </>
      }
    >
      {targets.map((target, i) => (
        <Field
          key={i}
          label={`${inicioMetaInfo[i].title} — ${inicioMetaInfo[i].subtitle} (objetivo)`}
          type="number"
          value={target}
          onChange={(e) =>
            setTargets((prev) => prev.map((t, j) => (j === i ? Number(e.target.value) : t)))
          }
        />
      ))}
      <Field
        label="Meta 1 · ajuste manual (soma com a contagem do Pipedrive)"
        type="number"
        value={manual}
        onChange={(e) => setManual(Number(e.target.value))}
      />
      <Field
        label="Meta 2 · cadastros no sistema alcançados"
        type="number"
        value={extra.sistema}
        onChange={(e) => setExtra({ ...extra, sistema: Number(e.target.value) })}
      />
      <Field
        label="Meta 3 · ativações alcançadas"
        type="number"
        value={extra.ativacoes}
        onChange={(e) => setExtra({ ...extra, ativacoes: Number(e.target.value) })}
      />
      <Field
        label='Card "Cadastros no mês" · valor'
        type="number"
        value={extra.cadastrosMes}
        onChange={(e) => setExtra({ ...extra, cadastrosMes: Number(e.target.value) })}
      />
      <Field
        label='Card "Cadastros no mês" · variação vs. mês anterior (%)'
        type="number"
        step="0.1"
        value={extra.cadastrosMesDelta}
        onChange={(e) => setExtra({ ...extra, cadastrosMesDelta: Number(e.target.value) })}
      />
    </Modal>
  );
}

export function MetasDoMes({ data }: { data: MetasData }) {
  const [editing, setEditing] = useState(false);
  const { loading, error, refresh } = data.pipedrive;
  const allReached = data.counts.every((count, i) => count >= data.targets[i]);
  const { date } = data;

  // Só aparecem ao passar o mouse (ou sempre, em telas de toque).
  const hoverBtn =
    "flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition hover:text-primary focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

  return (
    <Card className="group border-primary/10 bg-[oklch(99.2%_0.005_320)] px-5 pb-4 pt-3.5">
      <div className="flex min-h-10 flex-wrap items-center gap-3">
        <IconBox size="md">
          <Target className="h-5 w-5" />
        </IconBox>
        <h2 className="whitespace-nowrap text-lg font-semibold">Metas do mês</h2>
        <StatusPill variant="soft">{allReached ? "Concluídas" : "Em andamento"}</StatusPill>
        <button onClick={refresh} aria-label="Atualizar dados do Pipedrive" className={hoverBtn}>
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </button>
        <button onClick={() => setEditing(true)} aria-label="Editar metas" className={hoverBtn}>
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error} — mostrando só o ajuste manual até reconectar.
        </p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {data.targets.map((target, i) => (
          <MetaCard key={i} index={i} target={target} count={data.counts[i]} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[20px] border border-border/80 bg-[oklch(97.2%_0.011_339)] px-5 py-3 shadow-card">
          <IconBox>
            <Rocket className="h-[22px] w-[22px]" />
          </IconBox>
          <div>
            <p className="text-xs leading-4 text-muted-foreground">Projeção final</p>
            <p className="mt-0.5 text-lg font-semibold leading-6">{data.projection} cadastros</p>
          </div>
          {data.projectionDelta !== null && (
            <div className="flex items-center gap-3">
              <DeltaBadge value={data.projectionDelta} />
              <span className="text-xs text-muted-foreground">vs. mês anterior</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[20px] border border-border/80 bg-[oklch(97.2%_0.011_339)] px-5 py-3 shadow-card">
          <IconBox>
            <Calendar className="h-[22px] w-[22px]" />
          </IconBox>
          <div>
            <p className="text-xs leading-4 text-muted-foreground">Dias restantes</p>
            <p className="mt-0.5 text-lg font-semibold leading-6">{date.daysLeft} dias</p>
          </div>
          <div className="h-2.5 min-w-20 flex-1 overflow-hidden rounded-full bg-[oklch(95%_0.025_330)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[oklch(72%_0.2_350)] to-[oklch(62%_0.23_340)]"
              style={{ width: `${Math.round((date.daysLeft / date.daysInMonth) * 100)}%` }}
            />
          </div>
          <p className="flex items-center gap-1.5 whitespace-nowrap text-xs">
            <Calendar className="h-3.5 w-3.5 text-primary-deep" />
            Hoje é {date.day} de {date.monthName}
          </p>
        </div>
      </div>

      {editing && <EditModal data={data} onClose={() => setEditing(false)} />}
    </Card>
  );
}
