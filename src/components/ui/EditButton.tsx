import { Pencil } from "lucide-react";

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Editar"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-primary"
    >
      <Pencil className="h-3.5 w-3.5" />
    </button>
  );
}
