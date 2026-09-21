import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileSignature,
  RefreshCw,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/metas/parts";
import {
  dayKey,
  daysBetween,
  formatDateTime,
  formatTime,
  formatWaiting,
  useContracts,
  type ContractRow,
} from "@/lib/useContracts";
import { cn } from "@/lib/utils";

// Pipedrive marca como "parado" (rotten) o negócio com 2+ dias na etapa.
const LATE_AFTER_DAYS = 2;

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  alert = false,
}: {
  label: string;
  value: number | string;
  hint: string;
  icon: typeof Clock;
  alert?: boolean;
}) {
  return (
    <Card className="px-5 pb-4 pt-4">
      <div className="flex items-center gap-3">
        <IconBox size="md">
          <Icon className="h-[18px] w-[18px]" />
        </IconBox>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className={cn("mt-3 text-[28px] font-semibold leading-9", alert && "text-destructive")}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

function Person({ row }: { row: ContractRow }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium">{row.name}</p>
      {row.phone && <p className="truncate text-xs text-muted-foreground">{row.phone}</p>}
    </div>
  );
}

const th = "px-5 py-2.5 text-left text-xs font-medium text-muted-foreground";
const td = "px-5 py-3 align-middle";

export function ContratosPage() {
  const { data, loading, error, refresh } = useContracts();

  const today = new Date();
  const pending = data?.pending ?? [];
  const signed = data?.signed ?? [];

  const stats = useMemo(() => {
    const now = new Date();
    const todayKey = dayKey(now);
    const late = pending.filter((row) => row.sentAt && daysBetween(row.sentAt, now) >= LATE_AFTER_DAYS);
    const sentToday = [...pending, ...signed.filter((row) => row.stageId === 425)].filter(
      (row) => row.sentAt && dayKey(row.sentAt) === todayKey
    );
    const signedToday = signed.filter((row) => row.signedAt && dayKey(row.signedAt) === todayKey);
    const signedWeek = signed.filter((row) => row.signedAt && daysBetween(row.signedAt, now) <= 6);
    return { late: late.length, sentToday: sentToday.length, signedToday: signedToday.length, signedWeek: signedWeek.length };
  }, [pending, signed]);

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Assinatura de Contrato</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Controle diário dos contratos enviados aos representantes{data ? ` sob responsabilidade de ${data.owner}` : ""}.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {data && <span>Atualizado às {formatTime(data.updatedAt)}</span>}
          <button
            onClick={refresh}
            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Atualizar
          </button>
        </div>
      </header>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Aguardando assinatura"
          value={data ? pending.length : "—"}
          hint="Contratos enviados e ainda não assinados"
          icon={Clock}
        />
        <Kpi
          label="Atrasados"
          value={data ? stats.late : "—"}
          hint={`Sem assinatura há ${LATE_AFTER_DAYS}+ dias`}
          icon={AlertTriangle}
          alert={stats.late > 0}
        />
        <Kpi
          label="Enviados hoje"
          value={data ? stats.sentToday : "—"}
          hint={today.toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "America/Sao_Paulo" })}
          icon={Send}
        />
        <Kpi
          label="Assinados hoje"
          value={data ? stats.signedToday : "—"}
          hint={data ? `${stats.signedWeek} nos últimos 7 dias` : "Últimos 7 dias"}
          icon={CheckCircle2}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 pb-3 pt-4">
          <IconBox size="md">
            <FileSignature className="h-[18px] w-[18px]" />
          </IconBox>
          <div className="leading-tight">
            <h2 className="text-base font-semibold">Aguardando assinatura</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Mais antigos primeiro — cobre quem está parado há mais tempo.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead className="border-y border-border bg-muted/50">
              <tr>
                <th className={th}>Representante</th>
                <th className={th}>Contrato enviado em</th>
                <th className={th}>Aguardando há</th>
                <th className={th}>Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pending.map((row) => {
                const days = row.sentAt ? daysBetween(row.sentAt) : 0;
                const isLate = days >= LATE_AFTER_DAYS;
                return (
                  <tr key={row.id} className="hover:bg-muted/40">
                    <td className={td}>
                      <Person row={row} />
                    </td>
                    <td className={td}>{row.sentAt ? formatDateTime(row.sentAt) : "—"}</td>
                    <td className={cn(td, "font-medium")}>{formatWaiting(days)}</td>
                    <td className={td}>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          isLate ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                        )}
                      >
                        {isLate ? "Atrasado" : "No prazo"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data && pending.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                    Nenhum contrato aguardando assinatura.
                  </td>
                </tr>
              )}
              {!data && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                    {loading ? "Carregando dados do Pipedrive..." : "Sem dados no momento."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 pb-3 pt-4">
          <IconBox size="md">
            <CheckCircle2 className="h-[18px] w-[18px]" />
          </IconBox>
          <div className="leading-tight">
            <h2 className="text-base font-semibold">Assinados recentemente</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Últimos {data?.windowDays ?? 30} dias — mais recentes primeiro.
            </p>
          </div>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead className="sticky top-0 border-y border-border bg-muted">
              <tr>
                <th className={th}>Representante</th>
                <th className={th}>Assinado em</th>
                <th className={th}>Tempo até assinar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {signed.map((row) => {
                const lag =
                  row.stageId === 425 && row.sentAt && row.signedAt
                    ? daysBetween(row.sentAt, row.signedAt)
                    : null;
                return (
                  <tr key={row.id} className="hover:bg-muted/40">
                    <td className={td}>
                      <Person row={row} />
                    </td>
                    <td className={td}>{row.signedAt ? formatDateTime(row.signedAt) : "—"}</td>
                    <td className={cn(td, "text-muted-foreground")}>
                      {lag === null ? "—" : lag <= 0 ? "No mesmo dia" : formatWaiting(lag)}
                    </td>
                  </tr>
                );
              })}
              {data && signed.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-muted-foreground">
                    Nenhum contrato assinado no período.
                  </td>
                </tr>
              )}
              {!data && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-muted-foreground">
                    {loading ? "Carregando dados do Pipedrive..." : "Sem dados no momento."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Fonte: Pipedrive · funil [REP] Reunião Agendada · etapa "Assinatura de Contrato". Contrato assinado =
        negócio marcado como ganho. Atualiza sozinho a cada 5 minutos.
        {data && data.hidden.pending + data.hidden.signed > 0
          ? ` Não aparecem ${data.hidden.pending} pendente(s) e ${data.hidden.signed} assinado(s) de outros responsáveis.`
          : ""}
      </p>
    </div>
  );
}
