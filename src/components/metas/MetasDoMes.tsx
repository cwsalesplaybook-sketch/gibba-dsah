import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarDays,
  Pencil,
  RefreshCw,
  RotateCcw,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { InfoPopover } from "@/components/metas/parts";
import { inicioMetaInfo } from "@/data/mockData";
import { useCountdown } from "@/lib/useCountdown";
import type { MetasData } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

const metaIcons = { users: Users, calendar: CalendarDays, target: Target };

function TierCard({
  index,
  target,
  count,
  daysLeft,
  onReset,
  manualAdjustment,
}: {
  index: number;
  target: number;
  count: number;
  daysLeft: number;
  onReset: () => void;
  manualAdjustment: number;
}) {
  const info = inicioMetaInfo[index];
  const Icon = metaIcons[info.icon];
  const missing = Math.max(0, target - count);
  const pct = Math.min(1, count / target);
  const needPerDay = missing / daysLeft;
  const hit = missing === 0;

  return (
    <div className="flex min-w-0 flex-col gap-1.5 p-3" style={{ background: "color-mix(in srgb, var(--background) 70%, transparent)", boxShadow: "var(--edge)" }}>
      <span className="label-caps flex items-center gap-1.5" style={{ color: "var(--ink-300)" }}>
        <Icon className="h-3.5 w-3.5" />
        Meta {index + 1} · {target}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-black leading-none" style={{ fontFamily: "var(--font-display)", fontSize: 40, color: hit ? "var(--green-500)" : "var(--primary)" }}>
          {missing}
        </span>
        <span className="label-caps" style={{ color: "var(--ink-400)" }}>faltam</span>
      </div>
      <div className="h-1 w-full" style={{ background: "var(--ink-700)" }}>
        <div className="h-full" style={{ width: `${pct * 100}%`, background: hit ? "var(--green-500)" : "var(--primary)" }} />
      </div>
      <span className="whitespace-nowrap text-xs" style={{ color: "var(--ink-400)" }}>
        {Math.round(pct * 100)}% · {needPerDay.toFixed(1).replace(".", ",")}/dia
      </span>
      <div className="flex items-center justify-between gap-2">
        <span
          className="label-caps self-start px-1.5 py-0.5 text-[10px]"
          style={{
            background: hit ? "var(--green-900)" : "var(--amber-900)",
            color: hit ? "var(--green-500)" : "var(--amber-500)",
          }}
        >
          {hit ? "Atingida" : "Em andamento"}
        </span>
        {manualAdjustment !== 0 && (
          <button onClick={onReset} className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-[10px]" style={{ color: "var(--pink-300)" }}>
            <RotateCcw className="h-3 w-3" /> {manualAdjustment > 0 ? "+" : ""}
            {manualAdjustment}
          </button>
        )}
      </div>
    </div>
  );
}

function CountdownCard({ data }: { data: MetasData }) {
  const now = useMemo(() => new Date(), []);
  const deadline = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    [now]
  );
  const countdown = useCountdown(deadline);
  const nextTierIndex = data.targets.findIndex((t, i) => data.counts[i] < t);
  const nextTier = nextTierIndex === -1 ? data.targets.length - 1 : nextTierIndex;
  const missing = Math.max(0, data.targets[nextTier] - data.counts[nextTier]);
  const needPerDay = missing / data.date.daysLeft;

  return (
    <div className="relative flex min-w-0 flex-col justify-between gap-4 p-5" style={{ background: "var(--card)", boxShadow: "var(--edge)", clipPath: "var(--clip-chamfer)" }}>
      <span className="absolute left-0 right-0 top-0 h-2" style={{ background: "var(--hazard)" }} />
      <div>
        <p className="label-caps mb-2.5" style={{ color: "var(--pink-300)" }}>
          Até o fechamento
        </p>
        <div className="flex gap-4">
          {countdown.map((c) => (
            <div key={c.unit} className="flex flex-col">
              <span className="font-black leading-none" style={{ fontFamily: "var(--font-display)", fontSize: 44, fontVariantNumeric: "tabular-nums" }}>
                {c.value}
              </span>
              <span className="label-caps mt-1" style={{ color: "var(--ink-400)" }}>{c.unit}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 text-[13px]" style={{ color: "var(--ink-300)" }}>
        <div className="flex justify-between gap-2 whitespace-nowrap">
          <span>Ritmo atual</span>
          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
            {data.dailyAvg.toFixed(2).replace(".", ",")}/dia
          </span>
        </div>
        <div className="flex justify-between gap-2 whitespace-nowrap">
          <span>Necessário p/ Meta {nextTier + 1}</span>
          <span className="font-semibold" style={{ color: "var(--primary)" }}>
            {needPerDay.toFixed(1).replace(".", ",")}/dia
          </span>
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
        label="Meta 2 · ajuste manual (soma com a contagem do Pipedrive)"
        type="number"
        value={extra.sistemaAjuste ?? 0}
        onChange={(e) => setExtra({ ...extra, sistemaAjuste: Number(e.target.value) })}
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
  const { date, targets } = data;
  const TOTAL = data.registered;

  const BMIN = Math.max(0, Math.floor(Math.min(...targets, TOTAL) * 0.75));
  const YMAX = Math.ceil(Math.max(...targets, data.projection, TOTAL) * 1.07);
  const pos = (v: number) => `${((v - BMIN) / (YMAX - BMIN)) * 100}%`;

  const hoverBtn =
    "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

  const resets = [
    () => data.setManualAdjustment(0),
    () => data.setExtra((prev) => ({ ...prev, sistemaAjuste: 0 })),
    () => data.setExtra((prev) => ({ ...prev, ativacoesAjuste: 0 })),
  ];
  const manualAdjustments = [data.manualAdjustment, data.sistemaAjuste, data.ativacoesAjuste];

  return (
    <div className="group grid grid-cols-1 gap-3.5 lg:grid-cols-3">
      <div
        className="relative min-w-0 lg:col-span-2"
        style={{
          padding: "22px 26px 20px",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--pink-900) 70%, var(--card)), var(--card) 55%)",
          boxShadow: "var(--edge-accent)",
          clipPath: "var(--clip-chamfer)",
        }}
      >
        <span className="absolute left-0 top-0 h-[3px] w-12" style={{ background: "var(--primary)", boxShadow: "var(--glow-sm)" }} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="label-caps" style={{ color: "var(--ink-300)" }}>
            Placar · 3 metas
          </span>
          <div className="flex items-center gap-1">
            <InfoPopover>
              As três metas são a mesma contagem de cadastros do Pipedrive (funis de Reunião Agendada e
              Remarcação/no-show), cada uma contra seu próprio objetivo, e atualizam sozinhas a cada 5 minutos (e
              sempre que você volta pra essa aba). Se um cadastro não aparecer na hora, use o{" "}
              <RefreshCw className="inline h-3 w-3 align-[-1px]" /> pra forçar, ou o{" "}
              <Pencil className="inline h-3 w-3 align-[-1px]" /> aqui pra ajustar na mão.
            </InfoPopover>
            <button onClick={refresh} aria-label="Atualizar dados do Pipedrive" className={hoverBtn}>
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </button>
            <button onClick={() => setEditing(true)} aria-label="Editar metas" className={hoverBtn}>
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}, mostrando só o ajuste manual até reconectar.
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-end gap-6">
          <div className="flex flex-none flex-col">
            <span className="font-black leading-[0.82]" style={{ fontFamily: "var(--font-display)", fontSize: 96, textShadow: "var(--glow-text)" }}>
              {TOTAL}
            </span>
            <span className="label-caps mt-1.5" style={{ color: "var(--ink-400)" }}>
              Cadastrados · projeção <span style={{ color: "var(--pink-300)" }}>{data.projection}</span>
            </span>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-2.5 pb-1 sm:grid-cols-3" style={{ minWidth: 280 }}>
            {targets.map((target, i) => (
              <TierCard
                key={i}
                index={i}
                target={target}
                count={data.counts[i]}
                daysLeft={date.daysLeft}
                manualAdjustment={manualAdjustments[i]}
                onReset={resets[i]}
              />
            ))}
          </div>
        </div>

        <div className="relative my-8 h-[18px]" style={{ background: "var(--ink-950)", boxShadow: "var(--edge)" }}>
          <div
            className="absolute bottom-0 left-0 top-0"
            style={{ width: pos(TOTAL), background: "linear-gradient(90deg,var(--pink-700),var(--pink-500))", boxShadow: "var(--glow-sm)" }}
          />
          {data.projection > TOTAL && (
            <div
              className="absolute bottom-0 top-0 opacity-45"
              style={{ left: pos(TOTAL), width: `calc(${pos(data.projection)} - ${pos(TOTAL)})`, background: "var(--hazard)" }}
            />
          )}
          <div
            className="label-caps absolute top-6 -translate-x-1/2 whitespace-nowrap"
            style={{ left: pos(data.projection), color: "var(--ink-400)", fontWeight: 600 }}
          >
            Projeção {data.projection}
          </div>
          <div className="absolute left-0 top-6 text-[11px]" style={{ color: "var(--ink-500)" }}>
            {BMIN}
          </div>
          {targets.map((target, i) => (
            <div key={i}>
              <div className="absolute -bottom-1.5 -top-1.5 w-0.5" style={{ left: pos(target), background: "var(--ink-100)" }} />
              <div
                className="label-caps absolute -top-6 -translate-x-1/2 whitespace-nowrap"
                style={{ left: pos(target), color: "var(--ink-100)", fontWeight: 700, fontSize: 11 }}
              >
                M{i + 1} · {target}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CountdownCard data={data} />

      {editing && <EditModal data={data} onClose={() => setEditing(false)} />}
    </div>
  );
}

export function MetasFooterInfo({ data }: { data: MetasData }) {
  return (
    <div className="mt-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
      <div className="card-panel flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
        <span className="tile h-9 w-9 rounded-[10px]">
          <TrendingUp className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs leading-4 text-muted-foreground">Projeção final</p>
          <p className="mt-0.5 text-lg font-semibold leading-6">{data.projection} cadastros</p>
        </div>
      </div>

      <div className="card-panel flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
        <span className="tile h-9 w-9 rounded-[10px]">
          <Calendar className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs leading-4 text-muted-foreground">Dias restantes</p>
          <p className="mt-0.5 text-lg font-semibold leading-6">{data.date.daysLeft} dias</p>
        </div>
        <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-[var(--track)]">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.round((data.date.daysLeft / data.date.daysInMonth) * 100)}%` }}
          />
        </div>
        <p className="whitespace-nowrap text-xs text-muted-foreground">
          Hoje é {data.date.day} de {data.date.monthName}
        </p>
      </div>
    </div>
  );
}
