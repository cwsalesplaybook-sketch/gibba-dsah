import { useState } from "react";
import { Sidebar, type PageId } from "@/components/Sidebar";
import { MetasPage } from "@/components/metas/MetasPage";
import { ContratosPage } from "@/components/contratos/ContratosPage";
import { TemplatesPage } from "@/components/TemplatesPage";
import { PlaybookPage } from "@/components/PlaybookPage";
import { LuziaPage } from "@/components/luzia/LuziaPage";
import { EmConstrucaoPage } from "@/components/EmConstrucaoPage";

const emConstrucao: Partial<Record<PageId, { title: string; description?: string }>> = {
  links: { title: "Links Importantes" },
  dados: { title: "Dados" },
};

export default function App() {
  const [page, setPage] = useState<PageId>("metas");

  return (
    <div className="flex min-h-screen">
      <Sidebar active={page} onChange={setPage} />
      <main className="flex min-w-0 flex-1 flex-col px-4 pb-8 pt-20 sm:px-8 lg:pb-6 lg:pr-[26px] lg:pt-5">
        {page === "metas" && <MetasPage />}
        {page === "contratos" && <ContratosPage />}
        {page === "templates" && <TemplatesPage />}
        {page === "playbook" && <PlaybookPage />}
        {page === "luzia" && <LuziaPage onNavigate={setPage} />}
        {emConstrucao[page] && <EmConstrucaoPage {...emConstrucao[page]!} />}
      </main>
    </div>
  );
}
