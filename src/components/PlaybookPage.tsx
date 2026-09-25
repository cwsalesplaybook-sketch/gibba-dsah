import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  BookOpenText,
  Compass,
  Crown,
  Handshake,
  ListChecks,
  Mic,
  Network,
  Phone,
  Rocket,
  Scale,
  Search,
  ShieldAlert,
  Store,
  UserCog,
  Users,
  X,
  Zap,
} from "lucide-react";
import { playbookSections, type PlaybookBlock } from "@/data/playbook";

const ICONS = [Phone, Store, Crown, Rocket, Handshake, Users, Mic, Network, Compass, UserCog, BarChart3, ListChecks, BookOpenText, ShieldAlert, Zap, Scale];

function BlockView({ block }: { block: PlaybookBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>;
    case "subheading":
      return (
        <h3 className="label-caps text-[13px]" style={{ color: "var(--primary)" }}>
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <div className="space-y-3">
          {block.items.map((step, i) => (
            <div key={i} className="p-3" style={{ background: "var(--muted)", boxShadow: "var(--edge)" }}>
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto" style={{ boxShadow: "var(--edge)" }}>
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr style={{ background: "var(--muted)" }}>
                {block.headers.map((header, i) => (
                  <th key={i} className="border-b border-border px-3 py-2 font-semibold text-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-border px-3 py-2 align-top text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function PlaybookPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return playbookSections.filter((section) => !q || `${section.title} ${section.summary}`.toLowerCase().includes(q));
  }, [query]);

  const open = openId ? playbookSections.find((s) => s.id === openId) ?? null : null;

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Playbook</h1>
          <p className="text-sm text-muted-foreground">Scripts, produto, canais e capacitação do Programa de Representantes.</p>
        </div>
        <div className="flex flex-1 items-center gap-2 px-3 py-2 sm:max-w-[280px]" style={{ background: "var(--background)", boxShadow: "var(--edge)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--ink-500)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar assunto"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {topics.map((section, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <button
              key={section.id}
              onClick={() => setOpenId(section.id)}
              className="card-panel relative flex min-h-[132px] flex-col justify-between gap-3.5 p-3.5 text-left transition-transform hover:-translate-y-1"
              style={{ background: "linear-gradient(160deg, var(--secondary), var(--card) 60%)" }}
            >
              <span className="absolute left-0 top-0 h-0.5 w-7" style={{ background: "var(--primary)" }} />
              <div className="flex items-start justify-between gap-2">
                <span className="font-black leading-none" style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--pink-700)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="h-5 w-5" style={{ color: "var(--pink-300)" }} />
              </div>
              <span className="text-[15px] font-semibold leading-tight">{section.title}</span>
            </button>
          );
        })}
        {topics.length === 0 && <p className="col-span-full py-6 text-sm text-muted-foreground">Nenhum assunto encontrado.</p>}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-6"
          style={{ background: "rgba(11,7,9,0.78)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpenId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[860px] overflow-y-auto p-6 sm:p-7"
            style={{ maxHeight: "calc(100vh - 48px)", background: "var(--card)", boxShadow: "var(--edge-accent), var(--shadow-card)", clipPath: "var(--clip-chamfer)" }}
          >
            <span className="absolute left-0 top-0 h-[3px] w-14" style={{ background: "var(--primary)", boxShadow: "var(--glow-sm)" }} />
            <button
              onClick={() => setOpenId(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
              style={{ background: "var(--muted)" }}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4 mr-10 flex items-center gap-2 text-xs" style={{ color: "var(--pink-300)" }}>
              <BookOpen className="h-3.5 w-3.5" />
              <span className="label-caps">{open.summary}</span>
            </div>
            <h2 className="mb-5 mr-10 text-[28px] leading-none sm:text-[32px]">{open.title}</h2>
            <div className="space-y-4">
              {open.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
