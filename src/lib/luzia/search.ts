// Motor de busca da Luzia: BM25 sobre texto em português (sem stopwords, com radicais),
// tolerante a erros de digitação e que aprende com o que a Gabi ensina e com o feedback.
import { commonPrefix, editDistance, jaccard, normalize, tokenize } from "./text";

export type KnowledgeSource = "script" | "playbook" | "template" | "ensinado";

export type KnowledgeItem = {
  id: string;
  title: string;
  text: string;
  source: KnowledgeSource;
  /** Local de origem (nome da seção do Playbook, categoria do template...). */
  group?: string;
  /** Perguntas/palavras alternativas, ensinadas pela Gabi ou aprendidas pelo feedback. */
  aliases?: string[];
  /** Para o atalho "Ver no Playbook". */
  sectionId?: string;
  /** Perguntas relacionadas (botões do script). */
  options?: { label: string; itemId: string }[];
  /** Mensagem do script para quando ela não entende a pergunta. */
  fallback?: string;
};

/** Perguntas que já ajudaram (good) ou não ajudaram (bad), por item. */
export type Feedback = {
  good: Record<string, string[]>;
  bad: Record<string, string[]>;
};

export type Hit = {
  item: KnowledgeItem;
  score: number;
  /** 0 a 1: quanto da pergunta (ponderado pela raridade dos termos) o item cobre. */
  coverage: number;
  excerpt: string;
};

type IndexedDoc = {
  item: KnowledgeItem;
  tf: Map<string, number>;
  length: number;
  sequence: string;
  titleNorm: string;
};

export type SearchIndex = {
  docs: IndexedDoc[];
  df: Map<string, number>;
  vocab: string[];
  avgLength: number;
};

const TITLE_WEIGHT = 2;
const ALIAS_WEIGHT = 2.5;
const K1 = 1.2;
const B = 0.6;

export function buildIndex(items: KnowledgeItem[], feedback?: Feedback): SearchIndex {
  const df = new Map<string, number>();
  const docs: IndexedDoc[] = items.map((item) => {
    const tf = new Map<string, number>();
    const add = (tokens: string[], weight: number) => {
      for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + weight);
    };
    const bodyTokens = tokenize(item.text);
    add(tokenize(item.title), TITLE_WEIGHT);
    add(bodyTokens, 1);
    add(tokenize((item.aliases ?? []).join(" ")), ALIAS_WEIGHT);
    // Perguntas que já ajudaram viram "apelidos" do item: a Luzia aprende com o uso.
    add(tokenize((feedback?.good[item.id] ?? []).join(" ")), ALIAS_WEIGHT);
    for (const term of tf.keys()) df.set(term, (df.get(term) ?? 0) + 1);
    return {
      item,
      tf,
      length: bodyTokens.length + 1,
      sequence: ` ${bodyTokens.join(" ")} `,
      titleNorm: normalize(item.title),
    };
  });
  const total = docs.reduce((sum, doc) => sum + doc.length, 0);
  return { docs, df, vocab: [...df.keys()], avgLength: docs.length ? total / docs.length : 1 };
}

type Expansion = { term: string; weight: number };

// Um termo da pergunta casa com o termo exato (peso 1), com termos de mesmo começo (0,7)
// ou com termos quase iguais, por erro de digitação (0,55).
function expand(term: string, index: SearchIndex): Expansion[] {
  const out: Expansion[] = [];
  for (const candidate of index.vocab) {
    if (candidate === term) {
      out.push({ term: candidate, weight: 1 });
      continue;
    }
    if (term.length >= 4 && candidate.length >= 4) {
      const prefix = commonPrefix(term, candidate);
      if (prefix >= 4 && prefix >= Math.min(term.length, candidate.length) - 1) {
        out.push({ term: candidate, weight: prefix >= 6 ? 0.85 : 0.7 });
        continue;
      }
    }
    if (term.length >= 5 && Math.abs(term.length - candidate.length) <= 1 && editDistance(term, candidate, 1) <= 1) {
      out.push({ term: candidate, weight: 0.55 });
    }
  }
  return out;
}

function idf(index: SearchIndex, term: string) {
  const n = index.docs.length;
  const d = index.df.get(term) ?? 0;
  return Math.log(1 + (n - d + 0.5) / (d + 0.5));
}

function bm25(tf: number, length: number, avg: number) {
  return (tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * length) / avg));
}

const SENTENCE_SPLIT = /\n+|(?<=[.!?])\s+/;

export function pickExcerpt(text: string, queryTerms: string[], maxChars = 520) {
  if (text.length <= maxChars) return text;
  const segments = text.split(SENTENCE_SPLIT).map((s) => s.trim()).filter(Boolean);
  const scored = segments.map((segment, position) => {
    const tokens = new Set(tokenize(segment));
    let score = 0;
    for (const term of queryTerms) {
      if (tokens.has(term)) score += 1;
      else for (const token of tokens) if (commonPrefix(token, term) >= 4) { score += 0.5; break; }
    }
    return { segment, position, score };
  });
  const chosen = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.position - b.position);
  const picked: typeof scored = [];
  let size = 0;
  for (const s of chosen) {
    if (picked.length && size + s.segment.length > maxChars) continue;
    picked.push(s);
    size += s.segment.length;
    if (size >= maxChars) break;
  }
  if (picked.length === 0) return text.slice(0, maxChars).trimEnd() + "…";
  picked.sort((a, b) => a.position - b.position);
  const hasGapBefore = picked[0].position > 0;
  return (hasGapBefore ? "… " : "") + picked.map((s) => s.segment).join("\n") + (picked[picked.length - 1].position < segments.length - 1 ? " …" : "");
}

export function search(
  index: SearchIndex,
  query: string,
  feedback?: Feedback,
  limit = 4
): Hit[] {
  const queryTerms = [...new Set(tokenize(query))];
  if (queryTerms.length === 0 || index.docs.length === 0) return [];

  const expansions = queryTerms.map((term) => {
    const list = expand(term, index);
    const best = list.reduce((max, e) => Math.max(max, idf(index, e.term) * e.weight), 0);
    // Termo que não existe em lugar nenhum pesa como um termo raro: baixa a cobertura.
    const termIdf = list.length ? Math.max(...list.map((e) => idf(index, e.term))) : Math.log(1 + index.docs.length);
    return { term, list, best, termIdf };
  });
  const totalIdf = expansions.reduce((sum, e) => sum + e.termIdf, 0) || 1;
  const queryNorm = normalize(query).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

  const wantsTemplate = /(mensage(m|ns)|templates?)/.test(queryNorm);

  const hits: Hit[] = [];
  for (const doc of index.docs) {
    let score = 0;
    let covered = 0;
    for (const e of expansions) {
      let bestForTerm = 0;
      let bestWeight = 0;
      for (const { term, weight } of e.list) {
        const tf = doc.tf.get(term);
        if (!tf) continue;
        const value = idf(index, term) * weight * bm25(tf, doc.length, index.avgLength);
        if (value > bestForTerm) {
          bestForTerm = value;
          bestWeight = weight;
        }
      }
      score += bestForTerm;
      if (bestForTerm > 0) covered += e.termIdf * bestWeight;
    }
    if (score === 0) continue;

    // Bônus para termos consecutivos iguais aos da pergunta.
    for (let i = 0; i < queryTerms.length - 1; i++) {
      if (doc.sequence.includes(` ${queryTerms[i]} ${queryTerms[i + 1]} `)) score += 0.6 * (expansions[i].termIdf + expansions[i + 1].termIdf) / 2;
    }
    if (queryNorm.length > 3 && doc.titleNorm.includes(queryNorm)) score *= 1.5;
    if (doc.item.source === "ensinado") score *= 1.2; // o que a Gabi ensinou vale mais
    if (doc.item.source === "script") score *= 1.3; // a Luzia segue o script antes de tudo
    if (wantsTemplate && doc.item.source === "template") score *= 2.5; // "mensagem de..." pede um template

    // Feedback negativo: a mesma pergunta (ou muito parecida) já foi marcada como "não era isso".
    const badQueries = feedback?.bad[doc.item.id];
    if (badQueries?.some((q) => jaccard(tokenize(q), queryTerms) >= 0.6)) score *= 0.25;

    // Quem cobre mais termos da pergunta ganha de quem só repete um termo forte.
    const coverage = Math.min(1, covered / totalIdf);
    hits.push({ item: doc.item, score: score * (0.4 + 0.6 * coverage), coverage, excerpt: "" });
  }

  hits.sort((a, b) => b.score - a.score);
  const top = hits.slice(0, limit);
  // Respostas do script e do que a Gabi ensinou aparecem inteiras; o resto vem em trecho.
  for (const hit of top) {
    hit.excerpt = hit.item.source === "script" ? hit.item.text : pickExcerpt(hit.item.text, queryTerms);
  }
  return top;
}

/** Nível de confiança da melhor resposta: alta, média ou baixa. */
export function confidenceOf(hits: Hit[]): "alta" | "media" | "baixa" {
  const coverage = hits[0]?.coverage ?? 0;
  if (coverage >= 0.75) return "alta";
  if (coverage >= 0.55) return "media";
  return "baixa";
}
