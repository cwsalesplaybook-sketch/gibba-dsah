import { useState } from "react";
import {
  BarChart3,
  Bot,
  BookOpen,
  FileSignature,
  FileText,
  Link2,
  Menu,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PageId = "metas" | "contratos" | "templates" | "playbook" | "links" | "dados" | "luzia";

const navItems: { id: PageId; label: string; icon: typeof Target }[] = [
  { id: "metas", label: "Metas", icon: Target },
  { id: "contratos", label: "Assinatura de Contrato", icon: FileSignature },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "playbook", label: "Playbook", icon: BookOpen },
  { id: "links", label: "Links Importantes", icon: Link2 },
  { id: "dados", label: "Dados", icon: BarChart3 },
  { id: "luzia", label: "Luzia", icon: Bot },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary">
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M31 9.5A15 15 0 1 0 31 30.5"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="19.5" y="16" width="11" height="8" rx="4" fill="white" />
        </svg>
      </span>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight">Cardápio Web</p>
        <p className="text-[11px] text-muted-foreground">Portal do Representante</p>
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
        <p className="text-[11px] text-muted-foreground">Cardápio Web · v1.0.0</p>
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
