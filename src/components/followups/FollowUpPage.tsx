import { useMemo, useState } from "react";
import { AlertTriangle, ListChecks, Plus, RefreshCw, Repeat, Trash2, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/metas/parts";
import {
  ActivitiesButton,
  AddLeadModal,
  ContactLine,
  FollowupDrawer,
  TagsRow,
} from "@/components/followups/FollowupNotes";
import { daysBetween, formatWaiting } from "@/lib/useContracts";
import { useFollowups, type FollowupRow } from "@/lib/useFollowups";
import { useFollowupNotes, type FollowupNotesApi } from "@/lib/useFollowupNotes";
import { cn } from "@/lib/utils";

// Igual ao "parado" (rotten) do Pipedrive: 2+ dias na mesma etapa sem avançar.
const LATE_AFTER_DAYS = 2;

function Kpi({ label, value, hint, icon: Icon, alert = false }: { label: string; value: number | string; hint: string; icon: typeof Users; alert?: boolean }) {
  return (
    <Card className="px-5 pb-4 pt-4">
      <div className="flex items-center gap-3">
        <IconBox size="md">
          <Icon className="h-[18px] w-[18px]" />
        </IconBox>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className={cn("mt-3 text-[28px] font-semibold leading-9", alert && "text-destructive")}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

// Card do lead (não é kanban: sem colunas por etapa, é uma grade solta de cards).
function FollowUpCard({ notes, row, late, onOpen, onDelete }: { notes: FollowupNotesApi; row: FollowupRow; late: boolean; onOpen: () => void; onDelete?: () => void }) {
  const name = notes.displayName(row.id, row.name);
  const waiting = row.enteredStageAt ? daysBetween(row.enteredStageAt) : null;
  const activities = notes.entryOf(row.id).activities;
  const last = activities[0];

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-semibold">
            {name}
            {row.manual && <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Manual</span>}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{row.stageName}</p>
        </div>
        {onDelete && (
          <button onClick={onDelete} aria-label="Remover lead" className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {waiting !== null && (
        <p className={cn("text-xs font-medium", late ? "text-destructive" : "text-muted-foreground")}>
          {late && <AlertTriangle className="mr-1 inline h-3 w-3 -translate-y-px" />}
          Nessa etapa há {formatWaiting(waiting).toLowerCase()}
        </p>
      )}

      <TagsRow notes={notes} row={row} />
      <ContactLine notes={notes} row={row} />

      <p className="line-clamp-2 min-h-[2.5em] text-xs text-muted-foreground">
        {last ? last.text : "Nenhuma atividade registrada ainda."}
      </p>

      <ActivitiesButton notes={notes} row={row} onOpen={onOpen} />
    </Card>
  );
}

export function FollowUpPage() {
  const { data, loading, error, refresh } = useFollowups();
  const notes = useFollowupNotes();
  const [stageFilter, setStageFilter] = useState<"all" | "late" | number>("all");
  const [adding, setAdding] = useState(false);
  const [openRow, setOpenRow] = useState<FollowupRow | null>(null);

  const rows = useMemo<FollowupRow[]>(() => {
    const fromPipedrive = data?.rows ?? [];
    const manual: FollowupRow[] = notes.manualLeads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      owner: null,
      stageId: 0,
      stageName: lead.stageName,
      enteredStageAt: lead.enteredStageAt,
      manual: true,
    }));
    return [...fromPipedrive, ...manual].sort((a, b) => new Date(a.enteredStageAt ?? 0).getTime() - new Date(b.enteredStageAt ?? 0).getTime());
  }, [data, notes.manualLeads]);

  const isLate = (row: FollowupRow) => Boolean(row.enteredStageAt) && daysBetween(row.enteredStageAt as string) >= LATE_AFTER_DAYS;
  const lateCount = rows.filter(isLate).length;
  const noContactCount = rows.filter((row) => !notes.entryOf(row.id).phone).length;

  const visible = rows.filter((row) => {
    if (stageFilter === "all") return true;
    if (stageFilter === "late") return isLate(row);
    return row.stageId === stageFilter;
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Follow-up</h1>
          <p className="text-sm text-muted-foreground">Controle de follow-up pós-reunião: quem já teve a reunião e ainda não chegou no contrato.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} aria-label="Atualizar" title="Atualizar" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Adicionar lead
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-6" style={{ backgroundImage: "var(--gradient-surface)" }}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
          <Repeat className="h-4 w-4" />
          Reunião Agendada, funil dela
        </div>
        <p className="mt-2 text-sm text-primary-foreground/90">
          Todo mundo que já teve a reunião e está em 1º Dia, 3º Dia, Negociação ou Break Up — sem contar quem já está na Assinatura de Contrato.
        </p>
      </Card>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}, mostrando só os leads adicionados à mão até reconectar.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kpi label="Follow-ups em aberto" value={rows.length} hint="Nas etapas depois da reunião" icon={Users} />
        <Kpi label="Atrasados" value={lateCount} hint={`${LATE_AFTER_DAYS}+ dias na mesma etapa`} icon={AlertTriangle} alert={lateCount > 0} />
        <Kpi label="Sem contato salvo" value={noContactCount} hint="Sem telefone pra falar com a pessoa" icon={ListChecks} />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={stageFilter === "all"} onClick={() => setStageFilter("all")}>Todas ({rows.length})</FilterChip>
        <FilterChip active={stageFilter === "late"} onClick={() => setStageFilter("late")}>Atrasados ({lateCount})</FilterChip>
        {(data?.stages ?? []).map((stage) => (
          <FilterChip key={stage.id} active={stageFilter === stage.id} onClick={() => setStageFilter(stage.id)}>
            {stage.name}
          </FilterChip>
        ))}
      </div>

      {loading && rows.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">Carregando follow-ups do Pipedrive...</p>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="tile h-11 w-11 rounded-xl">
            <ListChecks className="h-5 w-5" />
          </span>
          <p className="font-semibold text-foreground">Nada por aqui</p>
          <p className="max-w-sm text-sm text-muted-foreground">Ninguém precisa de follow-up nesse filtro agora.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => (
            <FollowUpCard
              key={row.id}
              notes={notes}
              row={row}
              late={isLate(row)}
              onOpen={() => setOpenRow(row)}
              onDelete={row.manual ? () => notes.deleteManualLead(row.id) : undefined}
            />
          ))}
        </div>
      )}

      {adding && <AddLeadModal notes={notes} onClose={() => setAdding(false)} />}
      {openRow && <FollowupDrawer notes={notes} row={openRow} onClose={() => setOpenRow(null)} />}
    </div>
  );
}
