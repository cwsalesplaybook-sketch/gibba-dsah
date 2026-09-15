import { Sparkles, Calendar } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Gibba</h1>
          <p className="text-sm text-muted-foreground">Programa de Representantes</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        Setembro de 2026
      </div>
    </header>
  );
}
