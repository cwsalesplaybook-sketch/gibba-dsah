import { useLocalStorageState } from "@/lib/useLocalStorageState";

// Tags e comentários por contrato. Ficam salvos neste navegador (localStorage),
// indexados pelo id do negócio no Pipedrive.
export type TagColor = "green" | "red" | "amber" | "blue" | "gray" | "rose";

export type Tag = { id: string; name: string; color: TagColor };
export type Comment = { id: string; text: string; at: string };
type Entry = { tagIds: string[]; comments: Comment[] };
type Store = { tags: Tag[]; byDeal: Record<string, Entry> };

// Tags que já vêm prontas (não podem ser apagadas).
export const DEFAULT_TAGS: Tag[] = [
  { id: "assinado", name: "Contrato assinado", color: "green" },
  { id: "pendente", name: "Assinatura pendente", color: "red" },
];

const DEFAULT_STORE: Store = { tags: DEFAULT_TAGS, byDeal: {} };
const EMPTY: Entry = { tagIds: [], comments: [] };

// Estilos de cada cor (formais): chip, bolinha e leve tinta na linha da tabela.
export const tagStyles: Record<TagColor, { label: string; chip: string; dot: string; row: string }> = {
  green: { label: "Verde", chip: "bg-success/10 text-success", dot: "bg-success", row: "bg-success/5" },
  red: { label: "Vermelho", chip: "bg-destructive/10 text-destructive", dot: "bg-destructive", row: "bg-destructive/5" },
  amber: { label: "Amarelo", chip: "bg-warning/20 text-[oklch(42%_0.1_70)]", dot: "bg-warning", row: "bg-warning/10" },
  blue: { label: "Azul", chip: "bg-[oklch(95%_0.03_250)] text-[oklch(42%_0.14_255)]", dot: "bg-[oklch(60%_0.15_255)]", row: "bg-[oklch(97%_0.02_250)]" },
  gray: { label: "Cinza", chip: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", row: "bg-muted/40" },
  rose: { label: "Rosa", chip: "bg-accent text-accent-foreground", dot: "bg-primary", row: "bg-accent/40" },
};

export const tagColorOptions = Object.keys(tagStyles) as TagColor[];

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function useContractNotes() {
  const [stored, setStore] = useLocalStorageState<Store>("gibba:contratos", DEFAULT_STORE);

  // Garante o formato mesmo se algo antigo/incompleto estiver salvo.
  const normalize = (value: Store | undefined | null): Store => ({
    tags: Array.isArray(value?.tags) && value.tags.length > 0 ? value.tags : DEFAULT_TAGS,
    byDeal: value?.byDeal ?? {},
  });
  const store = normalize(stored);

  const entryOf = (dealId: number): Entry => store.byDeal[String(dealId)] ?? EMPTY;

  function update(dealId: number, fn: (entry: Entry) => Entry) {
    setStore((prevRaw) => {
      const prev = normalize(prevRaw);
      const current = prev.byDeal[String(dealId)] ?? EMPTY;
      return { ...prev, byDeal: { ...prev.byDeal, [String(dealId)]: fn(current) } };
    });
  }

  function toggleTag(dealId: number, tagId: string) {
    update(dealId, (entry) => ({
      ...entry,
      tagIds: entry.tagIds.includes(tagId)
        ? entry.tagIds.filter((id) => id !== tagId)
        : [...entry.tagIds, tagId],
    }));
  }

  function addComment(dealId: number, text: string) {
    const clean = text.trim();
    if (!clean) return;
    update(dealId, (entry) => ({
      ...entry,
      comments: [{ id: uid(), text: clean, at: new Date().toISOString() }, ...entry.comments],
    }));
  }

  function deleteComment(dealId: number, commentId: string) {
    update(dealId, (entry) => ({
      ...entry,
      comments: entry.comments.filter((comment) => comment.id !== commentId),
    }));
  }

  // Cria uma tag nova; devolve a tag (ou a já existente com o mesmo nome).
  function createTag(name: string, color: TagColor): Tag | null {
    const clean = name.trim();
    if (!clean) return null;
    const existing = store.tags.find((tag) => tag.name.toLowerCase() === clean.toLowerCase());
    if (existing) return existing;
    const tag: Tag = { id: uid(), name: clean, color };
    setStore((prevRaw) => {
      const prev = normalize(prevRaw);
      return { ...prev, tags: [...prev.tags, tag] };
    });
    return tag;
  }

  // Só tags criadas por ela podem ser apagadas; sai também de todos os contratos.
  function deleteTag(tagId: string) {
    if (DEFAULT_TAGS.some((tag) => tag.id === tagId)) return;
    setStore((prevRaw) => {
      const prev = normalize(prevRaw);
      const byDeal: Record<string, Entry> = {};
      for (const [key, entry] of Object.entries(prev.byDeal)) {
        byDeal[key] = { ...entry, tagIds: entry.tagIds.filter((id) => id !== tagId) };
      }
      return { tags: prev.tags.filter((tag) => tag.id !== tagId), byDeal };
    });
  }

  return { tags: store.tags, entryOf, toggleTag, addComment, deleteComment, createTag, deleteTag };
}

export type ContractNotesApi = ReturnType<typeof useContractNotes>;
