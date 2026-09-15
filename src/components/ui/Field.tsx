import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      <input
        {...props}
        className={
          "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary " +
          (className ?? "")
        }
      />
    </label>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: { variant?: "primary" | "ghost" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "rounded-lg px-4 py-2 text-sm font-semibold transition-colors " +
        (variant === "primary"
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "bg-secondary text-secondary-foreground hover:bg-muted") +
        " " +
        (className ?? "")
      }
    />
  );
}
