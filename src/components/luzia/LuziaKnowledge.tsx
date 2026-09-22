import { useRef, useState } from "react";
import { Download, FileText, GraduationCap, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Button, Field } from "@/components/ui/Field";
import { normalize } from "@/lib/luzia/text";
import type { LuziaApi, Taught } from "@/lib/luzia/useLuzia";
import { TeachModal, textareaClass } from "./TeachModal";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });

function Stat({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

// Cola um texto (ou abre um .txt/.md) e a Luzia divide em pedaços para aprender.
function ImportModal({ luzia, onClose, onDone }: { luzia: LuziaApi; onClose: () => void; onDone: (message: string) => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > 1_000_000) {
      setError("Arquivo grande demais (máximo 1 MB).");
      return;
    }
    try {
      setText(await file.text());
      if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch {
      setError("Não consegui ler esse arquivo.");
    }
  }

  function save() {
    const count = luzia.importText(title, text);
    onDone(count === 1 ? "Aprendi 1 trecho novo." : `Aprendi ${count} trechos novos.`);
    onClose();
  }

  return (
    <Modal
      title="Ensinar com um texto"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={!text.trim()} className="disabled:opacity-40">
            Ensinar
          </Button>
        </>
      }
    >
      <Field label="Nome do assunto" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Política de comissionamento 2026" maxLength={120} autoFocus />
      <label className="block text-sm">
        <span className="mb-1 block text-muted-foreground">Texto</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={9} placeholder="Cole aqui o texto que o Pedro deve aprender." className={textareaClass} />
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>Ou escolha um arquivo .txt ou .md</span>
        <input type="file" accept=".txt,.md,.markdown,text/plain,text/markdown" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Textos longos são divididos em pedaços menores, assim o Pedro responde com o trecho certo e não com o documento inteiro.
      </p>
    </Modal>
  );
}

export function LuziaKnowledge({ luzia }: { luzia: LuziaApi }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<null | "new" | "import" | { edit: Taught }>(null);
  const [notice, setNotice] = useState("");
  const backupInput = useRef<HTMLInputElement>(null);

  const filtered = luzia.taught.filter((t) => {
    const q = normalize(query.trim());
    if (!q) return true;
    return normalize(`${t.title} ${t.text} ${t.aliases.join(" ")}`).includes(q);
  });

  function exportBackup() {
    const blob = new Blob([luzia.exportBackup()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `luzia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(file: File | undefined) {
    if (!file) return;
    try {
      const added = luzia.importBackup(await file.text());
      setNotice(added === 1 ? "Backup importado: 1 item novo." : `Backup importado: ${added} itens novos.`);
    } catch {
      setNotice("Não consegui importar: esse arquivo não é um backup do Pedro.");
    }
    if (backupInput.current) backupInput.current.value = "";
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Script da planilha"
          value={luzia.scriptCount}
          hint={luzia.scriptLive ? "Perguntas, sincronizadas com a planilha SCRIPT" : "Perguntas (cópia salva, planilha indisponível agora)"}
        />
        <Stat label="Base do PUMA" value={luzia.baseCount} hint="Trechos do Playbook e dos Templates" />
        <Stat label="Ensinado por você" value={luzia.taught.length} hint="Itens que você adicionou" />
        <Stat label="Respostas avaliadas" value={luzia.ratedCount} hint="Vezes que você marcou Ajudou ou Não era isso" />
      </div>

      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GraduationCap className="h-4 w-4 text-primary" />
          Como o Pedro aprende
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Ele segue o script da planilha SCRIPT: as respostas, as palavras-chave e as perguntas relacionadas vêm de lá, e mudanças na planilha aparecem em poucos minutos.</li>
          <li>Ele também lê todo o Playbook e os Templates. Você adiciona o que falta aqui, ou direto na conversa com “Ensinar o Pedro”.</li>
          <li>Quando você marca “Ajudou”, ele lembra que aquela resposta serve para perguntas parecidas. Com “Não era isso”, ele para de sugerir aquela resposta.</li>
          <li>Não usa nenhuma IA externa: tudo roda no seu navegador e nada do que você ensina sai daqui.</li>
        </ul>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setModal("new")} className="inline-flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Ensinar algo novo
        </Button>
        <Button variant="ghost" onClick={() => setModal("import")} className="inline-flex items-center gap-1.5">
          <FileText className="h-4 w-4" /> Ensinar com um texto
        </Button>
        <span className="hidden flex-1 sm:block" />
        <Button variant="ghost" onClick={exportBackup} disabled={luzia.taught.length === 0} className="inline-flex items-center gap-1.5 disabled:opacity-40">
          <Download className="h-4 w-4" /> Exportar backup
        </Button>
        <Button variant="ghost" onClick={() => backupInput.current?.click()} className="inline-flex items-center gap-1.5">
          <Upload className="h-4 w-4" /> Importar backup
        </Button>
        <input ref={backupInput} type="file" accept=".json,application/json" className="hidden" onChange={(e) => importBackup(e.target.files?.[0])} />
      </div>

      {notice && (
        <p className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground" role="status">
          {notice}
        </p>
      )}

      {luzia.taught.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <span className="tile h-11 w-11 rounded-xl">
            <GraduationCap className="h-5 w-5" />
          </span>
          <p className="font-semibold text-foreground">Ainda não ensinou nada ao Pedro</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Adicione respostas, regras e informações do dia a dia. Elas passam a aparecer nas respostas dela logo em seguida.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar no que você ensinou"
              className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          {filtered.length === 0 && <p className="px-1 text-sm text-muted-foreground">Nada encontrado para essa busca.</p>}
          {filtered.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {item.aliases.map((alias) => (
                      <span key={alias} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                        {alias}
                      </span>
                    ))}
                    <span className="text-[11px] text-muted-foreground">Ensinado em {formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setModal({ edit: item })} aria-label="Editar" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Apagar este item? O Pedro vai esquecer essa informação.")) luzia.deleteTaught(item.id);
                    }}
                    aria-label="Apagar"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        O que você ensina fica salvo neste navegador. Para levar para outro computador ou guardar uma cópia, use Exportar backup.
      </p>

      {modal === "new" && <TeachModal title="Ensinar algo novo" onSave={(input) => luzia.teach(input)} onClose={() => setModal(null)} />}
      {modal === "import" && <ImportModal luzia={luzia} onClose={() => setModal(null)} onDone={setNotice} />}
      {modal && typeof modal === "object" && (
        <TeachModal
          title="Editar o que o Pedro sabe"
          initial={{ title: modal.edit.title, text: modal.edit.text, aliases: modal.edit.aliases }}
          onSave={(input) => luzia.updateTaught(modal.edit.id, input)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
