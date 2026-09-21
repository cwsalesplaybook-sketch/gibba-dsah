import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import { baseKnowledge } from "./baseKnowledge";
import { chunkText } from "./chunk";
import { DEFAULT_FALLBACK, scriptToItems, useScript } from "./script";
import { buildIndex, confidenceOf, search, type Feedback, type Hit, type KnowledgeItem } from "./search";
import { normalize, tokenize } from "./text";

export type Taught = {
  id: string;
  title: string;
  text: string;
  aliases: string[];
  createdAt: string;
  updatedAt: string;
};

export type TaughtInput = { title: string; text: string; aliases?: string[] };

type Store = { taught: Taught[]; feedback: Feedback };

export type HitView = {
  itemId: string;
  title: string;
  group?: string;
  source: KnowledgeItem["source"];
  sectionId?: string;
  excerpt: string;
};

/** Pergunta que a Gabi pode escolher com um clique. */
export type Choice = { label: string; itemId: string };

export type Message = {
  id: string;
  role: "user" | "luzia";
  text: string;
  at: string;
  /** Pergunta que originou esta resposta. */
  query?: string;
  confidence?: "alta" | "media" | "baixa";
  hits?: HitView[];
  /** Outras perguntas sugeridas depois da resposta (botões do script). */
  options?: Choice[];
  rating?: "up" | "down";
  /** Preenchido quando a Gabi ensinou a resposta a partir desta mensagem. */
  taughtId?: string;
};

export type CatalogGroup = { category: string; choices: Choice[] };

const EMPTY_STORE: Store = { taught: [], feedback: { good: {}, bad: {} } };
const MAX_MESSAGES = 40;
const MAX_FEEDBACK_PER_ITEM = 8;
// A Luzia "pensa" um pouco antes de responder.
const THINK_MS = { answer: [2000, 3200], smalltalk: [1200, 1800] } as const;

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const GREETINGS = new Set(["oi", "ola", "opa", "bom", "boa", "dia", "tarde", "noite", "e", "ai", "tudo", "bem", "luzia", "eai", "salve"]);
const THANKS = new Set(["obrigado", "obrigada", "valeu", "brigado", "brigada", "thanks", "show", "top", "perfeito", "ok", "certo", "otimo"]);
// Perguntas que aparecem quando ela não entende e não há nada parecido no script.
const STARTER_IDS = ["sc:023", "sc:022", "sc:032", "sc:034"];

function toHitView(hit: Hit): HitView {
  return {
    itemId: hit.item.id,
    title: hit.item.title,
    group: hit.item.group,
    source: hit.item.source,
    sectionId: hit.item.sectionId,
    excerpt: hit.excerpt,
  };
}

function unique(list: string[], limit: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of list) {
    const key = normalize(entry).trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out.slice(-limit);
}

function normalizeStore(raw: unknown): Store {
  const value = (raw ?? {}) as Partial<Store>;
  return {
    taught: Array.isArray(value.taught) ? value.taught : [],
    feedback: {
      good: value.feedback?.good ?? {},
      bad: value.feedback?.bad ?? {},
    },
  };
}

const randomBetween = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);

export function useLuzia() {
  const [rawStore, setStore] = useLocalStorageState<Store>("puma:luzia", EMPTY_STORE);
  const [messages, setMessages] = useLocalStorageState<Message[]>("puma:luzia:chat", []);
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const store = useMemo(() => normalizeStore(rawStore), [rawStore]);
  const script = useScript();

  useEffect(() => () => clearTimeout(timer.current), []);

  const scriptItems = useMemo(() => scriptToItems(script.entries), [script.entries]);
  const items = useMemo<KnowledgeItem[]>(
    () => [
      ...scriptItems,
      ...baseKnowledge,
      ...store.taught.map<KnowledgeItem>((t) => ({
        id: `t:${t.id}`,
        title: t.title,
        text: t.text,
        source: "ensinado",
        group: "Ensinado por você",
        aliases: t.aliases,
      })),
    ],
    [scriptItems, store.taught]
  );
  const index = useMemo(() => buildIndex(items, store.feedback), [items, store.feedback]);
  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const catalog = useMemo<CatalogGroup[]>(() => {
    const groups = new Map<string, Choice[]>();
    for (const item of items) {
      if (item.source !== "script" && item.source !== "ensinado") continue;
      const category = item.group ?? "Outros";
      groups.set(category, [...(groups.get(category) ?? []), { label: item.title, itemId: item.id }]);
    }
    return [...groups].map(([category, choices]) => ({ category, choices }));
  }, [items]);

  const push = (...added: Message[]) =>
    setMessages((prev) => [...prev, ...added].slice(-MAX_MESSAGES));

  const luzia = (text: string, extra: Partial<Message> = {}): Message => ({
    id: uid(),
    role: "luzia",
    text,
    at: new Date().toISOString(),
    ...extra,
  });

  /** Mostra a pergunta na hora e entrega a resposta depois de alguns segundos de "pensamento". */
  function deliver(userText: string, answer: Message, kind: keyof typeof THINK_MS = "answer") {
    clearTimeout(timer.current);
    push({ id: uid(), role: "user", text: userText, at: new Date().toISOString() });
    setThinking(true);
    timer.current = setTimeout(() => {
      push(answer);
      setThinking(false);
    }, randomBetween(THINK_MS[kind]));
  }

  const choicesFor = (item: KnowledgeItem): Choice[] =>
    (item.options ?? []).filter((option) => byId.has(option.itemId));

  // Sugestões quando a pergunta cai fora do script: o que mais se parece, ou as perguntas mais comuns.
  function suggestionsFor(query: string): Choice[] {
    const similar = search(index, query, store.feedback, 12)
      .filter((hit) => (hit.item.source === "script" || hit.item.source === "ensinado") && hit.coverage >= 0.45)
      .slice(0, 4)
      .map((hit) => ({ label: hit.item.title, itemId: hit.item.id }));
    if (similar.length >= 3) return similar;
    const starters = STARTER_IDS.map((id) => byId.get(id)).filter((item): item is KnowledgeItem => Boolean(item));
    const seen = new Set(similar.map((choice) => choice.itemId));
    return [...similar, ...starters.filter((item) => !seen.has(item.id)).map((item) => ({ label: item.title, itemId: item.id }))].slice(0, 4);
  }

  function ask(question: string) {
    if (thinking) return;
    const query = question.trim();
    if (!query) return;
    const words = normalize(query).split(/[^a-z0-9]+/).filter(Boolean);

    if (words.length && words.every((w) => GREETINGS.has(w))) {
      deliver(query, luzia("Oi! Eu sou a Luzia. Pergunte sobre o programa, os scripts, as comissões ou os templates, ou escolha uma das perguntas abaixo.", { options: suggestionsFor("") }), "smalltalk");
      return;
    }
    if (words.length && words.every((w) => THANKS.has(w))) {
      deliver(query, luzia("Por nada! Se surgir outra dúvida, é só perguntar."), "smalltalk");
      return;
    }
    if (tokenize(query).length === 0) {
      deliver(query, luzia("Não consegui entender a pergunta. Pode escrever com outras palavras, por exemplo: “Como funciona a comissão?”", { options: suggestionsFor("") }), "smalltalk");
      return;
    }

    const hits = search(index, query, store.feedback, 4);
    const confidence = confidenceOf(hits);

    if (confidence === "baixa") {
      const fallback = scriptItems.find((item) => item.fallback)?.fallback ?? DEFAULT_FALLBACK;
      deliver(query, luzia(fallback, { query, confidence, hits: [], options: suggestionsFor(query) }));
      return;
    }

    const [primary, ...others] = hits;
    // Depois da resposta, vêm as perguntas relacionadas do script; sem elas, o que mais se parece.
    let options = choicesFor(primary.item);
    if (options.length === 0) {
      options = others
        .filter((hit) => hit.item.source === "script" || hit.item.source === "ensinado")
        .slice(0, 3)
        .map((hit) => ({ label: hit.item.title, itemId: hit.item.id }));
    }
    const text = confidence === "alta" ? "Encontrei isto sobre o que você perguntou:" : "Acho que é isto, mas confira se responde:";
    deliver(query, luzia(text, { query, confidence, hits: [toHitView(primary), ...others.slice(0, 2).map(toHitView)], options }));
  }

  /** Responde direto uma pergunta escolhida na lista (botões do script ou seletor). */
  function askChoice(itemId: string) {
    const item = byId.get(itemId);
    if (!item || thinking) return;
    const hit: HitView = {
      itemId: item.id,
      title: item.title,
      group: item.group,
      source: item.source,
      sectionId: item.sectionId,
      excerpt: item.text,
    };
    deliver(item.title, luzia("Aqui está:", { query: item.title, confidence: "alta", hits: [hit], options: choicesFor(item) }));
  }

  /** Texto completo de um trecho (as mensagens guardam só o resumo). */
  function fullText(itemId: string, fallback: string) {
    return byId.get(itemId)?.text ?? fallback;
  }

  function rate(messageId: string, rating: "up" | "down") {
    const message = messages.find((m) => m.id === messageId);
    const top = message?.hits?.[0];
    if (!message || !message.query || !top) return;
    const already = message.rating === rating;

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, rating: already ? undefined : rating } : m))
    );
    if (already) return;

    const query = message.query;
    setStore((prev) => {
      const current = normalizeStore(prev);
      const good = { ...current.feedback.good };
      const bad = { ...current.feedback.bad };
      const drop = (map: Record<string, string[]>) => {
        if (!map[top.itemId]) return;
        const next = map[top.itemId].filter((q) => normalize(q) !== normalize(query));
        if (next.length) map[top.itemId] = next;
        else delete map[top.itemId];
      };
      drop(good);
      drop(bad);
      const target = rating === "up" ? good : bad;
      target[top.itemId] = unique([...(target[top.itemId] ?? []), query], MAX_FEEDBACK_PER_ITEM);
      return { ...current, feedback: { good, bad } };
    });
  }

  function teach(input: TaughtInput, fromMessageId?: string) {
    const now = new Date().toISOString();
    const entry: Taught = {
      id: uid(),
      title: input.title.trim(),
      text: input.text.trim(),
      aliases: (input.aliases ?? []).map((a) => a.trim()).filter(Boolean),
      createdAt: now,
      updatedAt: now,
    };
    if (!entry.title || !entry.text) return;
    setStore((prev) => {
      const current = normalizeStore(prev);
      return { ...current, taught: [entry, ...current.taught] };
    });
    if (fromMessageId) {
      setMessages((prev) => prev.map((m) => (m.id === fromMessageId ? { ...m, taughtId: entry.id } : m)));
      push(luzia("Aprendi! Guardei isso e já posso responder perguntas parecidas. Pode testar perguntando de novo."));
    }
  }

  function updateTaught(id: string, input: TaughtInput) {
    setStore((prev) => {
      const current = normalizeStore(prev);
      return {
        ...current,
        taught: current.taught.map((t) =>
          t.id === id
            ? {
                ...t,
                title: input.title.trim() || t.title,
                text: input.text.trim() || t.text,
                aliases: (input.aliases ?? []).map((a) => a.trim()).filter(Boolean),
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      };
    });
  }

  function deleteTaught(id: string) {
    setStore((prev) => {
      const current = normalizeStore(prev);
      const good = { ...current.feedback.good };
      const bad = { ...current.feedback.bad };
      delete good[`t:${id}`];
      delete bad[`t:${id}`];
      return { taught: current.taught.filter((t) => t.id !== id), feedback: { good, bad } };
    });
  }

  /** Importa um texto longo (colado ou de arquivo), quebrando em pedaços. Retorna quantos foram criados. */
  function importText(title: string, text: string) {
    const chunks = chunkText(title.trim() || "Documento", text);
    if (chunks.length === 0) return 0;
    const now = new Date().toISOString();
    const created: Taught[] = chunks.map((chunk) => ({
      id: uid(),
      title: chunk.title,
      text: chunk.text,
      aliases: [],
      createdAt: now,
      updatedAt: now,
    }));
    setStore((prev) => {
      const current = normalizeStore(prev);
      return { ...current, taught: [...created, ...current.taught] };
    });
    return created.length;
  }

  function exportBackup() {
    return JSON.stringify({ app: "puma-luzia", version: 1, exportedAt: new Date().toISOString(), ...store }, null, 2);
  }

  /** Junta um backup ao que já existe (não apaga nada). Retorna quantos itens novos entraram. */
  function importBackup(json: string) {
    const parsed = JSON.parse(json) as Partial<Store> & { app?: string };
    if (parsed.app !== "puma-luzia" || !Array.isArray(parsed.taught)) throw new Error("Arquivo de backup inválido");
    const incoming = normalizeStore(parsed);
    const isValid = (t: Taught) => t && t.id && t.title && t.text;
    const knownNow = new Set(store.taught.map((t) => t.id));
    const added = incoming.taught.filter((t) => isValid(t) && !knownNow.has(t.id)).length;
    setStore((prev) => {
      const current = normalizeStore(prev);
      const known = new Set(current.taught.map((t) => t.id));
      const fresh = incoming.taught.filter((t) => isValid(t) && !known.has(t.id));
      const merge = (a: Record<string, string[]>, b: Record<string, string[]>) => {
        const out = { ...a };
        for (const [key, list] of Object.entries(b)) out[key] = unique([...(out[key] ?? []), ...list], MAX_FEEDBACK_PER_ITEM);
        return out;
      };
      return {
        taught: [...fresh, ...current.taught],
        feedback: { good: merge(current.feedback.good, incoming.feedback.good), bad: merge(current.feedback.bad, incoming.feedback.bad) },
      };
    });
    return added;
  }

  function clearChat() {
    setMessages([]);
  }

  const ratedCount = Object.values(store.feedback.good).flat().length + Object.values(store.feedback.bad).flat().length;

  return {
    messages,
    taught: store.taught,
    baseCount: baseKnowledge.length,
    scriptCount: script.entries.length,
    scriptLive: script.live,
    thinking,
    catalog,
    askChoice,
    fullText,
    ratedCount,
    ask,
    rate,
    teach,
    updateTaught,
    deleteTaught,
    importText,
    exportBackup,
    importBackup,
    clearChat,
  };
}

export type LuziaApi = ReturnType<typeof useLuzia>;
