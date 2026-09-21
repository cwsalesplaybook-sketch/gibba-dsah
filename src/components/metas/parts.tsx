import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { formatPct } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

type Tone = "pink" | "coral" | "mint" | "violet";

const sizes = {
  lg: "h-11 w-11 rounded-[14px]",
  md: "h-[38px] w-[38px] rounded-xl",
  sm: "h-8 w-8 rounded-[10px]",
};

// Azulejo de ícone com aparência 3D (gradiente + brilho + sombra colorida).
export function IconBox({
  children,
  size = "lg",
  tone = "pink",
  className,
}: {
  children: ReactNode;
  size?: keyof typeof sizes;
  tone?: Tone;
  className?: string;
}) {
  return <span className={cn("tile3d", `tile-${tone}`, sizes[size], className)}>{children}</span>;
}

// "↘ 12,8%": em pílula (painel de projeção) ou só texto (cards de KPI).
export function DeltaBadge({ value, plain = false }: { value: number; plain?: boolean }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold",
        plain ? "text-[13px]" : "rounded-full px-2.5 py-1 text-xs",
        up ? "text-success" : "text-destructive",
        !plain && (up ? "bg-success/10" : "bg-destructive/10")
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {formatPct(value)}
    </span>
  );
}

// "soft": pílula rosa clara do título. "chip": pílula branca com seta, dentro dos cards.
export function StatusPill({
  children,
  variant = "chip",
  className,
}: {
  children: ReactNode;
  variant?: "soft" | "chip";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-primary-deep",
        variant === "soft"
          ? "bg-accent"
          : "border border-primary/15 bg-white/80 shadow-[0_6px_14px_-8px_var(--primary)]",
        className
      )}
    >
      {children}
      {variant === "chip" && <ChevronRight className="h-3 w-3" />}
    </span>
  );
}
