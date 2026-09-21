// Conhecimento de base da Luzia: tudo que já está no Playbook e nos Templates,
// quebrado em pedaços pequenos para a busca achar exatamente o trecho certo.
import { playbookSections } from "@/data/playbook";
import { templates } from "@/data/templates";
import type { KnowledgeItem } from "./search";

const MAX_CHUNK = 900;

function buildPlaybookItems(): KnowledgeItem[] {
  const items: KnowledgeItem[] = [];

  for (const section of playbookSections) {
    const base = { source: "playbook" as const, group: section.title, sectionId: section.id };
    let sub = "";
    let counter = 0;
    let buffer: string[] = [];

    const titleFor = (label?: string) => [section.title, sub, label].filter(Boolean).join(" · ");
    const push = (title: string, text: string) => {
      const clean = text.trim();
      if (clean) items.push({ ...base, id: `pb:${section.id}:${counter++}`, title, text: clean });
    };
    const flush = () => {
      if (buffer.length) push(titleFor(), buffer.join("\n\n"));
      buffer = [];
    };
    const addText = (text: string) => {
      const size = buffer.reduce((sum, part) => sum + part.length, 0);
      if (size + text.length > MAX_CHUNK) flush();
      buffer.push(text);
    };

    push(section.title, section.summary);

    for (const block of section.blocks) {
      switch (block.type) {
        case "subheading":
          flush();
          sub = block.text;
          break;
        case "paragraph":
          addText(block.text);
          break;
        case "list":
          addText(block.items.map((item) => `• ${item}`).join("\n"));
          break;
        case "steps":
          flush();
          for (const step of block.items) push(titleFor(step.label), step.text);
          break;
        case "table":
          flush();
          for (const row of block.rows) {
            const text = row
              .map((cell, i) => (block.headers[i] ? `${block.headers[i]}: ${cell}` : cell))
              .join("\n");
            push(titleFor(row[0]), text);
          }
          break;
      }
    }
    flush();
  }
  return items;
}

function buildTemplateItems(): KnowledgeItem[] {
  return templates.map((template) => ({
    id: `tp:${template.id}`,
    title: `Template · ${template.title}`,
    text: template.text,
    source: "template",
    group: template.category,
  }));
}

export const baseKnowledge: KnowledgeItem[] = [...buildPlaybookItems(), ...buildTemplateItems()];
