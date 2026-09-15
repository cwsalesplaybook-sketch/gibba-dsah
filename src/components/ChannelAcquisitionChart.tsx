import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { channelAcquisition } from "@/data/mockData";

export function ChannelAcquisitionChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aquisição por canal</CardTitle>
        <CardDescription>De onde vieram os cadastros deste mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={channelAcquisition}
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
                {channelAcquisition.map((entry) => (
                  <Cell key={entry.channel} fill={`var(${entry.colorVar})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
