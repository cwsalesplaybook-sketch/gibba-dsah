// Lê a planilha SCRIPT (Google Sheets, compartilhada por link) e devolve as perguntas e respostas da Luzia.
// Assim, quando a planilha é editada, a Luzia passa a seguir a versão nova sem precisar de deploy.
const SHEET_ID = "1ZD5HHSLgxL3HlgFSHKTxPbmNAquQSeDam9k-RDeVnvo";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Colunas: ID, Categoria, Gatilhos/Palavras-chave, Pergunta Principal, Resposta do Bot, Botões/Opções, Fallback
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function toEntries(rows) {
  const entries = [];
  for (const r of rows.slice(1)) {
    const id = (r[0] ?? "").trim();
    const question = (r[3] ?? "").trim();
    const answer = (r[4] ?? "").trim();
    if (!id || !question || !answer) continue;
    const options = [];
    for (const line of (r[5] ?? "").split("\n")) {
      const match = /^\s*(.*?)\s*→\s*ID\s*(\d+)\s*$/.exec(line);
      if (match) options.push({ label: match[1], targetId: match[2].padStart(3, "0") });
    }
    entries.push({
      id: id.padStart(3, "0"),
      category: (r[1] ?? "").trim(),
      triggers: (r[2] ?? "").split(/,\s*/).map((t) => t.trim()).filter(Boolean),
      question,
      answer,
      options,
      fallback: (r[6] ?? "").trim(),
    });
  }
  return entries;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(CSV_URL, { redirect: "follow" });
    if (!response.ok) throw new Error(`Google respondeu ${response.status}`);
    const entries = toEntries(parseCsv((await response.text()).replace(/^﻿/, "")));
    if (entries.length === 0) throw new Error("Planilha sem linhas válidas");
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
    res.status(200).json({ updatedAt: new Date().toISOString(), entries });
  } catch (error) {
    res.status(502).json({ error: String(error?.message ?? error) });
  }
}
