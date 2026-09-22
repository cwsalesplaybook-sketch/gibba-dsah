import { useLocalStorageState } from "@/lib/useLocalStorageState";

// Tags, atividades (comentários com um tipo) e contato dos leads em follow-up. Tudo fica
// salvo neste navegador (localStorage), indexado pelo id do negócio no Pipedrive (ou por
// um id negativo, no caso de leads adicionados à mão).
export type TagColor = "green" | "red" | "amber" | "blue" | "gray" | "rose";

export type Tag = { id: string; name: string; color: TagColor };
export type ActivityType = "ligacao" | "whatsapp" | "email" | "reuniao" | "nota";
export type Activity = { id: string; type: ActivityType; text: string; at: string };

export const activityTypeInfo: Record<ActivityType, { label: string }> = {
  ligacao: { label: "Ligação" },
  whatsapp: { label: "WhatsApp" },
  email: { label: "E-mail" },
  reuniao: { label: "Reunião" },
  nota: { label: "Anotação" },
};
export const activityTypeOptions = Object.keys(activityTypeInfo) as ActivityType[];

// name/phone/email são digitados à mão (não vêm do Pipedrive, rota pública não expõe contato).
type Entry = { tagIds: string[]; activities: Activity[]; name?: string; phone?: string; email?: string };
// Lead adicionado à mão (não existe no Pipedrive).
export type ManualLead = { id: number; name: string; stageName: string; enteredStageAt: string };
type Store = { tags: Tag[]; byDeal: Record<string, Entry>; manual: ManualLead[] };

// Tags que já vêm prontas (podem apagar as próprias, essas não).
export const DEFAULT_TAGS: Tag[] = [
  { id: "feito", name: "Follow-up feito", color: "green" },
  { id: "sem-resposta", name: "Sem resposta", color: "red" },
  { id: "reagendar", name: "Reagendar", color: "amber" },
];

const DEFAULT_STORE: Store = { tags: DEFAULT_TAGS, byDeal: {}, manual: [] };
const EMPTY: Entry = { tagIds: [], activities: [] };

// Mesmos estilos de cor da aba de Assinatura de Contrato, pra manter consistência visual.
export const tagStyles: Record<TagColor, { label: string; chip: string; dot: string }> = {
  green: { label: "Verde", chip: "bg-success/10 text-success", dot: "bg-success" },
  red: { label: "Vermelho", chip: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  amber: { label: "Amarelo", chip: "bg-warning/20 text-[oklch(42%_0.1_70)]", dot: "bg-warning" },
  blue: { label: "Azul", chip: "bg-[oklch(95%_0.03_250)] text-[oklch(42%_0.14_255)]", dot: "bg-[oklch(60%_0.15_255)]" },
  gray: { label: "Cinza", chip: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  rose: { label: "Rosa", chip: "bg-accent text-accent-foreground", dot: "bg-primary" },
};
export const tagColorOptions = Object.keys(tagStyles) as TagColor[];

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const normalize = (value: Store | undefined | null): Store => ({
  tags: Array.isArray(value?.tags) && value.tags.length > 0 ? value.tags : DEFAULT_TAGS,
  byDeal: value?.byDeal ?? {},
  manual: Array.isArray(value?.manual) ? value.manual : [],
});

export function useFollowupNotes() {
  const [stored, setStore] = useLocalStorageState<Store>("gibba:followups", DEFAULT_STORE);
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
      tagIds: entry.tagIds.includes(tagId) ? entry.tagIds.filter((id) => id !== tagId) : [...entry.tagIds, tagId],
    }));
  }

  // Nome, telefone e e-mail do lead, digitados à mão (ficam só neste navegador).
  function setContact(dealId: number, data: { name: string; phone: string; email: string }) {
    update(dealId, (entry) => ({ ...entry, name: data.name.trim(), phone: data.phone.trim(), email: data.email.trim() }));
  }

  // Nome para exibir: o digitado à mão, senão o do Pipedrive.
  const displayName = (dealId: number, fallback: string) => store.byDeal[String(dealId)]?.name?.trim() || fallback;

  // Lead que não veio do Pipedrive: entra na lista igual aos outros, com etapa "Follow-up".
  function addManualLead(data: { name: string; phone: string; email: string }): ManualLead | null {
    const name = data.name.trim();
    if (!name) return null;
    const lead: ManualLead = {
      id: -Math.floor(Date.now() + Math.random() * 1000),
      name,
      stageName: "Follow-up",
      enteredStageAt: new Date().toISOString(),
    };
    setStore((prevRaw) => {
      const prev = normalize(prevRaw);
      return {
        ...prev,
        manual: [...prev.manual, lead],
        byDeal: { ...prev.byDeal, [String(lead.id)]: { ...EMPTY, name, phone: data.phone.trim(), email: data.email.trim() } },
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

  function addActivity(dealId: number, type: ActivityType, text: string) {
    const clean = text.trim();
    if (!clean) return;
    update(dealId, (entry) => ({
      ...entry,
      activities: [{ id: uid(), type, text: clean, at: new Date().toISOString() }, ...entry.activities],
    }));
  }

  function deleteActivity(dealId: number, activityId: string) {
    update(dealId, (entry) => ({ ...entry, activities: entry.activities.filter((a) => a.id !== activityId) }));
  }

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
    addActivity,
    deleteActivity,
    createTag,
    deleteTag,
  };
}

export type FollowupNotesApi = ReturnType<typeof useFollowupNotes>;
