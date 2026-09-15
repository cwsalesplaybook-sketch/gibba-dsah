import { useState } from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { goal as initialGoal } from "@/data/mockData";

function GoalRing({ percent }: { percent: number }) {
  const size = 168;
  const stroke = 14;
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
          style={{ filter: "drop-shadow(0 0 12px var(--primary))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-primary">{clamped}%</span>
        <span className="text-sm text-muted-foreground">da meta</span>
      </div>
    </div>
  );
}

export function GoalCard() {
  const [goal, setGoal] = useState(initialGoal);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialGoal);

  const percent = Math.round((goal.current / goal.target) * 100);
  const remaining = Math.max(0, goal.target - goal.current);
  const paceNeeded = goal.daysLeft > 0 ? Math.ceil(remaining / goal.daysLeft) : remaining;

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
      <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center">
        <GoalRing percent={percent} />
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Target className="h-3.5 w-3.5" />
              Meta do mês
            </div>
            <EditButton onClick={openEdit} />
          </div>
          <h2 className="text-xl font-bold sm:text-2xl">
            {goal.current} de {goal.target} representantes cadastrados
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Faltam <span className="font-semibold text-foreground">{remaining} cadastros</span> em{" "}
            {goal.daysLeft} dias. Ritmo necessário:{" "}
            <span className="font-semibold text-foreground">{paceNeeded}/dia</span>.
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

      {open && (
        <Modal
          title="Editar meta do mês"
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
            label="Representantes cadastrados"
            type="number"
            value={draft.current}
            onChange={(e) => setDraft({ ...draft, current: Number(e.target.value) })}
          />
          <Field
            label="Meta do mês"
            type="number"
            value={draft.target}
            onChange={(e) => setDraft({ ...draft, target: Number(e.target.value) })}
          />
          <Field
            label="Dias restantes"
            type="number"
            value={draft.daysLeft}
            onChange={(e) => setDraft({ ...draft, daysLeft: Number(e.target.value) })}
          />
          <Field
            label="Cadastros hoje"
            type="number"
            value={draft.today}
            onChange={(e) => setDraft({ ...draft, today: Number(e.target.value) })}
          />
          <Field
            label="Cadastros na semana"
            type="number"
            value={draft.week}
            onChange={(e) => setDraft({ ...draft, week: Number(e.target.value) })}
          />
          <Field
            label="Média diária"
            type="number"
            step="0.1"
            value={draft.dailyAverage}
            onChange={(e) => setDraft({ ...draft, dailyAverage: Number(e.target.value) })}
          />
        </Modal>
      )}
    </Card>
  );
}
