import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { funnel } from "@/data/mockData";

export function RecruitmentFunnel() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Funil de recrutamento</CardTitle>
        <CardDescription>Da inscrição até o cadastro</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {funnel.map((stage) => (
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
                style={{ width: `${stage.percent}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
