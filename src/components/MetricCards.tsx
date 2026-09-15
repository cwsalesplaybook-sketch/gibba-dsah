import { Users, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { metrics } from "@/data/mockData";

const iconMap = {
  users: Users,
  trending: TrendingUp,
  activity: Activity,
};

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.icon];
        return (
          <Card key={metric.label} className="p-6">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-4 w-4" />
              </span>
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
    </div>
  );
}
