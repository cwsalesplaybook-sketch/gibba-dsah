import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { registrationsByMonth as initialData, targetLine } from "@/data/mockData";

export function RegistrationsChart() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialData);

  function openEdit() {
    setDraft(data);
    setOpen(true);
  }

  function save() {
    setData(draft);
    setOpen(false);
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Evolução de cadastros</CardTitle>
          <CardDescription>Representantes cadastrados por mês, comparado à meta</CardDescription>
        </div>
        <EditButton onClick={openEdit} />
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="registrationsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                width={32}
              />
              <ReferenceLine y={targetLine} stroke="var(--primary)" strokeDasharray="4 4" />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={3}
                fill="url(#registrationsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {open && (
        <Modal
          title="Editar evolução de cadastros"
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
          <div className="grid grid-cols-3 gap-3">
            {draft.map((item, index) => (
              <Field
                key={item.month}
                label={item.month}
                type="number"
                value={item.value}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev.map((d, i) => (i === index ? { ...d, value: Number(e.target.value) } : d))
                  )
                }
              />
            ))}
          </div>
        </Modal>
      )}
    </Card>
  );
}
