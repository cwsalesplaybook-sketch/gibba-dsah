// Divide um texto longo em pedaços menores, para a Luzia achar o trecho certo em vez do documento inteiro.
export type Chunk = { title: string; text: string };

const MAX_CHARS = 900;

function packParagraphs(text: string): string[] {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length + 2 > MAX_CHARS) {
      chunks.push(current);
      current = "";
    }
    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }
  if (current) chunks.push(current);
  return chunks;
}

export function chunkText(title: string, raw: string): Chunk[] {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return [];
  if (text.length <= MAX_CHARS) return [{ title, text }];

  // Se o texto tem títulos (# Título), cada seção vira um pedaço com o próprio título.
  const sections: { heading: string; body: string }[] = [];
  let heading = "";
  let body: string[] = [];
  for (const line of text.split("\n")) {
    const match = /^#{1,6}\s+(.+)$/.exec(line);
    if (match) {
      if (body.join("\n").trim()) sections.push({ heading, body: body.join("\n") });
      heading = match[1].trim();
      body = [];
    } else {
      body.push(line);
    }
  }
  if (body.join("\n").trim()) sections.push({ heading, body: body.join("\n") });

  const chunks: Chunk[] = [];
  for (const section of sections) {
    const base = section.heading ? `${title} · ${section.heading}` : title;
    const parts = packParagraphs(section.body);
    parts.forEach((part, i) => {
      chunks.push({ title: parts.length > 1 ? `${base} (parte ${i + 1})` : base, text: part });
    });
  }
  return chunks;
}
