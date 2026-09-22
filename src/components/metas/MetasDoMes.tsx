import { useState } from "react";
import {
  Calendar,
  CalendarDays,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Target,
  TrendingUp,
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

function Ring({ percent, size = 104 }: { percent: number; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--track)"
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
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
        {percent}%
      </span>
    </div>
  );
}

// Botões +1/-1 pra somar um cadastro na hora, sem abrir o lápis e reescrever o total.
function QuickAdjust({ onAdd, onSubtract }: { onAdd: () => void; onSubtract: () => void }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-border">
      <button
        onClick={onSubtract}
        aria-label="Tirar um"
        className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Minus className="h-3 w-3" />
      </button>
      <button
        onClick={onAdd}
        aria-label="Somar um agora"
        className="flex h-6 w-6 items-center justify-center border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function MetaCard({
  index,
  target,
  count,
  onAdd,
  onSubtract,
  pipedriveBreakdown,
}: {
  index: number;
  target: number;
  count: number;
  onAdd: () => void;
  onSubtract: () => void;
  pipedriveBreakdown?: { pipedriveCount: number; manualAdjustment: number; onReset: () => void };
}) {
  const info = inicioMetaInfo[index];
  const Icon = metaIcons[info.icon];
  const percent = Math.round((count / target) * 100);
  const remaining = Math.max(0, target - count);

  return (
    <div className="rounded-xl border border-border bg-background px-5 pb-4 pt-4">
      <div className="flex items-center gap-3.5">
        <IconBox>
          <Icon className="h-5 w-5" />
        </IconBox>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[15px] font-semibold">{info.title}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{info.subtitle}</p>
        </div>
        <QuickAdjust onAdd={onAdd} onSubtract={onSubtract} />
      </div>

      <div className="mt-4 flex items-center gap-6 xl:gap-8">
        <Ring percent={percent} />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch py-0.5">
          <div>
            <p className="text-xs text-muted-foreground">Alcançados</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              <span className="text-lg font-semibold text-foreground">{count}</span> de{" "}
              <span className="text-lg font-semibold text-foreground">{target}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">Faltam</p>
              <p className="mt-0.5 text-lg font-semibold">{remaining}</p>
            </div>
            <StatusPill>{remaining === 0 ? "Atingida" : "Em andamento"}</StatusPill>
          </div>
        </div>
      </div>

      {pipedriveBreakdown && (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            Pipedrive: <strong className="text-foreground">{pipedriveBreakdown.pipedriveCount}</strong>
          </span>
          <span>+</span>
          <span>
            ajuste manual:{" "}
            <strong className={cn("text-foreground", pipedriveBreakdown.manualAdjustment !== 0 && "text-primary-deep")}>
              {pipedriveBreakdown.manualAdjustment > 0 ? "+" : ""}
              {pipedriveBreakdown.manualAdjustment}
            </strong>
          </span>
          {pipedriveBreakdown.manualAdjustment !== 0 && (
            <button
              onClick={pipedriveBreakdown.onReset}
              className="ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-primary-deep hover:bg-accent"
            >
              <RotateCcw className="h-3 w-3" /> Zerar ajuste
            </button>
          )}
        </div>
      )}
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
          label={`${inicioMetaInfo[i].title}, ${inicioMetaInfo[i].subtitle} (objetivo)`}
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
        label="Meta 3 · ajuste manual (soma com a contagem do Pipedrive)"
        type="number"
        value={extra.ativacoesAjuste ?? 0}
        onChange={(e) => setExtra({ ...extra, ativacoesAjuste: Number(e.target.value) })}
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
    "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

  return (
    <Card className="group px-5 pb-5 pt-4">
      <div className="flex min-h-9 flex-wrap items-center gap-3">
        <IconBox size="md">
          <Target className="h-[18px] w-[18px]" />
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
          {error}, mostrando só o ajuste manual até reconectar.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {data.targets.map((target, i) => (
          <MetaCard
            key={i}
            index={i}
            target={target}
            count={data.counts[i]}
            onAdd={() => {
              if (i === 0) data.setManualAdjustment((prev) => prev + 1);
              else if (i === 1) data.setExtra((prev) => ({ ...prev, sistema: prev.sistema + 1 }));
              else data.setExtra((prev) => ({ ...prev, ativacoesAjuste: (prev.ativacoesAjuste ?? 0) + 1 }));
            }}
            onSubtract={() => {
              if (i === 0) data.setManualAdjustment((prev) => prev - 1);
              else if (i === 1) data.setExtra((prev) => ({ ...prev, sistema: Math.max(0, prev.sistema - 1) }));
              else data.setExtra((prev) => ({ ...prev, ativacoesAjuste: (prev.ativacoesAjuste ?? 0) - 1 }));
            }}
            pipedriveBreakdown={
              i === 0
                ? {
                    pipedriveCount: data.pipedriveCount,
                    manualAdjustment: data.manualAdjustment,
                    onReset: () => data.setManualAdjustment(0),
                  }
                : i === 2
                  ? {
                      pipedriveCount: data.pipedriveCount,
                      manualAdjustment: data.ativacoesAjuste,
                      onReset: () => data.setExtra((prev) => ({ ...prev, ativacoesAjuste: 0 })),
                    }
                  : undefined
            }
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Novos representantes e ativações vêm do Pipedrive (funis de Reunião Agendada e Remarcação/no-show) e atualizam sozinhos a cada 5 minutos (e sempre que você volta pra essa aba). Cadastros no sistema ainda é só manual. Se um cadastro não aparecer na hora, use o{" "}
        <RefreshCw className="inline h-3 w-3 align-[-1px]" /> pra forçar, ou o + no card pra somar na hora.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-background px-5 py-3.5">
          <IconBox>
            <TrendingUp className="h-5 w-5" />
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

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-background px-5 py-3.5">
          <IconBox>
            <Calendar className="h-5 w-5" />
          </IconBox>
          <div>
            <p className="text-xs leading-4 text-muted-foreground">Dias restantes</p>
            <p className="mt-0.5 text-lg font-semibold leading-6">{date.daysLeft} dias</p>
          </div>
          <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-[var(--track)]">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.round((date.daysLeft / date.daysInMonth) * 100)}%` }}
            />
          </div>
          <p className="whitespace-nowrap text-xs text-muted-foreground">
            Hoje é {date.day} de {date.monthName}
          </p>
        </div>
      </div>

      {editing && <EditModal data={data} onClose={() => setEditing(false)} />}
    </Card>
  );
}
