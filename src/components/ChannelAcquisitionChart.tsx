import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EditButton } from "@/components/ui/EditButton";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { channelAcquisition as initialData } from "@/data/mockData";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

export function ChannelAcquisitionChart() {
  const [data, setData] = useLocalStorageState("gibba:channelAcquisition", initialData);
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
          <CardTitle>Aquisição por canal</CardTitle>
          <CardDescription>De onde vieram os cadastros deste mês</CardDescription>
        </div>
        <EditButton onClick={openEdit} />
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                dataKey="channel"
                type="category"
                tickLine={false}
                axisLine={false}
                width={92}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                {data.map((entry) => (
                  <Cell key={entry.channel} fill={`var(${entry.colorVar})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {open && (
        <Modal
          title="Editar aquisição por canal"
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
          {draft.map((item, index) => (
            <Field
              key={item.channel}
              label={item.channel}
              type="number"
              value={item.value}
              onChange={(e) =>
                setDraft((prev) =>
                  prev.map((d, i) => (i === index ? { ...d, value: Number(e.target.value) } : d))
                )
              }
            />
          ))}
        </Modal>
      )}
    </Card>
  );
}
