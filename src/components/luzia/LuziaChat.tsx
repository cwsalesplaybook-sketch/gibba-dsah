import { useEffect, useRef, useState } from "react";
import { Bot, Check, ChevronDown, Copy, GraduationCap, Send, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { PageId } from "@/components/Sidebar";
import type { HitView, LuziaApi, Message } from "@/lib/luzia/useLuzia";
import { TeachModal } from "./TeachModal";

const SUGGESTIONS = [
  "Como funciona a comissão do representante?",
  "O que falar na abertura da ligação?",
  "Quais são as condições especiais do programa?",
  "Como responder a objeção de falta de tempo?",
];

const sourceLabel: Record<HitView["source"], string> = {
  playbook: "Playbook",
  template: "Templates",
  ensinado: "Ensinado por você",
};

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      // clipboard indisponível
    }
  }
  return (
    <button onClick={copy} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copiado" : "Copiar"}
    </button>
  );
}

function HitCard({ hit, primary, onNavigate }: { hit: HitView; primary?: boolean; onNavigate: (page: PageId) => void }) {
  const [open, setOpen] = useState(false);
  const truncated = hit.excerpt !== hit.full;
  const text = open ? hit.full : hit.excerpt;
  const target: PageId | null = hit.source === "playbook" ? "playbook" : hit.source === "template" ? "templates" : null;

  return (
    <div className={cn("rounded-xl border border-border", primary ? "bg-card p-4" : "bg-secondary p-3")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
          {sourceLabel[hit.source]}
        </span>
        <p className={cn("min-w-0 flex-1 font-semibold text-foreground", primary ? "text-sm" : "text-xs")}>{hit.title}</p>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {truncated && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-deep hover:bg-accent"
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            {open ? "Ver só o trecho" : "Ver texto completo"}
          </button>
        )}
        <CopyButton text={hit.full} />
        {target && (
          <button onClick={() => onNavigate(target)} className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            Abrir {sourceLabel[hit.source]}
          </button>
        )}
      </div>
    </div>
  );
}

function LuziaBubble({
  message,
  luzia,
  onNavigate,
  onTeach,
}: {
  message: Message;
  luzia: LuziaApi;
  onNavigate: (page: PageId) => void;
  onTeach: (message: Message) => void;
}) {
  const hits = message.hits ?? [];
  const [primary, ...others] = hits;
  const [showOthers, setShowOthers] = useState(false);
  const askedSomething = Boolean(message.query);

  return (
    <div className="flex items-start gap-3">
      <span className="tile h-8 w-8 rounded-lg">
        <Bot className="h-4 w-4" />
      </span>
      <div className="min-w-0 max-w-[46rem] flex-1 space-y-3">
        <p className="text-sm text-foreground">{message.text}</p>

        {primary && <HitCard hit={primary} primary onNavigate={onNavigate} />}

        {others.length > 0 && (
          <div>
            <button onClick={() => setShowOthers((v) => !v)} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showOthers && "rotate-180")} />
              {showOthers ? "Esconder outros resultados" : `Ver outros ${others.length} resultados parecidos`}
            </button>
            {showOthers && (
              <div className="mt-2 space-y-2">
                {others.map((hit) => (
                  <HitCard key={hit.itemId} hit={hit} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        )}

        {askedSomething && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {primary && (
              <>
                <span className="text-muted-foreground">Isso ajudou?</span>
                <button
                  onClick={() => luzia.rate(message.id, "up")}
                  aria-pressed={message.rating === "up"}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium transition-colors",
                    message.rating === "up" ? "border-success bg-success/10 text-success" : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> Ajudou
                </button>
                <button
                  onClick={() => luzia.rate(message.id, "down")}
                  aria-pressed={message.rating === "down"}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium transition-colors",
                    message.rating === "down" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <ThumbsDown className="h-3.5 w-3.5" /> Não era isso
                </button>
              </>
            )}
            {message.taughtId ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 font-medium text-success">
                <Check className="h-3.5 w-3.5" /> Resposta ensinada
              </span>
            ) : (
              <button
                onClick={() => onTeach(message)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium transition-colors",
                  !primary || message.rating === "down" || message.confidence === "baixa"
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary"
                )}
              >
                <GraduationCap className="h-3.5 w-3.5" /> Ensinar a Luzia
              </button>
            )}
          </div>
        )}
        {message.rating === "up" && <p className="text-xs text-muted-foreground">Obrigada! Guardei que essa resposta serve para perguntas assim.</p>}
        {message.rating === "down" && !message.taughtId && (
          <p className="text-xs text-muted-foreground">Anotado, não vou mais sugerir isso para essa pergunta. Se você me ensinar a resposta certa, eu passo a acertar.</p>
        )}
      </div>
    </div>
  );
}

export function LuziaChat({ luzia, onNavigate }: { luzia: LuziaApi; onNavigate: (page: PageId) => void }) {
  const [draft, setDraft] = useState("");
  const [teaching, setTeaching] = useState<Message | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [luzia.messages.length]);

  function submit(text = draft) {
    if (!text.trim()) return;
    luzia.ask(text);
    setDraft("");
  }

  return (
    <Card className="flex h-[calc(100vh-15rem)] min-h-[460px] flex-col overflow-hidden">
      <div ref={scroller} className="flex-1 space-y-5 overflow-y-auto p-5">
        {luzia.messages.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-8 text-center">
            <span className="tile h-12 w-12 rounded-xl">
              <Bot className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-semibold text-foreground">Oi, eu sou a Luzia</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Respondo com base no Playbook, nos Templates e em tudo que você me ensinar. Quando eu errar ou não souber, é só me ensinar que eu passo a acertar.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          luzia.messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {message.text}
                </p>
              </div>
            ) : (
              <LuziaBubble key={message.id} message={message} luzia={luzia} onNavigate={onNavigate} onTeach={setTeaching} />
            )
          )
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Pergunte algo à Luzia..."
            maxLength={300}
            className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Enviar"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
          {luzia.messages.length > 0 && (
            <button
              type="button"
              onClick={luzia.clearChat}
              aria-label="Limpar conversa"
              title="Limpar conversa"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {teaching && (
        <TeachModal
          initial={{ title: teaching.query ?? "" }}
          onSave={(input) => luzia.teach(input, teaching.id)}
          onClose={() => setTeaching(null)}
        />
      )}
    </Card>
  );
}
