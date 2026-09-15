import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { representatives } from "@/data/mockData";

export function RepresentativesTable() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Representantes</CardTitle>
        <CardDescription>Últimos cadastros na base</CardDescription>
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
    </Card>
  );
}
