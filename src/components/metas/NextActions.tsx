import { Check, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/metas/parts";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import type { MetasData } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

function actionTitle(index: number, remaining: number) {
  if (remaining === 0) return `Meta ${index + 1} concluída`;
  if (index === 0) {
    return `Concluir ${remaining} ${remaining === 1 ? "novo representante" : "novos representantes"}`;
  }
  if (index === 1) return "Aumentar cadastros no sistema";
  return `Ativar mais ${remaining} ${remaining === 1 ? "representante" : "representantes"}`;
}

export function NextActions({ data }: { data: MetasData }) {
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
    <Card className="flex h-full flex-col px-5 pb-4 pt-4">
      <div className="flex items-center gap-3">
        <IconBox size="md">
          <ListChecks className="h-[18px] w-[18px]" />
        </IconBox>
        <h2 className="flex-1 text-base font-semibold">Próximas metas / Ações</h2>
        <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          {pending === 0 ? "Tudo em dia" : `${pending} ${pending === 1 ? "pendência" : "pendências"}`}
        </span>
      </div>

      <ul className="mt-3 flex flex-1 flex-col justify-around divide-y divide-border">
        {rows.map((row) => (
          <li key={row.key} className="flex flex-1 items-center gap-3 py-2">
            <button
              onClick={() => !row.auto && setChecked((prev) => ({ ...prev, [row.key]: !prev[row.key] }))}
              aria-label={row.done ? "Marcar como pendente" : "Marcar como concluída"}
              aria-pressed={row.done}
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                row.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:border-primary"
              )}
            >
              {row.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-[13px] font-medium leading-4",
                  row.done && "text-muted-foreground line-through"
                )}
              >
                {row.title}
              </p>
              <p className="mt-1 text-[11px] leading-[14px] text-muted-foreground">{row.sub}</p>
            </div>
            <span className="shrink-0 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              Até {data.date.lastDayLabel}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
