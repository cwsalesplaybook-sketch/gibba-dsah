import { Check, ChevronRight, Rocket, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/inicio/parts";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import type { InicioData } from "@/lib/useInicioData";
import { cn } from "@/lib/utils";

function actionTitle(index: number, remaining: number) {
  if (remaining === 0) return `Meta ${index + 1} concluída`;
  if (index === 0) {
    return `Concluir ${remaining} ${remaining === 1 ? "novo representante" : "novos representantes"}`;
  }
  if (index === 1) return "Aumentar cadastros no sistema";
  return `Ativar mais ${remaining} ${remaining === 1 ? "representante" : "representantes"}`;
}

export function NextActions({
  data,
  onOpenMetas,
}: {
  data: InicioData;
  onOpenMetas: () => void;
}) {
  const [checked, setChecked] = useLocalStorageState<Record<string, boolean>>("gibba:inicio:done", {});

  const rows = data.targets.map((target, i) => {
    const remaining = Math.max(0, target - data.counts[i]);
    return {
      key: `meta-${i + 1}`,
      title: actionTitle(i, remaining),
      sub: `Meta ${i + 1} · Faltam ${remaining}`,
      done: remaining === 0 || Boolean(checked[`meta-${i + 1}`]),
      auto: remaining === 0,
    };
  });
  const pending = rows.filter((row) => !row.done).length;

  return (
    <Card className="flex h-full flex-col px-5 pb-4 pt-[10px]">
      <div className="flex items-center gap-3">
        <IconBox size="sm">
          <TrendingUp className="h-4 w-4" />
        </IconBox>
        <h2 className="flex-1 text-sm font-semibold">Próximas metas / Ações</h2>
        <span className="rounded-full bg-secondary px-2.5 py-[3px] text-[10.5px] font-medium text-secondary-foreground">
          {pending === 0 ? "Tudo em dia" : `${pending} ${pending === 1 ? "pendência" : "pendências"}`}
        </span>
      </div>

      <ul className="mt-2 flex-1 divide-y divide-border/60">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-3 py-2">
            <button
              onClick={() => !row.auto && setChecked((prev) => ({ ...prev, [row.key]: !prev[row.key] }))}
              aria-label={row.done ? "Marcar como pendente" : "Marcar como concluída"}
              aria-pressed={row.done}
              className={cn(
                "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                row.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/70 bg-background/40 hover:border-primary"
              )}
            >
              {row.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </button>
            <button onClick={onOpenMetas} className="min-w-0 flex-1 text-left">
              <p
                className={cn(
                  "truncate text-xs font-normal leading-4",
                  row.done && "text-muted-foreground line-through"
                )}
              >
                {row.title}
              </p>
              <p className="mt-0.5 text-[10px] leading-[14px] text-muted-foreground">{row.sub}</p>
            </button>
            <span className="shrink-0 rounded-full border border-primary/25 bg-primary/25 px-2.5 py-[3px] text-[10px] font-medium text-primary-glow">
              Até {data.date.lastDayLabel}
            </span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </li>
        ))}
      </ul>

      <button
        onClick={onOpenMetas}
        className="mt-3 flex h-[42px] items-center gap-3 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/30 to-primary/5 px-4 text-xs font-semibold transition-colors hover:from-primary/40"
      >
        <Rocket className="h-4 w-4 text-primary-glow" />
        <span className="flex-1 text-left">Ver todas as ações</span>
        <ChevronRight className="h-4 w-4 text-primary-glow" />
      </button>
    </Card>
  );
}
