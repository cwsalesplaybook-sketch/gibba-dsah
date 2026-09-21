import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PageId } from "@/components/Sidebar";
import { useLuzia } from "@/lib/luzia/useLuzia";
import { LuziaChat } from "./LuziaChat";
import { LuziaKnowledge } from "./LuziaKnowledge";

type Tab = "conversa" | "conhecimento";

export function LuziaPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const luzia = useLuzia();
  const [tab, setTab] = useState<Tab>("conversa");

  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Luzia</h1>
        <p className="text-sm text-muted-foreground">
          Assistente do PUMA. Segue o script do time e aprende com o Playbook, os Templates e tudo que você ensinar, sem depender de uma IA externa.
        </p>
      </div>

      <div className="flex gap-2" role="tablist">
        {(
          [
            ["conversa", "Conversa"],
            ["conhecimento", `Conhecimento${luzia.taught.length ? ` (${luzia.taught.length})` : ""}`],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "conversa" ? <LuziaChat luzia={luzia} onNavigate={onNavigate} /> : <LuziaKnowledge luzia={luzia} />}
    </div>
  );
}
