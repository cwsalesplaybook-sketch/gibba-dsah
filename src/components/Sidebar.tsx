import { useState } from "react";
import {
  Bot,
  BookOpen,
  FileSignature,
  FileText,
  Link2,
  Menu,
  Repeat,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resetSite } from "@/lib/resetSite";

export type PageId = "metas" | "contratos" | "templates" | "playbook" | "links" | "luzia" | "followups";

// Ordem pedida por ela: por tamanho do nome, do menor pro maior.
const navItems: { id: PageId; label: string; icon: typeof Target }[] = [
  { id: "luzia", label: "Pedro", icon: Bot },
  { id: "metas", label: "Metas", icon: Target },
  { id: "playbook", label: "Playbook", icon: BookOpen },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "followups", label: "Follow-up", icon: Repeat },
  { id: "links", label: "Links Importantes", icon: Link2 },
  { id: "contratos", label: "Assinatura de Contrato", icon: FileSignature },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src="/logo.png?v=3" alt="Pantera do PUMA" width={40} height={40} className="h-10 w-10 object-contain" />
      <div className="leading-tight">
        <p className="text-[17px] font-bold tracking-wide">PUMA</p>
        <p className="text-[11px] text-muted-foreground">Insights &amp; Resultados</p>
      </div>
    </div>
  );
}

export function Sidebar({
  active,
  onChange,
}: {
  active: PageId;
  onChange: (page: PageId) => void;
}) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col overflow-y-auto bg-sidebar text-sidebar-foreground">
      <div className="flex items-center border-b border-sidebar-border px-5 py-5">
        <Logo />
        <button
          className="ml-auto rounded-lg p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="space-y-1 px-3 pt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
              aria-current={isActive ? "page" : undefined}
              className={cn("nav-item", isActive && "nav-item-active")}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border px-5 py-4">
        <p className="text-[11px] text-muted-foreground">PUMA · v1.0.0</p>
        <button
          onClick={() => {
            const ok = window.confirm(
              "Resetar o site? Isso apaga tudo que foi editado só neste navegador: metas e ajustes manuais, favoritos de Templates, tags/comentários/leads manuais da Assinatura de Contrato e tudo que o Pedro aprendeu. Os dados do Pipedrive não são afetados. Essa ação não pode ser desfeita."
            );
            if (ok) resetSite();
          }}
          className="mt-1.5 text-[11px] text-sidebar-foreground/50 underline decoration-dotted underline-offset-2 hover:text-destructive"
        >
          Resetar site
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-card lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60">{content}</aside>
        </div>
      )}
    </>
  );
}
