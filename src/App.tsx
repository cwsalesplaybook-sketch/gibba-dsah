import { useState } from "react";
import { Sidebar, type PageId } from "@/components/Sidebar";
import { InicioPage } from "@/components/inicio/InicioPage";
import { MetasPage } from "@/components/MetasPage";
import { TemplatesPage } from "@/components/TemplatesPage";
import { PlaybookPage } from "@/components/PlaybookPage";
import { EmConstrucaoPage } from "@/components/EmConstrucaoPage";

const emConstrucao: Partial<Record<PageId, { title: string; description?: string }>> = {
  links: { title: "Links Importantes" },
  dados: { title: "Dados" },
  forecast: { title: "Forecast" },
  avisos: { title: "Mural de Avisos" },
  luzia: {
    title: "Luzia",
    description: "Aqui vai morar a Luzia, o chatbot do Gibba. Em breve ela estará disponível.",
  },
};

export default function App() {
  const [page, setPage] = useState<PageId>("inicio");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar active={page} onChange={setPage} />
      <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-8 lg:pr-[26px] lg:pt-6">
        {page === "inicio" && <InicioPage onNavigate={setPage} />}
        {page === "metas" && <MetasPage />}
        {page === "templates" && <TemplatesPage />}
        {page === "playbook" && <PlaybookPage />}
        {emConstrucao[page] && <EmConstrucaoPage {...emConstrucao[page]!} />}
      </main>
    </div>
  );
}
