import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatPct } from "@/lib/useInicioData";
import { cn } from "@/lib/utils";

const sizes = {
  lg: "h-10 w-10 rounded-xl",
  md: "h-8 w-8 rounded-lg",
  sm: "h-[31px] w-[31px] rounded-[10px]",
};

// Quadradinho com fundo rosa translúcido que abriga os ícones dos cards.
export function IconBox({
  children,
  size = "lg",
  className,
}: {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-primary/35 text-primary-glow",
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// "↗ 12,4%": em pílula (painel de projeção) ou só texto (cards de KPI).
export function DeltaBadge({ value, plain = false }: { value: number; plain?: boolean }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        plain ? "text-[13px] font-medium" : "rounded-full px-2 py-0.5 text-[11px]",
        up ? "text-success" : "text-destructive",
        !plain && "font-semibold",
        !plain && (up ? "bg-success/15" : "bg-destructive/15")
      )}
    >
      <Icon className="h-3 w-3" />
      {formatPct(value)}
    </span>
  );
}

export function StatusPill({
  children,
  tone = "pink",
  className,
}: {
  children: ReactNode;
  tone?: "pink" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-[3px] text-[11px] font-medium",
        tone === "green"
          ? "border-transparent bg-[oklch(26%_0.07_315)] text-success"
          : "border-primary/30 bg-primary/25 text-primary-glow",
        className
      )}
    >
      {children}
    </span>
  );
}
