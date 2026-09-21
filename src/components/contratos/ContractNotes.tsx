import { useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Check, MessageSquare, Plus, Tag as TagIcon, Trash2, X } from "lucide-react";
import {
  DEFAULT_TAGS,
  tagColorOptions,
  tagStyles,
  type ContractNotesApi,
  type Tag,
  type TagColor,
} from "@/lib/useContractNotes";
import { formatDateTime, type ContractRow } from "@/lib/useContracts";
import { cn } from "@/lib/utils";

export function TagChip({ tag }: { tag: Tag }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium",
        tagStyles[tag.color].chip
      )}
    >
      {tag.name}
    </span>
  );
}

// Lista de tags (liga/desliga) + criação de tag nova. Usado no popover e na lateral.
export function TagEditor({
  notes,
  dealId,
}: {
  notes: ContractNotesApi;
  dealId: number;
}) {
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
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-muted",
                  on && "bg-muted/60"
                )}
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
          placeholder="Ex.: Aguardando retorno"
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
                className={cn(
                  "h-5 w-5 rounded-full ring-offset-2 ring-offset-card transition",
                  tagStyles[option].dot,
                  color === option ? "ring-2 ring-foreground/50" : "opacity-70 hover:opacity-100"
                )}
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

// Chips das tags do contrato + botão "+" que abre o seletor (popover flutuante).
export function TagsCell({ notes, row }: { notes: ContractNotesApi; row: ContractRow }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = notes.entryOf(row.id).tagIds;
  const chosen = notes.tags.filter((tag) => selected.includes(tag.id));

  function toggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = 272;
      setPos({
        top: Math.min(rect.bottom + 6, window.innerHeight - 380),
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      });
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
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-dashed border-input px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary",
          chosen.length === 0 && "px-2"
        )}
      >
        {chosen.length === 0 ? (
          <>
            <TagIcon className="h-3 w-3" /> Adicionar tag
          </>
        ) : (
          <Plus className="h-3 w-3" />
        )}
      </button>

      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)} />
            <div
              className="fixed z-[71] w-[272px] rounded-xl border border-border bg-popover p-3 shadow-card"
              style={{ top: pos.top, left: pos.left }}
            >
              <p className="mb-2 truncate px-1 text-xs font-medium text-muted-foreground">
                Tags · {row.name}
              </p>
              <TagEditor notes={notes} dealId={row.id} />
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

export function CommentsButton({
  notes,
  row,
  onOpen,
}: {
  notes: ContractNotesApi;
  row: ContractRow;
  onOpen: () => void;
}) {
  const count = notes.entryOf(row.id).comments.length;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Comentários de ${row.name}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted",
        count > 0 ? "text-foreground" : "text-muted-foreground"
      )}
    >
      <MessageSquare className="h-3.5 w-3.5" />
      {count > 0 ? count : "Comentar"}
    </button>
  );
}

// Painel lateral: tags do contrato + comentários (mais novos primeiro).
export function ContractDrawer({
  notes,
  row,
  onClose,
}: {
  notes: ContractNotesApi;
  row: ContractRow;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const comments = notes.entryOf(row.id).comments;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    notes.addComment(row.id, text);
    setText("");
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-card">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-xs text-muted-foreground">Contrato</p>
            <h3 className="truncate text-lg font-semibold">{row.name}</h3>
            {row.sentAt && (
              <p className="mt-0.5 text-xs text-muted-foreground">Enviado em {formatDateTime(row.sentAt)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <section>
            <h4 className="mb-2 text-sm font-semibold">Tags</h4>
            <TagEditor notes={notes} dealId={row.id} />
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Comentários</h4>
            <form onSubmit={submit} className="space-y-2">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) submit(event);
                }}
                rows={3}
                placeholder="Escreva um comentário (ex.: cobrei no WhatsApp, retorna amanhã)…"
                className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-[13px] outline-none focus:border-primary"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Ctrl + Enter para salvar</span>
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Adicionar comentário
                </button>
              </div>
            </form>

            <ul className="mt-4 space-y-2">
              {comments.map((comment) => (
                <li key={comment.id} className="group rounded-lg border border-border bg-background px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">{formatDateTime(comment.at)}</span>
                    <button
                      type="button"
                      onClick={() => notes.deleteComment(row.id, comment.id)}
                      aria-label="Apagar comentário"
                      className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-[13px]">{comment.text}</p>
                </li>
              ))}
              {comments.length === 0 && (
                <li className="py-4 text-center text-[13px] text-muted-foreground">Nenhum comentário ainda.</li>
              )}
            </ul>
          </section>
        </div>
      </aside>
    </div>,
    document.body
  );
}
