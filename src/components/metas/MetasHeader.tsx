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
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground">
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

export function MetasHeader({ date }: { date: MetasData["date"] }) {
  const monthLabel = `${date.monthName[0].toUpperCase()}${date.monthName.slice(1)} de ${date.year}`;

  return (
    <header className="mb-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Olá, {currentUser.firstName}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confira seu desempenho e acompanhe suas metas do mês.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-10 items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium"
          title="Por enquanto só o mês atual está disponível"
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {monthLabel}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <span
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
          role="img"
          aria-label="Notificações"
        >
          <Bell className="h-[18px] w-[18px] text-muted-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </span>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <Avatar />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">{currentUser.fullName}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
