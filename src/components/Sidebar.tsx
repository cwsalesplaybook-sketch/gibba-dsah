import { useState } from "react";
import {
  BarChart3,
  Bot,
  BookOpen,
  Calculator,
  FileText,
  Heart,
  Home,
  Link2,
  Megaphone,
  Menu,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PageId =
  | "inicio"
  | "metas"
  | "templates"
  | "playbook"
  | "links"
  | "dados"
  | "forecast"
  | "avisos"
  | "luzia";

const navItems: { id: PageId; label: string; icon: typeof Target }[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "metas", label: "Metas", icon: Target },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "playbook", label: "Playbook", icon: BookOpen },
  { id: "links", label: "Links Importantes", icon: Link2 },
  { id: "dados", label: "Dados", icon: BarChart3 },
  { id: "forecast", label: "Forecast", icon: Calculator },
  { id: "avisos", label: "Mural de Avisos", icon: Megaphone },
  { id: "luzia", label: "Luzia", icon: Bot },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M31 9.5A15 15 0 1 0 31 30.5"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect x="19" y="15" width="12" height="10" rx="5" fill="var(--primary)" />
        <circle cx="23.2" cy="19.6" r="1.1" fill="var(--sidebar)" />
        <circle cx="27.4" cy="19.6" r="1.1" fill="var(--sidebar)" />
      </svg>
      <div className="font-logo leading-[0.95]">
        <p className="text-[17.5px] font-semibold tracking-tight text-white">cardápio</p>
        <p className="text-[17.5px] font-normal tracking-tight text-white/95">web</p>
      </div>
    </div>
  );
}

// Pássaro de boné (mascote) desenhado em SVG, no estilo "linha + preenchimento
// translúcido" da referência.
function Bird() {
  const line = "oklch(50% 0.13 330)";
  const fill = "oklch(38% 0.12 328)";
  return (
    <svg width="96" height="104" viewBox="0 0 96 104" fill="none" aria-hidden="true" className="shrink-0">
      {/* asa esquerda, aberta */}
      <path
        d="M30 50C18 42 6 44 3 52c-2 6 2 10 6 12-3 3-3 8 2 11 4 2 9 1 12-1 6 2 12-1 15-5"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 64c5 1 9-1 12-4M14 74c4 0 8-2 10-5" stroke={line} strokeWidth="1.3" strokeLinecap="round" />
      {/* corpo */}
      <path
        d="M34 42c-8 6-11 19-7 30 3 8 11 13 21 12 11-1 18-9 18-20 0-9-4-18-11-23-6-4-15-3-21 1Z"
        fill={fill}
        stroke={line}
        strokeWidth="1.4"
      />
      {/* asa direita, acenando */}
      <path
        d="M66 56c7-1 11-4 16-7 3-2 6 0 4 3-2 3-7 8-12 11-4 2-8 2-11-1"
        fill={fill}
        stroke={line}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* boné */}
      <path
        d="M29 36c-1-12 8-21 21-21 10 0 17 6 18 14"
        fill="oklch(24% 0.06 335)"
        stroke={line}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M27 37c6 3 15 4 26 3 9-1 16-4 21-8-2-4-8-6-13-6"
        fill="oklch(28% 0.07 332)"
        stroke={line}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M47 25c1-3 5-3 6 0s-1 5-3 4M53 25c1-3 5-3 6 0" stroke="oklch(62% 0.14 335)" strokeWidth="1.2" strokeLinecap="round" />
      {/* olhos e bico */}
      <circle cx="41" cy="46" r="2.6" fill="oklch(14% 0.04 340)" />
      <circle cx="58" cy="46" r="2.6" fill="oklch(14% 0.04 340)" />
      <path d="M46 50c2-2 8-2 9 1 0 4-4 6-7 5-4-1-4-4-2-6Z" fill="var(--primary)" opacity="0.8" />
      {/* lenço */}
      <path d="M38 62c6 8 18 8 24 0-3 12-21 12-24 0Z" fill="oklch(20% 0.05 338)" stroke={line} strokeWidth="1" />
      {/* pés */}
      <path d="M42 84l-5 9h10l-1-9" stroke={line} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M58 84l-1 9h10l-3-9" stroke={line} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function Mascot() {
  return (
    <div className="flex items-center gap-1 px-4">
      <Bird />
      <div className="font-hand text-primary-glow/55 [color:oklch(79%_0.064_324)]">
        <p className="w-[88px] text-[16px] leading-[17px]">Juntos levamos mais restaurantes para o digital!</p>
        <div className="mt-2 flex items-end gap-0.5 opacity-80">
          <svg width="46" height="18" viewBox="0 0 46 18" fill="none" aria-hidden="true">
            <path d="M2 2c4 10 14 14 24 12 6-1 10-2 14-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <Heart className="mb-0.5 h-4 w-4" />
        </div>
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
      <div className="flex items-center px-5 pb-5 pt-6">
        <Logo />
        <button
          className="ml-auto rounded-lg p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="space-y-1 px-4 pt-3">
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
              className={cn("nav3d", isActive && "nav3d-active")}
            >
              <span className="nav3d-icon">
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pb-[min(105px,11vh)] pt-4">
        <Mascot />
      </div>

      <div className="border-t border-sidebar-border px-5 pb-4 pt-[22px]">
        <p className="text-[11.5px] font-medium text-sidebar-foreground">Cardápio Web</p>
        <p className="mt-1 text-[10px] text-sidebar-foreground/55">Portal do Representante</p>
        <p className="mt-1.5 text-[10px] text-sidebar-foreground/40">v1.0.0</p>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card lg:hidden"
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
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60">{content}</aside>
        </div>
      )}
    </>
  );
}
