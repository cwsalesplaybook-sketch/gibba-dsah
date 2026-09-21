import { useState } from "react";
import { Bell, CalendarDays, ChevronDown } from "lucide-react";
import { currentUser } from "@/data/mockData";
import type { InicioData } from "@/lib/useInicioData";

function Avatar() {
  const [failed, setFailed] = useState(false);
  const initials = currentUser.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-glow text-[11px] font-bold text-primary-foreground">
      {failed ? (
        initials
      ) : (
        // Coloque a foto em public/avatar.jpg pra ela aparecer aqui.
        <img
          src="/avatar.jpg"
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

// Mãozinha acenando, com os tracinhos de movimento à esquerda.
function Wave() {
  return (
    <span className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 36 36" className="h-9 w-9" fill="var(--primary)">
        <g transform="rotate(-14 20 21)">
          <rect x="11.5" y="10" width="4.4" height="13" rx="2.2" />
          <rect x="16.9" y="6" width="4.4" height="16" rx="2.2" />
          <rect x="22.3" y="8" width="4.4" height="14" rx="2.2" />
          <rect x="27.7" y="12" width="3.8" height="11" rx="1.9" />
          <path d="M11.5 20.5c-2.6-2.2-5.2-.4-4.2 2.6l3.4 6.4c2 3.7 5.2 5.5 9 5.5h1.6c4.9 0 8.3-3.2 8.3-8V21.5H11.5Z" />
        </g>
        <rect x="1.5" y="17" width="5" height="2.4" rx="1.2" transform="rotate(-38 4 18)" opacity="0.85" />
        <rect x="3" y="24" width="4" height="2.4" rx="1.2" transform="rotate(-38 5 25)" opacity="0.6" />
      </svg>
    </span>
  );
}

export function InicioHeader({
  date,
  onOpenAvisos,
}: {
  date: InicioData["date"];
  onOpenAvisos: () => void;
}) {
  const monthLabel = `${date.monthName[0].toUpperCase()}${date.monthName.slice(1)} de ${date.year}`;

  return (
    <header className="mb-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="flex items-center gap-[18px]">
        <Wave />
        <div>
          <h1 className="text-[22px] font-bold leading-tight">Olá, {currentUser.firstName}!</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Confira seu desempenho e acompanhe suas metas do mês.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 items-center gap-2.5 rounded-full border border-border/60 bg-card/70 px-3.5 text-[11px]"
          title="Por enquanto só o mês atual está disponível"
        >
          <CalendarDays className="h-3.5 w-3.5 text-primary-glow" />
          {monthLabel}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <button
          onClick={onOpenAvisos}
          aria-label="Abrir Mural de Avisos"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground transition-colors hover:text-primary"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-3 pl-1">
          <Avatar />
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold">{currentUser.fullName}</p>
            <p className="text-[10px] text-muted-foreground">{currentUser.role}</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </div>
      </div>
    </header>
  );
}
