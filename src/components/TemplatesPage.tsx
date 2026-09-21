import { useMemo, useState } from "react";
import { Check, Copy, MessageSquareText, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { templateCategories, templates, type TemplateCategory } from "@/data/templates";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

type Filter = "Todas" | "Favoritos" | TemplateCategory;

const filters: Filter[] = ["Todas", ...templateCategories, "Favoritos"];

export function TemplatesPage() {
  const [favorites, setFavorites] = useLocalStorageState<string[]>("gibba:templateFavorites", []);
  const [filter, setFilter] = useState<Filter>("Todas");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleTemplates = useMemo(() => {
    if (filter === "Todas") return templates;
    if (filter === "Favoritos") return templates.filter((t) => favorites.includes(t.id));
    return templates.filter((t) => t.category === filter);
  }, [filter, favorites]);

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
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Mensagens prontas para copiar e fechar negócios mais rápido.
        </p>
      </div>

      <Card
        className="overflow-hidden p-6"
        style={{ backgroundImage: "var(--gradient-surface)" }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
          <MessageSquareText className="h-4 w-4" />
          Arsenal de mensagens
        </div>
        <p className="mt-2 text-sm text-primary-foreground/90">
          Mensagens estratégicas prontas para copiar e fechar negócios.
        </p>
      </Card>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleTemplates.map((template) => {
          const isFavorite = favorites.includes(template.id);
          const isCopied = copiedId === template.id;
          return (
            <Card key={template.id} className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-card-foreground">{template.title}</p>
                  <p className="text-xs text-primary">{template.category}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(template.id)}
                  aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                    isFavorite ? "text-warning" : "text-muted-foreground hover:text-warning"
                  )}
                >
                  <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                </button>
              </div>
              <p className="mt-3 max-h-56 flex-1 overflow-y-auto whitespace-pre-line text-sm text-muted-foreground">
                {template.text}
              </p>
              <button
                onClick={() => copyTemplate(template.id, template.text)}
                className={cn(
                  "mt-4 flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors",
                  isCopied
                    ? "border-success/40 bg-success/15 text-success"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                )}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {isCopied ? "Copiado!" : "Copiar"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
