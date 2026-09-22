import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowDownRight, ArrowUpRight, ChevronRight, HelpCircle } from "lucide-react";
import { formatPct } from "@/lib/useMetasData";
import { cn } from "@/lib/utils";

const sizes = {
  lg: "h-10 w-10 rounded-[10px]",
  md: "h-9 w-9 rounded-[10px]",
  sm: "h-8 w-8 rounded-lg",
};

// Quadradinho discreto que abriga o ícone de cada card.
export function IconBox({
  children,
  size = "lg",
  className,
}: {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return <span className={cn("tile", sizes[size], className)}>{children}</span>;
}

// "↘ 12,8%": em pílula (painel de projeção) ou só texto (cards de KPI).
export function DeltaBadge({ value, plain = false }: { value: number; plain?: boolean }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        plain ? "text-[13px]" : "rounded-md px-2 py-0.5 text-xs",
        up ? "text-success" : "text-destructive",
        !plain && (up ? "bg-success/10" : "bg-destructive/10")
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {formatPct(value)}
    </span>
  );
}

// "soft": etiqueta rosada do título. "chip": etiqueta neutra com seta, dentro dos cards.
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
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium",
        variant === "soft"
          ? "bg-accent text-accent-foreground"
          : "border border-border bg-card text-foreground/80",
        className
      )}
    >
      {children}
      {variant === "chip" && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
    </span>
  );
}

// Botão "?" que abre um pop-up flutuante com uma explicação, sem ocupar espaço fixo no
// card. Usa portal (como o popover de tags do Contratos) pra nunca ficar cortado.
export function InfoPopover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = 320;
      setPos({
        top: rect.bottom + 8,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      });
    }
    setOpen((value) => !value);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Como essas metas funcionam"
        className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)} />
            <div
              className="fixed z-[71] w-80 max-w-[calc(100vw-24px)] rounded-xl border border-border bg-popover p-3.5 text-xs leading-relaxed text-popover-foreground shadow-card"
              style={{ top: pos.top, left: pos.left }}
            >
              {children}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
