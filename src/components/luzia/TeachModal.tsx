import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Field } from "@/components/ui/Field";
import type { TaughtInput } from "@/lib/luzia/useLuzia";

export const textareaClass =
  "w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-primary";

// Formulário para ensinar (ou corrigir) uma informação da Luzia.
export function TeachModal({
  title = "Ensinar a Luzia",
  initial,
  onSave,
  onClose,
}: {
  title?: string;
  initial?: Partial<TaughtInput>;
  onSave: (input: TaughtInput) => void;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState(initial?.title ?? "");
  const [answer, setAnswer] = useState(initial?.text ?? "");
  const [aliases, setAliases] = useState((initial?.aliases ?? []).join(", "));

  const canSave = subject.trim().length > 0 && answer.trim().length > 0;

  function save() {
    if (!canSave) return;
    onSave({
      title: subject,
      text: answer,
      aliases: aliases.split(",").map((a) => a.trim()).filter(Boolean),
    });
    onClose();
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={!canSave} className="disabled:opacity-40">
            Salvar
          </Button>
        </>
      }
    >
      <Field
        label="Pergunta ou assunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Ex.: Qual é o prazo para o representante assinar o contrato?"
        autoFocus
        maxLength={160}
      />
      <label className="block text-sm">
        <span className="mb-1 block text-muted-foreground">Resposta</span>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={7}
          placeholder="Escreva a resposta como a Luzia deve dizer."
          className={textareaClass}
          maxLength={4000}
        />
      </label>
      <Field
        label="Outras formas de perguntar (opcional, separadas por vírgula)"
        value={aliases}
        onChange={(e) => setAliases(e.target.value)}
        placeholder="Ex.: prazo do contrato, tempo para assinar"
        maxLength={300}
      />
      <p className="text-xs text-muted-foreground">
        Quanto mais jeitos de perguntar você incluir, mais fácil a Luzia encontrar esta resposta.
      </p>
    </Modal>
  );
}
