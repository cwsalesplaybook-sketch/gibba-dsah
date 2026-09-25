import { useState } from "react";
import { Check, ClipboardList, Copy, ExternalLink, FileSpreadsheet, LogIn, Workflow } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { importantLinks, type ImportantLink } from "@/data/links";

const icons = {
  portal: LogIn,
  pipedrive: Workflow,
  planilha: FileSpreadsheet,
  form: ClipboardList,
  playbook: FileSpreadsheet,
};

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

function LinkRow({ link }: { link: ImportantLink }) {
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
    <div
      className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 px-4 py-3.5 sm:gap-4 sm:px-5"
      style={{ boxShadow: "inset 0 -1px 0 var(--border)" }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)", clipPath: "var(--clip-chamfer-sm)" }}
      >
        <Icon className="h-[19px] w-[19px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-foreground">{link.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {link.description} · {hostOf(link.url)}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={copyLink}
          aria-label="Copiar link"
          title="Copiar link"
          className="flex h-[34px] w-[34px] items-center justify-center text-muted-foreground transition-colors hover:text-primary"
          style={{ background: copied ? "var(--accent)" : "transparent" }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="label-caps inline-flex items-center gap-1.5 px-3.5 py-2 text-[--pink-300]"
          style={{ color: "var(--pink-300)", boxShadow: "inset 0 0 0 1px var(--pink-600)", clipPath: "var(--clip-chamfer-sm)" }}
        >
          <ExternalLink className="h-3.5 w-3.5" /> Abrir
        </a>
      </div>
    </div>
  );
}

export function LinksPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Links</h1>
        <p className="text-sm text-muted-foreground">Portal, Pipedrive, planilhas e formulários num lugar só.</p>
      </div>

      <Card className="max-w-[980px] overflow-hidden">
        {importantLinks.map((link) => (
          <LinkRow key={link.id} link={link} />
        ))}
      </Card>
    </div>
  );
}
