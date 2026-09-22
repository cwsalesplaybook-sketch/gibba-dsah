import { useState } from "react";
import { Check, ClipboardList, Copy, ExternalLink, FileSpreadsheet, Link2, LogIn, Workflow } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { importantLinks, type ImportantLink } from "@/data/links";

const icons = {
  portal: LogIn,
  pipedrive: Workflow,
  planilha: FileSpreadsheet,
  form: ClipboardList,
  playbook: FileSpreadsheet,
};

function LinkCard({ link }: { link: ImportantLink }) {
  const Icon = icons[link.icon];
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard indisponível, nada a fazer
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start gap-3.5">
        <span className="tile h-10 w-10 shrink-0 rounded-[10px]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-semibold text-foreground">{link.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
        </div>
      </div>
      <p className="truncate rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground" title={link.url}>
        {link.url}
      </p>
      <div className="mt-auto flex gap-2">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" /> Abrir
        </a>
        <button
          onClick={copyLink}
          aria-label="Copiar link"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </Card>
  );
}

export function LinksPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Links Importantes</h1>
        <p className="text-sm text-muted-foreground">Atalhos pro que você mais usa no dia a dia.</p>
      </div>

      <Card
        className="overflow-hidden p-6"
        style={{ backgroundImage: "var(--gradient-surface)" }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
          <Link2 className="h-4 w-4" />
          Acesso rápido
        </div>
        <p className="mt-2 text-sm text-primary-foreground/90">
          Portal, Pipedrive, planilhas e formulários de cadastro num lugar só.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {importantLinks.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
