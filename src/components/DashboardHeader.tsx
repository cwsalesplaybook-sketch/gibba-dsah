import { Calendar } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pl-12 lg:pl-0">
      <div>
        <h1 className="text-2xl font-bold leading-tight">Metas</h1>
        <p className="text-sm text-muted-foreground">Programa de Representantes</p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        Setembro de 2026
      </div>
    </header>
  );
}
