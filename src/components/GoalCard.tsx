import { useState } from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { goal as initialGoal } from "@/data/mockData";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

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

export function GoalCard() {
  const [goal, setGoal] = useLocalStorageState("gibba:goal", initialGoal);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialGoal);

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
        <div className="mb-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Target className="h-3.5 w-3.5" />
            Metas do mês · {goal.current} cadastrados
          </div>
          <EditButton onClick={openEdit} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {goal.tiers.map((tier) => {
            const percent = Math.round((goal.current / tier.target) * 100);
            const remaining = Math.max(0, tier.target - goal.current);
            const reached = goal.current >= tier.target;
            return (
              <div
                key={tier.label}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/60 p-4 text-center"
              >
                <GoalRing percent={percent} />
                <div>
                  <p className="text-sm font-semibold">{tier.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {goal.current} de {tier.target}
                  </p>
                  <p className="mt-1 text-xs font-medium text-foreground">
                    {reached ? "Meta atingida 🎉" : `Faltam ${remaining}`}
                  </p>
                </div>
              </div>
            );
          })}
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
            label="Cadastros atuais"
            type="number"
            value={draft.current}
            onChange={(e) => setDraft({ ...draft, current: Number(e.target.value) })}
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
