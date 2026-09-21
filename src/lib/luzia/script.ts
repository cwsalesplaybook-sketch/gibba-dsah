// O script da Luzia vem da planilha SCRIPT. A cópia embutida serve de reserva se a planilha não responder.
import { useEffect, useState } from "react";
import { luziaScript, type ScriptEntry } from "@/data/luziaScript";
import type { KnowledgeItem } from "./search";

export const DEFAULT_FALLBACK = "Não consegui entender sua pergunta 😕 Você pode escolher uma das opções abaixo ou digitar de outra forma.";

export const scriptItemId = (id: string) => `sc:${id}`;

export function scriptToItems(entries: ScriptEntry[]): KnowledgeItem[] {
  return entries.map((entry) => ({
    id: scriptItemId(entry.id),
    title: entry.question,
    text: entry.answer,
    source: "script",
    group: entry.category,
    // Os gatilhos da planilha viram palavras alternativas: pesam mais na busca.
    aliases: entry.triggers,
    options: entry.options.map((option) => ({ label: option.label, itemId: scriptItemId(option.targetId) })),
    fallback: entry.fallback,
  }));
}

type State = { entries: ScriptEntry[]; live: boolean };

export function useScript(): State {
  const [state, setState] = useState<State>({ entries: luziaScript, live: false });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/luzia-script")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { entries?: ScriptEntry[] }) => {
        if (!cancelled && Array.isArray(data.entries) && data.entries.length > 0) {
          setState({ entries: data.entries, live: true });
        }
      })
      .catch(() => {
        // sem a planilha, segue com a cópia embutida
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
