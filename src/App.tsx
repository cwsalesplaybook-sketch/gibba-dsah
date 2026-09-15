import { useState } from "react";
import { Sidebar, type PageId } from "@/components/Sidebar";
import { MetasPage } from "@/components/MetasPage";
import { TemplatesPage } from "@/components/TemplatesPage";

export default function App() {
  const [page, setPage] = useState<PageId>("metas");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar active={page} onChange={setPage} />
      <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-8 lg:px-12 lg:pt-8">
        {page === "metas" ? <MetasPage /> : <TemplatesPage />}
      </main>
    </div>
  );
}
