import { useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ListPlus, Pencil, Phone, Plus, Tag as TagIcon, Trash2, X } from "lucide-react";
import {
  activityTypeInfo,
  activityTypeOptions,
  DEFAULT_TAGS,
  tagColorOptions,
  tagStyles,
  type ActivityType,
  type FollowupNotesApi,
  type Tag,
  type TagColor,
} from "@/lib/useFollowupNotes";
import { Modal } from "@/components/ui/Modal";
import { Field, Button } from "@/components/ui/Field";
import { formatDateTime } from "@/lib/useContracts";
import type { FollowupRow } from "@/lib/useFollowups";
import { cn } from "@/lib/utils";

export function TagChip({ tag }: { tag: Tag }) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium", tagStyles[tag.color].chip)}>
      {tag.name}
    </span>
  );
}

// Lista de tags (liga/desliga) + criação de tag nova.
export function TagEditor({ notes, dealId }: { notes: FollowupNotesApi; dealId: number }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<TagColor>("blue");
  const selected = notes.entryOf(dealId).tagIds;

  function submit(event: FormEvent) {
    event.preventDefault();
    const tag = notes.createTag(name, color);
    if (tag && !selected.includes(tag.id)) notes.toggleTag(dealId, tag.id);
    setName("");
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-1">
        {notes.tags.map((tag) => {
          const on = selected.includes(tag.id);
          const removable = !DEFAULT_TAGS.some((item) => item.id === tag.id);
          return (
            <li key={tag.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => notes.toggleTag(dealId, tag.id)}
                aria-pressed={on}
                className={cn("flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-muted", on && "bg-muted/60")}
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", tagStyles[tag.color].dot)} />
                <span className="flex-1 truncate">{tag.name}</span>
                {on && <Check className="h-4 w-4 text-primary" />}
              </button>
              {removable && (
                <button
                  type="button"
                  onClick={() => notes.deleteTag(tag.id)}
                  aria-label={`Apagar a tag ${tag.name}`}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={submit} className="space-y-2 border-t border-border pt-3">
        <p className="text-xs font-medium text-muted-foreground">Nova tag</p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Aguardando decisão"
          maxLength={40}
          className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-[13px] outline-none focus:border-primary"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {tagColorOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                aria-label={tagStyles[option].label}
                aria-pressed={color === option}
                className={cn("h-5 w-5 rounded-full ring-offset-2 ring-offset-card transition", tagStyles[option].dot, color === option ? "ring-2 ring-foreground/50" : "opacity-70 hover:opacity-100")}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Criar
          </button>
        </div>
      </form>
    </div>
  );
}

// Chips das tags do card + botão "+" que abre o seletor (popover flutuante).
export function TagsRow({ notes, row }: { notes: FollowupNotesApi; row: FollowupRow }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = notes.entryOf(row.id).tagIds;
  const chosen = notes.tags.filter((tag) => selected.includes(tag.id));

  function toggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = 272;
      setPos({ top: Math.min(rect.bottom + 6, window.innerHeight - 380), left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) });
    }
    setOpen((value) => !value);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chosen.map((tag) => (
        <TagChip key={tag.id} tag={tag} />
      ))}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={`Editar tags de ${row.name}`}
        className={cn("inline-flex items-center gap-1 rounded-md border border-dashed border-input px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary", chosen.length === 0 && "px-2")}
      >
        {chosen.length === 0 ? (
          <>
            <TagIcon className="h-3 w-3" /> Tag
          </>
        ) : (
          <Plus className="h-3 w-3" />
        )}
      </button>

      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)} />
            <div className="fixed z-[71] w-[272px] rounded-xl border border-border bg-popover p-3 shadow-card" style={{ top: pos.top, left: pos.left }}>
              <p className="mb-2 truncate px-1 text-xs font-medium text-muted-foreground">Tags · {row.name}</p>
              <TagEditor notes={notes} dealId={row.id} />
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

export function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const full = digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${full}`;
}

// Telefone/e-mail do lead, digitados à mão. Mostra um botão discreto quando ainda não tem.
export function ContactLine({ notes, row }: { notes: FollowupNotesApi; row: FollowupRow }) {
  const entry = notes.entryOf(row.id);
  const phone = entry.phone ?? "";
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [phoneDraft, setPhoneDraft] = useState(phone);
  const [emailDraft, setEmailDraft] = useState(entry.email ?? "");
  const wa = phone ? whatsappLink(phone) : null;

  function startEdit() {
    setNameDraft(notes.displayName(row.id, row.name));
    setPhoneDraft(phone);
    setEmailDraft(entry.email ?? "");
    setEditing(true);
  }

  function save(event?: FormEvent) {
    event?.preventDefault();
    notes.setContact(row.id, { name: nameDraft, phone: phoneDraft, email: emailDraft });
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={save} onKeyDown={(e) => e.key === "Escape" && setEditing(false)} className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="Nome completo" maxLength={80} className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-primary" />
        <input inputMode="tel" value={phoneDraft} onChange={(e) => setPhoneDraft(e.target.value)} placeholder="Telefone, ex.: (11) 99999-9999" maxLength={30} className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-primary" />
        <input type="email" value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} placeholder="E-mail (opcional)" maxLength={80} className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-primary" />
        <div className="flex gap-1.5">
          <button type="submit" className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90">Salvar</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
        </div>
      </form>
    );
  }

  if (!phone) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          startEdit();
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-input px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Phone className="h-3 w-3" /> Adicionar contato
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm" onClick={(e) => e.stopPropagation()}>
      {wa ? (
        <a href={wa} target="_blank" rel="noreferrer" title="Abrir no WhatsApp" className="font-medium text-primary-deep hover:underline">
          {phone}
        </a>
      ) : (
        <span className="font-medium">{phone}</span>
      )}
      <button type="button" onClick={startEdit} aria-label="Editar contato" className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ActivitiesButton({ notes, row, onOpen }: { notes: FollowupNotesApi; row: FollowupRow; onOpen: () => void }) {
  const count = notes.entryOf(row.id).activities.length;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Atividades de ${row.name}`}
      className={cn("inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted", count > 0 ? "text-foreground" : "text-muted-foreground")}
    >
      <ListPlus className="h-3.5 w-3.5" />
      {count > 0 ? `${count} atividade${count > 1 ? "s" : ""}` : "Registrar atividade"}
    </button>
  );
}

// Painel lateral: tags + atividades (cada uma com um tipo: ligação, WhatsApp, e-mail...).
export function FollowupDrawer({ notes, row, onClose }: { notes: FollowupNotesApi; row: FollowupRow; onClose: () => void }) {
  const [type, setType] = useState<ActivityType>("nota");
  const [text, setText] = useState("");
  const activities = notes.entryOf(row.id).activities;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    notes.addActivity(row.id, type, text);
    setText("");
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-card">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-xs text-muted-foreground">Follow-up · {row.stageName}</p>
            <h3 className="truncate text-lg font-semibold">{notes.displayName(row.id, row.name)}</h3>
            {row.enteredStageAt && <p className="mt-0.5 text-xs text-muted-foreground">Nessa etapa desde {formatDateTime(row.enteredStageAt)}</p>}
          </div>
          <button onClick={onClose} aria-label="Fechar" className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <section>
            <h4 className="mb-2 text-sm font-semibold">Contato</h4>
            <ContactLine notes={notes} row={row} />
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Tags</h4>
            <TagEditor notes={notes} dealId={row.id} />
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Atividades</h4>
            <form onSubmit={submit} className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {activityTypeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setType(option)}
                    aria-pressed={type === option}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      type === option ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {activityTypeInfo[option].label}
                  </button>
                ))}
              </div>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) submit(event);
                }}
                rows={3}
                placeholder="O que rolou? Ex.: liguei, não atendeu, tentar de novo amanhã…"
                className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-[13px] outline-none focus:border-primary"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Ctrl + Enter para salvar</span>
                <button type="submit" disabled={!text.trim()} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40">
                  Registrar
                </button>
              </div>
            </form>

            <ul className="mt-4 space-y-2">
              {activities.map((activity) => (
                <li key={activity.id} className="group rounded-lg border border-border bg-background px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="rounded-full bg-accent px-1.5 py-0.5 font-medium text-accent-foreground">{activityTypeInfo[activity.type].label}</span>
                      {formatDateTime(activity.at)}
                    </span>
                    <button
                      type="button"
                      onClick={() => notes.deleteActivity(row.id, activity.id)}
                      aria-label="Apagar atividade"
                      className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-[13px]">{activity.text}</p>
                </li>
              ))}
              {activities.length === 0 && <li className="py-4 text-center text-[13px] text-muted-foreground">Nenhuma atividade ainda.</li>}
            </ul>
          </section>
        </div>
      </aside>
    </div>,
    document.body
  );
}

// Formulário do botão "+": lead que não veio do Pipedrive entra na lista igual aos outros.
export function AddLeadModal({ notes, onClose }: { notes: FollowupNotesApi; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function save() {
    if (!name.trim()) return;
    notes.addManualLead({ name, phone, email });
    onClose();
  }

  const onEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") save();
  };

  return (
    <Modal
      title="Adicionar lead pro follow-up"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} disabled={!name.trim()} className="disabled:opacity-40">Adicionar</Button>
        </>
      }
    >
      <Field label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onEnter} autoFocus maxLength={80} />
      <Field label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={onEnter} inputMode="tel" placeholder="(11) 99999-9999" maxLength={30} />
      <Field label="E-mail (opcional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onEnter} maxLength={80} />
      <p className="text-xs text-muted-foreground">Pra gente que não veio do Pipedrive. Os dados ficam salvos só neste navegador.</p>
    </Modal>
  );
}
