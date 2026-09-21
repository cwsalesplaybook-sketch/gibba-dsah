import { useState } from "react";
import {
  BarChart3,
  Bot,
  BookOpen,
  CalendarDays,
  FileText,
  Heart,
  Link2,
  Menu,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PageId = "metas" | "templates" | "playbook" | "links" | "dados" | "forecast" | "luzia";

const navItems: { id: PageId; label: string; icon: typeof Target }[] = [
  { id: "metas", label: "Metas", icon: Target },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "playbook", label: "Playbook", icon: BookOpen },
  { id: "links", label: "Links Importantes", icon: Link2 },
  { id: "dados", label: "Dados", icon: BarChart3 },
  { id: "forecast", label: "Forecast", icon: CalendarDays },
  { id: "luzia", label: "Luzia", icon: Bot },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="tile3d tile-pink h-11 w-11 rounded-full">
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M31 9.5A15 15 0 1 0 31 30.5"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <rect x="19" y="15" width="12" height="10" rx="5" fill="white" />
          <circle cx="23.2" cy="19.6" r="1.1" fill="oklch(64% 0.22 352)" />
          <circle cx="27.4" cy="19.6" r="1.1" fill="oklch(64% 0.22 352)" />
        </svg>
      </span>
      <div className="font-logo text-[20px] font-semibold leading-[1.05] tracking-tight text-foreground">
        <p>Cardápio</p>
        <p>Web</p>
      </div>
    </div>
  );
}

// Passarinho mascote (SVG), no estilo rosa/roxo da referência.
function Bird() {
  return (
    <svg width="92" height="104" viewBox="0 0 92 104" fill="none" aria-hidden="true" className="shrink-0">
      <defs>
        <radialGradient id="birdBody" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="oklch(78% 0.16 345)" />
          <stop offset="100%" stopColor="oklch(56% 0.22 325)" />
        </radialGradient>
        <linearGradient id="birdCap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(56% 0.2 300)" />
          <stop offset="100%" stopColor="oklch(40% 0.19 296)" />
        </linearGradient>
      </defs>
      <ellipse cx="46" cy="98" rx="26" ry="4" fill="oklch(60% 0.15 350 / 0.25)" />
      {/* asas */}
      <ellipse cx="20" cy="66" rx="9" ry="14" transform="rotate(18 20 66)" fill="oklch(58% 0.21 328)" />
      <ellipse cx="72" cy="66" rx="9" ry="14" transform="rotate(-18 72 66)" fill="oklch(58% 0.21 328)" />
      {/* corpo e barriguinha */}
      <ellipse cx="46" cy="62" rx="27" ry="30" fill="url(#birdBody)" />
      <ellipse cx="46" cy="72" rx="16" ry="17" fill="oklch(90% 0.06 345)" />
      {/* boné */}
      <path d="M22 44C22 26 33 17 46 17s24 9 24 27Z" fill="url(#birdCap)" />
      <path d="M20 45c8 4 24 5 40 1 6-1 10-4 12-8-6-1-14 1-24 3-10 2-20 2-28 4Z" fill="oklch(48% 0.2 298)" />
      <text x="46" y="36" textAnchor="middle" fontSize="10" fontWeight="800" fill="white" fontFamily="Poppins, sans-serif">
        CW
      </text>
      {/* olhos e bico */}
      <circle cx="37" cy="54" r="6" fill="white" />
      <circle cx="55" cy="54" r="6" fill="white" />
      <circle cx="38" cy="55" r="3" fill="oklch(20% 0.06 290)" />
      <circle cx="54" cy="55" r="3" fill="oklch(20% 0.06 290)" />
      <circle cx="39" cy="53.6" r="1" fill="white" />
      <circle cx="55" cy="53.6" r="1" fill="white" />
      <path d="M41 61c3-3 7-3 10 0-1 5-9 5-10 0Z" fill="oklch(82% 0.15 80)" />
      {/* pés */}
      <path d="M38 91v6M54 91v6" stroke="oklch(75% 0.15 70)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Mascot() {
  return (
    <div className="flex items-center gap-1 px-4">
      <div className="relative">
        <Bird />
        <Heart className="absolute -top-1 right-0 h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="w-[76px] text-[11.5px] leading-[15px] text-foreground/80">
          Juntos levamos mais restaurantes para o digital!
        </p>
        <Heart className="ml-auto mr-1 mt-2 h-4 w-4 text-primary/80" />
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
    <div className="flex h-full flex-col overflow-y-auto bg-gradient-to-b from-sidebar to-[oklch(94.6%_0.03_342)] text-sidebar-foreground">
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

      <div className="mt-auto pb-[min(70px,8vh)] pt-4">
        <Mascot />
      </div>

      <div className="border-t border-sidebar-border px-5 pb-4 pt-[22px]">
        <p className="text-[11.5px] font-semibold text-sidebar-foreground">Cardápio Web</p>
        <p className="mt-1 text-[10.5px] text-muted-foreground">Portal do Representante</p>
        <p className="mt-1.5 text-[10.5px] text-muted-foreground/80">v1.0.0</p>
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60">{content}</aside>
        </div>
      )}
    </>
  );
}
