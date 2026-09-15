import { useState } from "react";
import { Target, RefreshCw, Minus, Plus, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { goal as initialGoal } from "@/data/mockData";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import { usePipedriveCount } from "@/lib/usePipedriveCount";
import { cn } from "@/lib/utils";

function GoalRing({ percent, size = 120 }: { percent: number; size?: number }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
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
          style={{ filter: "drop-shadow(0 0 10px var(--primary))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-primary">{percent}%</span>
      </div>
    </div>
  );
}

function daysLeftInMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(1, lastDay - now.getDate() + 1);
}

function daysElapsedInMonth() {
  const now = new Date();
  return now.getDate();
}

export function GoalCard() {
  const [goal, setGoal] = useLocalStorageState("gibba:goal", initialGoal);
  const [manualAdjustment, setManualAdjustment] = useLocalStorageState("gibba:manualAdjustment", 0);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialGoal);

  const { data: pipedrive, loading, error, refresh } = usePipedriveCount();

  const pipedriveCount = pipedrive?.count ?? 0;
  const current = pipedriveCount + manualAdjustment;

  const daysLeft = daysLeftInMonth();
  const daysElapsed = daysElapsedInMonth();
  const dailyPace = current / daysElapsed;
  const projection = Math.round(current + dailyPace * (daysLeft - 1));

  const firstUnmetTier = goal.tiers.find((tier) => current < tier.target);
  const onPace = !firstUnmetTier || projection >= firstUnmetTier.target;

  function openEdit() {
    setDraft(goal);
    setOpen(true);
  }

  function save() {
    setGoal(draft);
    setOpen(false);
  }

  return (
    <Card>
      <div className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Target className="h-3.5 w-3.5" />
            Metas do mês — status
            <button
              onClick={refresh}
              aria-label="Atualizar dados do Pipedrive"
              className="text-muted-foreground hover:text-primary"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Pipedrive: {loading ? "…" : pipedriveCount} · Manual: {manualAdjustment >= 0 ? "+" : ""}
              {manualAdjustment}
            </span>
            <button
              onClick={() => setManualAdjustment((v) => v - 1)}
              aria-label="Diminuir ajuste manual"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setManualAdjustment((v) => v + 1)}
              aria-label="Aumentar ajuste manual"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <EditButton onClick={openEdit} />
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                onPace ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              )}
            >
              {onPace ? "↗ No ritmo" : "⚠ Atrasado"}
            </span>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error} — mostrando só o ajuste manual até reconectar.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {goal.tiers.map((tier) => {
            const percent = Math.round((current / tier.target) * 100);
            const remaining = Math.max(0, tier.target - current);
            const reached = current >= tier.target;
            return (
              <div
                key={tier.label}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/60 p-4 text-center"
              >
                <GoalRing percent={percent} />
                <div>
                  <p className="text-sm font-semibold">{tier.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {current} de {tier.target}
                  </p>
                  <p className="mt-1 text-xs font-medium text-foreground">
                    {reached ? "Meta atingida 🎉" : `Faltam ${remaining}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Projeção final</p>
              <p className="text-lg font-bold">{projection} cadastros</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Dias restantes</p>
              <p className="text-lg font-bold">{daysLeft} dias</p>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <Modal
          title="Editar metas do mês"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar</Button>
            </>
          }
        >
          <Field
            label="Ajuste manual (some com a contagem do Pipedrive)"
            type="number"
            value={manualAdjustment}
            onChange={(e) => setManualAdjustment(Number(e.target.value))}
          />
          {draft.tiers.map((tier, index) => (
            <Field
              key={tier.label}
              label={tier.label}
              type="number"
              value={tier.target}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  tiers: prev.tiers.map((t, i) =>
                    i === index ? { ...t, target: Number(e.target.value) } : t
                  ),
                }))
              }
            />
          ))}
        </Modal>
      )}
    </Card>
  );
}
