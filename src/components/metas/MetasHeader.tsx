import { useState } from "react";
import { Bell, CalendarDays, ChevronDown } from "lucide-react";
import { currentUser } from "@/data/mockData";
import type { MetasData } from "@/lib/useMetasData";

function Avatar() {
  const [failed, setFailed] = useState(false);
  const initials = currentUser.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <span className="tile3d tile-pink h-10 w-10 overflow-hidden rounded-full text-xs font-bold">
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
    <span className="ml-1 flex h-11 w-11 shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 36 36" className="h-11 w-11 drop-shadow-[0_6px_6px_oklch(66%_0.2_352/0.35)]">
        <defs>
          <linearGradient id="waveFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(80% 0.15 345)" />
            <stop offset="100%" stopColor="oklch(66% 0.21 352)" />
          </linearGradient>
        </defs>
        <g transform="rotate(-14 20 21)" fill="url(#waveFill)">
          <rect x="11.5" y="10" width="4.4" height="13" rx="2.2" />
          <rect x="16.9" y="6" width="4.4" height="16" rx="2.2" />
          <rect x="22.3" y="8" width="4.4" height="14" rx="2.2" />
          <rect x="27.7" y="12" width="3.8" height="11" rx="1.9" />
          <path d="M11.5 20.5c-2.6-2.2-5.2-.4-4.2 2.6l3.4 6.4c2 3.7 5.2 5.5 9 5.5h1.6c4.9 0 8.3-3.2 8.3-8V21.5H11.5Z" />
        </g>
        <g fill="oklch(74% 0.17 350)">
          <rect x="1.5" y="17" width="5" height="2.4" rx="1.2" transform="rotate(-38 4 18)" opacity="0.85" />
          <rect x="3" y="24" width="4" height="2.4" rx="1.2" transform="rotate(-38 5 25)" opacity="0.6" />
        </g>
      </svg>
    </span>
  );
}

export function MetasHeader({ date }: { date: MetasData["date"] }) {
  const monthLabel = `${date.monthName[0].toUpperCase()}${date.monthName.slice(1)} de ${date.year}`;

  return (
    <header className="mb-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="flex items-center gap-4">
        <Wave />
        <div>
          <h1 className="text-[26px] font-bold leading-tight">Olá, {currentUser.firstName}!</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Confira seu desempenho e acompanhe suas metas do mês.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-11 items-center gap-3 rounded-full border border-border bg-white/80 px-4 text-[13px] font-medium shadow-card"
          title="Por enquanto só o mês atual está disponível"
        >
          <CalendarDays className="h-4 w-4 text-primary" />
          {monthLabel}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <span
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 shadow-card"
          role="img"
          aria-label="Notificações"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
        </span>

        <div className="flex items-center gap-3 pl-1">
          <Avatar />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">{currentUser.fullName}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
        </div>
      </div>
    </header>
  );
}
