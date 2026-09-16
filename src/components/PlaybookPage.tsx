import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { playbookSections, type PlaybookBlock } from "@/data/playbook";

function BlockView({ block }: { block: PlaybookBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>;
    case "subheading":
      return <h3 className="text-sm font-bold text-primary">{block.text}</h3>;
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
            <div key={i} className="rounded-xl border border-border bg-card/60 p-3">
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-secondary">
                {block.headers.map((header, i) => (
                  <th key={i} className="border-b border-border px-3 py-2 font-semibold text-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="odd:bg-card even:bg-card/60">
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
  const [activeId, setActiveId] = useState(playbookSections[0].id);
  const active = playbookSections.find((s) => s.id === activeId) ?? playbookSections[0];

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Playbook</h1>
        <p className="text-sm text-muted-foreground">
          Tudo sobre o Programa de Representantes: scripts, produto, canais e capacitação.
        </p>
      </div>

      <Card
        className="overflow-hidden p-6"
        style={{ backgroundImage: "var(--gradient-surface)" }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
          <BookOpen className="h-4 w-4" />
          Base de conhecimento
        </div>
        <p className="mt-2 text-sm text-primary-foreground/90">
          Guia de referência com tudo que o time precisa saber, organizado por assunto.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:h-fit lg:flex-col lg:overflow-visible lg:pb-0">
          {playbookSections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                onClick={() => setActiveId(section.id)}
                className={cn(
                  "shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors lg:shrink",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                )}
              >
                {section.title}
              </button>
            );
          })}
        </nav>

        <Card className="min-w-0 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-foreground">{active.title}</h2>
            <p className="text-sm text-muted-foreground">{active.summary}</p>
          </div>
          <div className="space-y-4">
            {active.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
