import { Construction } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EmConstrucaoPage({
  title,
  description = "Esta área ainda está sendo preparada e vai aparecer por aqui em breve.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card className="flex flex-col items-center gap-3 px-6 py-20 text-center">
        <span className="tile h-12 w-12 rounded-xl">
          <Construction className="h-6 w-6" />
        </span>
        <p className="text-lg font-semibold">Em construção</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </Card>
    </div>
  );
}
