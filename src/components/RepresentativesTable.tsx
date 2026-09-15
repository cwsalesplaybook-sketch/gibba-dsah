import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { representatives as initialRepresentatives } from "@/data/mockData";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

type Representative = (typeof initialRepresentatives)[number];

const emptyRow: Representative = { name: "", region: "", channel: "", date: "" };

export function RepresentativesTable() {
  const [representatives, setRepresentatives] = useLocalStorageState(
    "gibba:representatives",
    initialRepresentatives
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Representative[]>(initialRepresentatives);

  function openEdit() {
    setDraft(representatives);
    setOpen(true);
  }

  function save() {
    setRepresentatives(draft.filter((r) => r.name.trim() !== ""));
    setOpen(false);
  }

  function updateRow(index: number, patch: Partial<Representative>) {
    setDraft((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Representantes</CardTitle>
          <CardDescription>Últimos cadastros na base</CardDescription>
        </div>
        <EditButton onClick={openEdit} />
      </CardHeader>
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 font-medium">Representante</th>
              <th className="pb-3 font-medium">Região</th>
              <th className="pb-3 font-medium">Canal</th>
              <th className="pb-3 font-medium">Data de cadastro</th>
            </tr>
          </thead>
          <tbody>
            {representatives.map((rep) => (
              <tr key={rep.name} className="border-b border-border/60 last:border-0">
                <td className="py-3 font-semibold">{rep.name}</td>
                <td className="py-3 text-muted-foreground">{rep.region}</td>
                <td className="py-3 text-muted-foreground">{rep.channel}</td>
                <td className="py-3 text-muted-foreground">{rep.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal
          title="Editar representantes"
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
          <div className="space-y-4">
            {draft.map((rep, index) => (
              <div key={index} className="rounded-xl border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Representante {index + 1}
                  </span>
                  <button
                    onClick={() => setDraft((prev) => prev.filter((_, i) => i !== index))}
                    aria-label="Remover"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Nome"
                    value={rep.name}
                    onChange={(e) => updateRow(index, { name: e.target.value })}
                  />
                  <Field
                    label="Região"
                    value={rep.region}
                    onChange={(e) => updateRow(index, { region: e.target.value })}
                  />
                  <Field
                    label="Canal"
                    value={rep.channel}
                    onChange={(e) => updateRow(index, { channel: e.target.value })}
                  />
                  <Field
                    label="Data (dd/mm/aaaa)"
                    value={rep.date}
                    onChange={(e) => updateRow(index, { date: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => setDraft((prev) => [...prev, { ...emptyRow }])}
            >
              <Plus className="h-4 w-4" />
              Adicionar representante
            </Button>
          </div>
        </Modal>
      )}
    </Card>
  );
}
