import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileSignature,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/metas/parts";
import {
  AddLeadModal,
  CommentsButton,
  ContactCell,
  ContractDrawer,
  TagsCell,
} from "@/components/contratos/ContractNotes";
import {
  dayKey,
  daysBetween,
  formatDateTime,
  formatTime,
  formatWaiting,
  useContracts,
  type ContractRow,
} from "@/lib/useContracts";
import {
  PENDING_TAG_ID,
  SIGNED_TAG_ID,
  tagStyles,
  useContractNotes,
  type ContractNotesApi,
} from "@/lib/useContractNotes";
import { cn } from "@/lib/utils";

// Pipedrive marca como "parado" (rotten) o negócio com 2+ dias na etapa.
const LATE_AFTER_DAYS = 2;

type Filter = "all" | "none" | string; // string = id de uma tag
type Source = "pipedrive-pending" | "pipedrive-signed" | "manual";
type Section = "pending" | "signed";

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

const th = "px-5 py-2.5 text-left text-xs font-medium text-muted-foreground";
const td = "px-5 py-3 align-middle";

// Nome do lead: o digitado à mão tem prioridade; se for diferente, mostra o do Pipedrive embaixo.
function NameCell({ notes, row }: { notes: ContractNotesApi; row: ContractRow }) {
  const name = notes.displayName(row.id, row.name);
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 font-medium">
        {name}
        {row.manual && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Manual
          </span>
        )}
      </p>
      {!row.manual && name !== row.name && (
        <p className="text-[11px] text-muted-foreground">Pipedrive: {row.name}</p>
      )}
    </div>
  );
}

// Cor de fundo da linha = cor da primeira tag do contrato (ex.: verde = assinado, vermelho = pendente).
function rowTint(notes: ContractNotesApi, row: ContractRow) {
  const first = notes.tags.find((tag) => notes.entryOf(row.id).tagIds.includes(tag.id));
  return first ? tagStyles[first.color].row : "hover:bg-muted/40";
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

// Comentários + (para leads manuais) botão de remover.
function ActionsCell({
  notes,
  row,
  onComment,
}: {
  notes: ContractNotesApi;
  row: ContractRow;
  onComment: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <CommentsButton notes={notes} row={row} onOpen={onComment} />
      {row.manual && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Remover o lead "${notes.displayName(row.id, row.name)}" da lista?`)) {
              notes.deleteManualLead(row.id);
            }
          }}
          aria-label="Remover lead"
          title="Remover lead"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function ContratosPage() {
  const { data, loading, error, refresh } = useContracts();
  const notes = useContractNotes();
  const [filter, setFilter] = useState<Filter>("all");
  const [drawerId, setDrawerId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  // Todos os contratos numa lista só: Pipedrive (aguardando e assinados) + leads manuais.
  const all: { row: ContractRow; source: Source }[] = [
    ...(data?.pending ?? []).map((row) => ({ row, source: "pipedrive-pending" as const })),
    ...(data?.signed ?? []).map((row) => ({ row, source: "pipedrive-signed" as const })),
    ...notes.manualLeads.map((lead) => ({
      row: { id: lead.id, name: lead.name, owner: null, sentAt: lead.sentAt, signedAt: null, manual: true },
      source: "manual" as const,
    })),
  ];

  // As tags mandam: "Contrato assinado" vai para Assinados; "Assinatura pendente" para Aguardando.
  // Sem tag, vale o que o Pipedrive diz (e lead manual começa em Aguardando).
  function sectionOf(row: ContractRow, source: Source): Section {
    const ids = notes.entryOf(row.id).tagIds;
    if (ids.includes(SIGNED_TAG_ID)) return "signed";
    if (ids.includes(PENDING_TAG_ID)) return "pending";
    return source === "pipedrive-signed" ? "signed" : "pending";
  }
  const signedAtOf = (row: ContractRow) => row.signedAt ?? notes.entryOf(row.id).signedAt ?? null;

  const time = (iso: string | null, fallback: number) => (iso ? new Date(iso).getTime() : fallback);
  const pending = all
    .filter(({ row, source }) => sectionOf(row, source) === "pending")
    .map(({ row }) => row)
    .sort((a, b) => time(a.sentAt, Infinity) - time(b.sentAt, Infinity));
  const signed = all
    .filter(({ row, source }) => sectionOf(row, source) === "signed")
    .map(({ row }) => row)
    .filter((row) => {
      const at = signedAtOf(row);
      return !at || daysBetween(at) <= 6; // "recentemente" = últimos 7 dias
    })
    .sort((a, b) => time(signedAtOf(b), 0) - time(signedAtOf(a), 0));

  const drawerRow = drawerId === null ? null : all.find(({ row }) => row.id === drawerId)?.row ?? null;

  const now = new Date();
  const todayKey = dayKey(now);
  const stats = {
    late: pending.filter((row) => row.sentAt && daysBetween(row.sentAt, now) >= LATE_AFTER_DAYS).length,
    sentToday: [...pending, ...signed].filter((row) => row.sentAt && dayKey(row.sentAt) === todayKey).length,
    signedToday: signed.filter((row) => {
      const at = signedAtOf(row);
      return at && dayKey(at) === todayKey;
    }).length,
  };
  const ready = data !== null || notes.manualLeads.length > 0;

  // Contagem por tag (e sem tag) para os filtros da tabela de pendentes.
  const counts = { byTag: {} as Record<string, number>, none: 0 };
  for (const row of pending) {
    const ids = notes.entryOf(row.id).tagIds.filter((id) => notes.tags.some((tag) => tag.id === id));
    if (ids.length === 0) counts.none += 1;
    for (const id of ids) counts.byTag[id] = (counts.byTag[id] ?? 0) + 1;
  }

  const visiblePending = pending.filter((row) => {
    if (filter === "all") return true;
    const ids = notes.entryOf(row.id).tagIds;
    if (filter === "none") return !ids.some((id) => notes.tags.some((tag) => tag.id === id));
    return ids.includes(filter);
  });

  const value = (n: number) => (ready ? n : "...");

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Assinatura de Contrato</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Controle diário dos contratos enviados aos representantes
            {data ? ` sob responsabilidade de ${data.owner}` : ""}.
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
          value={value(pending.length)}
          hint="Contratos enviados e ainda não assinados"
          icon={Clock}
        />
        <Kpi
          label="Atrasados"
          value={value(stats.late)}
          hint={`Sem assinatura há ${LATE_AFTER_DAYS}+ dias`}
          icon={AlertTriangle}
          alert={stats.late > 0}
        />
        <Kpi
          label="Enviados hoje"
          value={value(stats.sentToday)}
          hint={now.toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "America/Sao_Paulo" })}
          icon={Send}
        />
        <Kpi
          label="Assinados hoje"
          value={value(stats.signedToday)}
          hint={`${signed.length} nos últimos 7 dias`}
          icon={CheckCircle2}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <IconBox size="md">
              <FileSignature className="h-[18px] w-[18px]" />
            </IconBox>
            <div className="leading-tight">
              <h2 className="text-base font-semibold">Aguardando assinatura</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Mais antigos primeiro, cobre quem está parado há mais tempo.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {pending.length > 0 && (
              <>
                <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                  Todos ({pending.length})
                </FilterChip>
                {notes.tags
                  .filter((tag) => (counts.byTag[tag.id] ?? 0) > 0)
                  .map((tag) => (
                    <FilterChip key={tag.id} active={filter === tag.id} onClick={() => setFilter(tag.id)}>
                      <span className={cn("h-2 w-2 rounded-full", tagStyles[tag.color].dot)} />
                      {tag.name} ({counts.byTag[tag.id]})
                    </FilterChip>
                  ))}
                {counts.none > 0 && counts.none !== pending.length && (
                  <FilterChip active={filter === "none"} onClick={() => setFilter("none")}>
                    Sem tag ({counts.none})
                  </FilterChip>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar lead
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-[13px]">
            <thead className="border-y border-border bg-muted/50">
              <tr>
                <th className={th}>Representante</th>
                <th className={th}>Contato</th>
                <th className={th}>Contrato enviado em</th>
                <th className={th}>Aguardando há</th>
                <th className={th}>Prazo</th>
                <th className={th}>Tags</th>
                <th className={th}>Comentários</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visiblePending.map((row) => {
                const days = row.sentAt ? daysBetween(row.sentAt) : 0;
                const isLate = days >= LATE_AFTER_DAYS;
                return (
                  <tr key={row.id} className={rowTint(notes, row)}>
                    <td className={td}>
                      <NameCell notes={notes} row={row} />
                    </td>
                    <td className={td}>
                      <ContactCell notes={notes} row={row} />
                    </td>
                    <td className={td}>{row.sentAt ? formatDateTime(row.sentAt) : "Sem data"}</td>
                    <td className={cn(td, "font-medium")}>{row.sentAt ? formatWaiting(days) : "Sem data"}</td>
                    <td className={td}>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          isLate ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isLate ? "Atrasado" : "No prazo"}
                      </span>
                    </td>
                    <td className={td}>
                      <TagsCell notes={notes} row={row} />
                    </td>
                    <td className={td}>
                      <ActionsCell notes={notes} row={row} onComment={() => setDrawerId(row.id)} />
                    </td>
                  </tr>
                );
              })}
              {ready && pending.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    Nenhum contrato aguardando assinatura.
                  </td>
                </tr>
              )}
              {ready && pending.length > 0 && visiblePending.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    Nenhum contrato com esse filtro.
                  </td>
                </tr>
              )}
              {!ready && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    {loading ? "Carregando dados do Pipedrive..." : "Sem dados no momento."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Só aparece quando há contrato assinado recentemente (só os seus). */}
      {signed.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 px-5 pb-3 pt-4">
            <IconBox size="md">
              <CheckCircle2 className="h-[18px] w-[18px]" />
            </IconBox>
            <div className="leading-tight">
              <h2 className="text-base font-semibold">Assinados recentemente</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Últimos {data?.windowDays ?? 7} dias, mais recentes primeiro.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-[13px]">
              <thead className="border-y border-border bg-muted/50">
                <tr>
                  <th className={th}>Representante</th>
                  <th className={th}>Contato</th>
                  <th className={th}>Assinado em</th>
                  <th className={th}>Tempo até assinar</th>
                  <th className={th}>Tags</th>
                  <th className={th}>Comentários</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {signed.map((row) => {
                  const at = signedAtOf(row);
                  const lag = row.sentAt && at ? daysBetween(row.sentAt, at) : null;
                  return (
                    <tr key={row.id} className={rowTint(notes, row)}>
                      <td className={td}>
                        <NameCell notes={notes} row={row} />
                      </td>
                      <td className={td}>
                        <ContactCell notes={notes} row={row} />
                      </td>
                      <td className={td}>{at ? formatDateTime(at) : "Sem data"}</td>
                      <td className={cn(td, "text-muted-foreground")}>
                        {lag === null ? "Sem data" : lag <= 0 ? "No mesmo dia" : formatWaiting(lag)}
                      </td>
                      <td className={td}>
                        <TagsCell notes={notes} row={row} />
                      </td>
                      <td className={td}>
                        <ActionsCell notes={notes} row={row} onComment={() => setDrawerId(row.id)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Fonte: Pipedrive (funil [REP] Reunião Agendada, etapa "Assinatura de Contrato"). Assinado é o negócio dessa
        etapa marcado como ganho. As tags "Assinatura pendente" e "Contrato assinado" definem em qual lista o contrato
        aparece. Nome, telefone, e-mail, tags, comentários e leads adicionados por você ficam salvos neste navegador.
        Atualiza sozinho a cada 5 minutos.
        {data && data.hidden.pending + data.hidden.signed > 0
          ? ` Não aparecem ${data.hidden.pending} pendente(s) e ${data.hidden.signed} assinado(s) de outros responsáveis.`
          : ""}
      </p>

      {adding && <AddLeadModal notes={notes} onClose={() => setAdding(false)} />}
      {drawerRow && <ContractDrawer notes={notes} row={drawerRow} onClose={() => setDrawerId(null)} />}
    </div>
  );
}
