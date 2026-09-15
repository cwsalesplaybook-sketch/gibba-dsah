import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import { funnel as initialFunnel } from "@/data/mockData";

export function RecruitmentFunnel() {
  const [values, setValues] = useState(initialFunnel.map((stage) => stage.value));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(values);

  const stages = initialFunnel.map((stage, index) => {
    const value = values[index];
    const percent = index === 0 ? 100 : Math.round((value / values[index - 1]) * 100);
    return { ...stage, value, percent };
  });

  function openEdit() {
    setDraft(values);
    setOpen(true);
  }

  function save() {
    setValues(draft);
    setOpen(false);
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Funil de recrutamento</CardTitle>
          <CardDescription>Da inscrição até o cadastro</CardDescription>
        </div>
        <EditButton onClick={openEdit} />
      </CardHeader>
      <CardContent className="space-y-5">
        {stages.map((stage) => (
          <div key={stage.label}>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className={cn(stage.highlight ? "font-semibold text-primary" : "text-foreground")}>
                {stage.label}
              </span>
              <span className="text-muted-foreground">
                {stage.value.toLocaleString("pt-BR")} · {stage.percent}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{ width: `${Math.min(100, stage.percent)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>

      {open && (
        <Modal
          title="Editar funil de recrutamento"
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
          {initialFunnel.map((stage, index) => (
            <Field
              key={stage.label}
              label={stage.label}
              type="number"
              value={draft[index]}
              onChange={(e) =>
                setDraft((prev) => prev.map((v, i) => (i === index ? Number(e.target.value) : v)))
              }
            />
          ))}
        </Modal>
      )}
    </Card>
  );
}
