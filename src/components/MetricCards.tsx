import { useState } from "react";
import { Users, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { metrics as initialMetrics } from "@/data/mockData";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

const iconMap = {
  users: Users,
  trending: TrendingUp,
  activity: Activity,
};

export function MetricCards() {
  const [metrics, setMetrics] = useLocalStorageState("gibba:metrics", initialMetrics);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<(typeof initialMetrics)[number] | null>(null);

  function openEdit(index: number) {
    setDraft(metrics[index]);
    setEditingIndex(index);
  }

  function save() {
    if (editingIndex === null || !draft) return;
    setMetrics((prev) => prev.map((m, i) => (i === editingIndex ? draft : m)));
    setEditingIndex(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon];
        return (
          <Card key={metric.label} className="p-6">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <EditButton onClick={() => openEdit(index)} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold">{metric.value}</p>
            <div className="mt-3 flex items-center gap-2">
              {metric.changeLabel && (
                <Badge variant="success">
                  <ArrowUpRight className="h-3 w-3" />
                  {metric.changeLabel}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{metric.changeSub}</span>
            </div>
          </Card>
        );
      })}

      {editingIndex !== null && draft && (
        <Modal
          title={`Editar "${metrics[editingIndex].label}"`}
          onClose={() => setEditingIndex(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditingIndex(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar</Button>
            </>
          }
        >
          <Field
            label="Valor principal"
            value={draft.value}
            onChange={(e) => setDraft({ ...draft, value: e.target.value })}
          />
          <Field
            label="Percentual de variação (deixe vazio pra ocultar)"
            value={draft.changeLabel ?? ""}
            onChange={(e) => setDraft({ ...draft, changeLabel: e.target.value || null })}
          />
          <Field
            label="Texto complementar"
            value={draft.changeSub}
            onChange={(e) => setDraft({ ...draft, changeSub: e.target.value })}
          />
        </Modal>
      )}
    </div>
  );
}
