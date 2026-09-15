import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "muted";

export function Badge({
  className,
  variant = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "success"
          ? "bg-success/15 text-success"
          : "bg-secondary text-secondary-foreground",
        className ?? ""
      )}
      {...props}
    />
  );
}
