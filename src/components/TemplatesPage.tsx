import { useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Copy,
  HandHelping,
  IdCard,
  MessageSquareText,
  Search,
  SignpostBig,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { templateCategories, templates, type Template, type TemplateCategory } from "@/data/templates";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

type Filter = "Todas" | "Favoritos" | TemplateCategory;

const filters: Filter[] = ["Todas", ...templateCategories, "Favoritos"];

const categoryIcon: Record<TemplateCategory, typeof MessageSquareText> = {
  Direcionamento: SignpostBig,
  Cadastro: IdCard,
  "Boas-vindas": HandHelping,
  Agendamento: ClipboardList,
};

function RowAvatar({ template }: { template: Template }) {
  const Icon = categoryIcon[template.category] ?? MessageSquareText;
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ background: "var(--pink-800)", color: "var(--ink-100)" }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function TemplatesPage() {
  const [favorites, setFavorites] = useLocalStorageState<string[]>("gibba:templateFavorites", []);
  const [filter, setFilter] = useState<Filter>("Todas");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleTemplates = useMemo(() => {
    const byFilter = templates.filter((t) => {
      if (filter === "Favoritos") return favorites.includes(t.id);
      if (filter === "Todas") return true;
      return t.category === filter;
    });
    const q = query.trim().toLowerCase();
    if (!q) return byFilter;
    return byFilter.filter((t) => `${t.title} ${t.text} ${t.category}`.toLowerCase().includes(q));
  }, [filter, favorites, query]);

  const selected = visibleTemplates.find((t) => t.id === selectedId) ?? visibleTemplates[0] ?? null;

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  async function copyTemplate(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1800);
    } catch {
      // clipboard indisponível, nada a fazer
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Templates</h1>
        <p className="text-sm text-muted-foreground">Clique na mensagem para copiar e cole no WhatsApp.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const isActive = filter === item;
          return (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              {item === "Favoritos" && <Star className="h-3.5 w-3.5" />}
              {item}
            </button>
          );
        })}
      </div>

      <Card
        className="grid overflow-hidden"
        style={{ gridTemplateColumns: "clamp(220px,32%,320px) minmax(0,1fr)", height: "calc(100vh - 260px)", minHeight: 480 }}
      >
        <aside className="flex min-w-0 flex-col" style={{ boxShadow: "inset -1px 0 0 var(--border)" }}>
          <div className="flex items-center gap-2 p-2.5" style={{ boxShadow: "inset 0 -1px 0 var(--border)" }}>
            <div className="flex flex-1 items-center gap-2 px-2.5 py-1.5" style={{ background: "var(--background)", boxShadow: "var(--edge)" }}>
              <Search className="h-4 w-4" style={{ color: "var(--ink-500)" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar mensagem"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {visibleTemplates.map((template) => {
              const isActive = selected?.id === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedId(template.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  style={{ background: isActive ? "var(--muted)" : "transparent", boxShadow: isActive ? "inset 3px 0 0 var(--primary)" : "none" }}
                >
                  <RowAvatar template={template} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{template.title}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="label-caps text-[9px]" style={{ color: "var(--pink-300)" }}>
                        {template.category}
                      </span>
                      {favorites.includes(template.id) && <Star className="h-2.5 w-2.5 fill-current" style={{ color: "var(--primary)" }} />}
                    </span>
                  </span>
                </button>
              );
            })}
            {visibleTemplates.length === 0 && (
              <p className="p-4 text-center text-xs text-muted-foreground">Nenhuma mensagem encontrada.</p>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          {selected ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: "var(--card)", boxShadow: "inset 0 -1px 0 var(--border)" }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--pink-700)" }}>
                  {(() => {
                    const Icon = categoryIcon[selected.category] ?? MessageSquareText;
                    return <Icon className="h-[18px] w-[18px]" />;
                  })()}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[15px] font-semibold">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">{selected.category} · clique na mensagem para copiar</p>
                </div>
              </div>
              <div
                className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4 sm:p-6"
                style={{
                  background:
                    "radial-gradient(color-mix(in srgb, var(--pink-500) 10%, transparent) 1px, transparent 1.4px) 0 0/22px 22px, var(--background)",
                }}
              >
                <div className="ml-auto flex max-w-[85%] flex-col items-end gap-1 sm:max-w-[560px]">
                  <span className="label-caps pr-1" style={{ color: "var(--ink-400)" }}>
                    {selected.title}
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => copyTemplate(selected.id, selected.text)}
                    onKeyDown={(e) => e.key === "Enter" && copyTemplate(selected.id, selected.text)}
                    title="Clique para copiar"
                    className="cursor-pointer px-3.5 py-2.5 text-[color:var(--ink-100)] transition-[filter]"
                    style={{
                      background:
                        copiedId === selected.id
                          ? "linear-gradient(135deg, var(--pink-600), var(--pink-700))"
                          : "linear-gradient(135deg, var(--pink-700), var(--pink-800))",
                      borderRadius: "10px 2px 10px 10px",
                      boxShadow: copiedId === selected.id ? "var(--glow-md)" : "0 2px 6px rgba(0,0,0,0.35)",
                    }}
                  >
                    <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed">{selected.text}</p>
                    <div className="mt-1.5 flex items-center justify-end gap-2.5" style={{ color: "var(--pink-200)" }}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(selected.id);
                        }}
                        title="Favoritar"
                        style={{ color: favorites.includes(selected.id) ? "var(--pink-200)" : "color-mix(in srgb, var(--pink-200) 55%, transparent)" }}
                      >
                        <Star className={cn("h-3.5 w-3.5", favorites.includes(selected.id) && "fill-current")} />
                      </span>
                      <span className="label-caps flex items-center gap-1" style={{ fontSize: 10, color: copiedId === selected.id ? "var(--green-500)" : "var(--pink-200)" }}>
                        {copiedId === selected.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === selected.id ? "Copiada" : "Copiar"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Nenhuma mensagem encontrada.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
