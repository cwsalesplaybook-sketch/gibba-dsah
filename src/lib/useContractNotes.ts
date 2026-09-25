import { useLocalStorageState } from "@/lib/useLocalStorageState";

// Tags, comentários, dados do lead e leads manuais. Tudo fica salvo neste navegador
// (localStorage), indexado pelo id do negócio no Pipedrive (ou por um id negativo, no caso
// de leads adicionados à mão).
export type TagColor = "green" | "red" | "amber" | "blue" | "gray" | "rose";

export type Tag = { id: string; name: string; color: TagColor };
export type Comment = { id: string; text: string; at: string };
// name/phone/email são digitados à mão pela usuária (não vêm do Pipedrive); o nome digitado
// tem prioridade sobre o nome do negócio. signedAt = quando ela marcou "Contrato assinado".
type Entry = {
  tagIds: string[];
  comments: Comment[];
  name?: string;
  phone?: string;
  email?: string;
  signedAt?: string;
};
// Lead adicionado à mão (não existe no Pipedrive).
export type ManualLead = { id: number; name: string; sentAt: string };
type Store = { tags: Tag[]; byDeal: Record<string, Entry>; manual: ManualLead[] };

// Tags que já vêm prontas (não podem ser apagadas). Elas também decidem em que lista o
// contrato aparece: "Contrato assinado" vai para Assinados, "Assinatura pendente" para Aguardando.
export const SIGNED_TAG_ID = "assinado";
export const PENDING_TAG_ID = "pendente";
export const DEFAULT_TAGS: Tag[] = [
  { id: SIGNED_TAG_ID, name: "Contrato assinado", color: "green" },
  { id: PENDING_TAG_ID, name: "Assinatura pendente", color: "red" },
];

const DEFAULT_STORE: Store = { tags: DEFAULT_TAGS, byDeal: {}, manual: [] };
const EMPTY: Entry = { tagIds: [], comments: [] };

// Estilos de cada cor (formais): chip, bolinha e leve tinta na linha da tabela.
export const tagStyles: Record<TagColor, { label: string; chip: string; dot: string; row: string }> = {
  green: { label: "Verde", chip: "bg-success/10 text-success", dot: "bg-success", row: "bg-success/5" },
  red: { label: "Vermelho", chip: "bg-destructive/10 text-destructive", dot: "bg-destructive", row: "bg-destructive/5" },
  amber: { label: "Amarelo", chip: "bg-warning/15 text-warning", dot: "bg-warning", row: "bg-warning/10" },
  blue: { label: "Azul", chip: "bg-[oklch(35%_0.1_255/0.35)] text-[oklch(80%_0.1_255)]", dot: "bg-[oklch(70%_0.14_255)]", row: "bg-[oklch(35%_0.1_255/0.12)]" },
  gray: { label: "Cinza", chip: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", row: "bg-muted/40" },
  rose: { label: "Rosa", chip: "bg-accent text-accent-foreground", dot: "bg-primary", row: "bg-accent/40" },
};

export const tagColorOptions = Object.keys(tagStyles) as TagColor[];

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// Garante o formato mesmo se algo antigo/incompleto estiver salvo.
const normalize = (value: Store | undefined | null): Store => ({
  tags: Array.isArray(value?.tags) && value.tags.length > 0 ? value.tags : DEFAULT_TAGS,
  byDeal: value?.byDeal ?? {},
  manual: Array.isArray(value?.manual) ? value.manual : [],
});

export function useContractNotes() {
  const [stored, setStore] = useLocalStorageState<Store>("gibba:contratos", DEFAULT_STORE);
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
    update(dealId, (entry) => {
      const turningOn = !entry.tagIds.includes(tagId);
      const next: Entry = {
        ...entry,
        tagIds: turningOn ? [...entry.tagIds, tagId] : entry.tagIds.filter((id) => id !== tagId),
      };
      if (tagId === SIGNED_TAG_ID) {
        // guarda quando ela marcou como assinado (aparece em "Assinado em")
        if (turningOn) next.signedAt = new Date().toISOString();
        else delete next.signedAt;
      }
      return next;
    });
  }

  // Nome, telefone e e-mail do lead, digitados à mão (ficam só neste navegador).
  function setContact(dealId: number, data: { name: string; phone: string; email: string }) {
    update(dealId, (entry) => ({
      ...entry,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    }));
  }

  // Nome para exibir: o digitado à mão, senão o do Pipedrive.
  const displayName = (dealId: number, fallback: string) => store.byDeal[String(dealId)]?.name?.trim() || fallback;

  // Lead que não veio do Pipedrive: entra na lista de aguardando assinatura.
  function addManualLead(data: { name: string; phone: string; email: string; sentAt: string }): ManualLead | null {
    const name = data.name.trim();
    if (!name) return null;
    const lead: ManualLead = { id: -Math.floor(Date.now() + Math.random() * 1000), name, sentAt: data.sentAt };
    setStore((prevRaw) => {
      const prev = normalize(prevRaw);
      return {
        ...prev,
        manual: [...prev.manual, lead],
        byDeal: {
          ...prev.byDeal,
          [String(lead.id)]: { ...EMPTY, name, phone: data.phone.trim(), email: data.email.trim() },
        },
      };
    });
    return lead;
  }

  function deleteManualLead(dealId: number) {
    setStore((prevRaw) => {
      const prev = normalize(prevRaw);
      const byDeal = { ...prev.byDeal };
      delete byDeal[String(dealId)];
      return { ...prev, manual: prev.manual.filter((lead) => lead.id !== dealId), byDeal };
    });
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
      return { ...prev, tags: prev.tags.filter((tag) => tag.id !== tagId), byDeal };
    });
  }

  return {
    tags: store.tags,
    manualLeads: store.manual,
    entryOf,
    displayName,
    toggleTag,
    setContact,
    addManualLead,
    deleteManualLead,
    addComment,
    deleteComment,
    createTag,
    deleteTag,
  };
}

export type ContractNotesApi = ReturnType<typeof useContractNotes>;
