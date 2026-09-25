import { useState } from "react";
import {
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
import { currentUser } from "@/data/mockData";

export type PageId = "metas" | "contratos" | "templates" | "playbook" | "links" | "luzia" | "followups";

// Ordem pedida por ela: por tamanho do nome, do menor pro maior. A aba "Pedro"
// (luzia) foi tirada do menu a pedido dela em 2026-09-25 — a rota e o código
// continuam existindo, só não tem mais como chegar lá pela navegação.
const navItems: { id: PageId; label: string; icon: typeof Target }[] = [
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
      <img
        src="/logo.png?v=3"
        alt="Pantera do PUMA"
        width={44}
        height={44}
        className="h-11 w-11 object-contain"
        style={{ filter: "drop-shadow(0 0 1px var(--pink-400)) drop-shadow(0 0 10px color-mix(in srgb, var(--pink-500) 60%, transparent))" }}
      />
      <div className="min-w-0 leading-none">
        <p
          className="text-[28px] font-black leading-[0.9] tracking-wide"
          style={{ fontFamily: "var(--font-display)", textShadow: "var(--glow-text)" }}
        >
          PUMA
        </p>
        <p className="label-caps mt-1 text-[--pink-300]" style={{ color: "var(--pink-300)" }}>
          Insights &amp; Resultados
        </p>
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
    <div className="sidebar-panel flex h-full flex-col overflow-y-auto p-3 text-sidebar-foreground">
      <div className="flex items-center px-1 pb-6 pt-2">
        <Logo />
        <button
          className="ml-auto rounded-lg p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col gap-1.5">
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
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 px-2 pt-4" style={{ boxShadow: "inset 0 1px 0 var(--border)" }}>
        <div
          className="flex h-[30px] w-[30px] items-center justify-center font-black"
          style={{ background: "var(--accent)", color: "var(--pink-300)", fontFamily: "var(--font-display)", clipPath: "var(--clip-chamfer-sm)" }}
        >
          {currentUser.firstName.slice(0, 1)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-sm font-semibold">{currentUser.firstName}</span>
          <span className="truncate text-[11px] text-muted-foreground">{currentUser.role}</span>
        </div>
      </div>
      <p className="mt-2 px-2 text-[11px] text-muted-foreground">PUMA · v1.0.0</p>
      <button
        onClick={() => {
          const ok = window.confirm(
            "Resetar o site? Isso apaga tudo que foi editado só neste navegador: metas e ajustes manuais, favoritos de Templates, tags/comentários/leads manuais da Assinatura de Contrato, follow-ups manuais e tudo que o Pedro aprendeu. Os dados do Pipedrive não são afetados. Essa ação não pode ser desfeita."
          );
          if (ok) resetSite();
        }}
        className="mt-2 px-2 text-left text-[11px] text-sidebar-foreground/50 underline decoration-dotted underline-offset-2 hover:text-destructive"
      >
        Resetar site
      </button>
    </div>
  );

  return (
    <>
      <button
        className="card-panel fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 p-2.5 pl-3 lg:block">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 p-2.5">{content}</aside>
        </div>
      )}
    </>
  );
}
