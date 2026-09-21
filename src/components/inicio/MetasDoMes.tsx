import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Calendar,
  Pencil,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { IconBox, DeltaBadge, StatusPill } from "@/components/inicio/parts";
import { inicioMetaInfo } from "@/data/mockData";
import type { InicioData } from "@/lib/useInicioData";
import { cn } from "@/lib/utils";

const metaIcons = { users: Users, calendar: CalendarDays, target: Target };

function Ring({ percent, size = 116 }: { percent: number; size?: number }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(32% 0.058 320)"
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
          strokeDashoffset={circumference * (1 - clamped / 100)}
          style={{ filter: "drop-shadow(0 0 8px var(--primary))" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-medium text-[oklch(96.7%_0.029_326)]">
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
    <div className="rounded-2xl border border-border/80 bg-background/35 px-5 pb-3 pt-[13px]">
      <div className="flex h-10 items-center gap-[18px]">
        <IconBox>
          <Icon className="h-[22px] w-[22px]" />
        </IconBox>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold">{info.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{info.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 xl:gap-10">
        <Ring percent={percent} />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch py-1">
          <div>
            <p className="text-[11px] text-muted-foreground">Alcançados</p>
            <p className="mt-1.5 text-[13px] text-foreground/90">
              <span className="text-base font-bold text-foreground">{count}</span> de{" "}
              <span className="text-base font-bold text-foreground">{target}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1.5">
            <div>
              <p className="text-[11px] text-muted-foreground">Faltam</p>
              <p className="mt-1.5 text-base font-bold">{remaining}</p>
            </div>
            <StatusPill>{remaining === 0 ? "Atingida" : "Em andamento"}</StatusPill>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ data, onClose }: { data: InicioData; onClose: () => void }) {
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

export function MetasDoMes({
  data,
  onOpenMetas,
}: {
  data: InicioData;
  onOpenMetas: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const { loading, error, refresh } = data.pipedrive;
  const allReached = data.counts.every((count, i) => count >= data.targets[i]);
  const { date } = data;

  // Só aparecem ao passar o mouse (ou sempre, em telas de toque).
  const hoverBtn =
    "flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition hover:text-primary focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

  return (
    <Card className="group border-primary/30 px-[23px] pb-1.5 pt-3.5 shadow-[0_0_44px_-24px_var(--primary)]">
      <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBox size="sm">
            <Target className="h-4 w-4" />
          </IconBox>
          <h2 className="whitespace-nowrap text-lg font-semibold">Metas do mês</h2>
          <StatusPill tone="green">{allReached ? "Concluídas" : "Em andamento"}</StatusPill>
          <button onClick={refresh} aria-label="Atualizar dados do Pipedrive" className={hoverBtn}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>
          <button onClick={() => setEditing(true)} aria-label="Editar metas" className={hoverBtn}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={onOpenMetas}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-primary-glow hover:text-primary"
        >
          Ver todas as metas <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error} — mostrando só o ajuste manual até reconectar.
        </p>
      )}

      <div className="mt-3.5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {data.targets.map((target, i) => (
          <MetaCard key={i} index={i} target={target} count={data.counts[i]} />
        ))}
      </div>

      <div className="mt-[19px] flex flex-col rounded-2xl border border-border/80 bg-background/35 md:flex-row">
        <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-5 py-[13.5px]">
          <IconBox>
            <TrendingUp className="h-[22px] w-[22px]" />
          </IconBox>
          <div>
            <p className="text-[11px] leading-4 text-muted-foreground">Projeção final</p>
            <p className="mt-0.5 text-lg font-semibold leading-6">{data.projection} cadastros</p>
          </div>
          {data.projectionDelta !== null && (
            <div className="flex items-center gap-2.5 pl-1">
              <DeltaBadge value={data.projectionDelta} />
              <span className="text-[11px] text-muted-foreground">vs. mês anterior</span>
            </div>
          )}
        </div>

        <div className="border-t border-border/80 md:border-l md:border-t-0" />

        <div className="flex flex-1 items-center gap-4 px-5 py-[13.5px]">
          <IconBox>
            <Calendar className="h-[22px] w-[22px]" />
          </IconBox>
          <div>
            <p className="text-[11px] leading-4 text-muted-foreground">Dias restantes</p>
            <p className="mt-0.5 text-lg font-semibold leading-6">{date.daysLeft} dias</p>
          </div>
          <div className="min-w-24 flex-1">
            <p className="mb-2 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Hoje é {date.day} de {date.monthName}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-[oklch(30.6%_0.071_321)]">
              <div
                className="h-full rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
                style={{ width: `${Math.round((date.daysLeft / date.daysInMonth) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {editing && <EditModal data={data} onClose={() => setEditing(false)} />}
    </Card>
  );
}
