// Vercel serverless function: follow-up pós-reunião.
// Fonte: Pipedrive, funil "[REP] Funil de Reunião Agendada" (pipeline 75), confirmado
// com a Gabi em 2026-09-22 ("o funil de reunião agendada, associados ao meu nome").
//
// Contam como "precisa de follow-up" TODAS as etapas do funil, EXCETO:
//   - a primeira ("Reunião Agendada"): a reunião ainda não aconteceu, não é follow-up ainda
//   - as de contrato ("Contrato Enviado"/"Contrato Assinado"): já têm a própria aba
//     "Assinatura de Contrato"
// As etapas são buscadas ao vivo (GET /v1/stages) e filtradas pelo NOME, não por id fixo —
// o time já mudou/criou etapa no meio do caminho antes (aprendizado de 2026-09-22).
//
// Só aparecem negócios cuja responsável é a usuária configurada em OWNER_NAME.
// Não devolvemos telefone/e-mail: esta rota é aberta (sem login) e não deve expor contatos
// (mesma regra da aba de Assinatura de Contrato).
const API = "https://api.pipedrive.com/v1";
const PIPELINE_ID = 75;
const OWNER_NAME = "Gabrielly Oliveira";
// Nomes de etapa que NÃO contam como follow-up (comparados sem acento/caixa).
const EXCLUDED_STAGE_NAMES = ["reuniao agendada", "contrato enviado", "contrato assinado", "assinatura de contrato"];

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();

const toIso = (value) => (value ? `${String(value).replace(" ", "T")}Z` : null);
const isMine = (deal) => normalize(deal.owner_name || deal.user_id?.name).includes(normalize(OWNER_NAME));

async function fetchStages(pipelineId, token) {
  const url = `${API}/stages?pipeline_id=${pipelineId}&api_token=${token}`;
  const response = await fetch(url);
  const json = await response.json();
  if (!json.success) throw new Error(json.error ?? `Erro ao buscar etapas do funil ${pipelineId}`);
  return json.data ?? [];
}

async function fetchOpenDeals(stageId, token) {
  const deals = [];
  let start = 0;
  const maxPages = 20;

  for (let page = 0; page < maxPages; page++) {
    const query = new URLSearchParams({ status: "open", stage_id: String(stageId), start: String(start), limit: "100", api_token: token });
    const response = await fetch(`${API}/deals?${query}`);
    const json = await response.json();
    if (!json.success) throw new Error(json.error ?? "Erro desconhecido do Pipedrive");

    deals.push(...(json.data ?? []));
    const pagination = json.additional_data?.pagination;
    if (!pagination?.more_items_in_collection) break;
    start = pagination.next_start;
  }
  return deals;
}

function toRow(deal, stageName) {
  return {
    id: deal.id,
    name: deal.person_name || deal.title,
    owner: deal.owner_name || deal.user_id?.name || null,
    stageId: deal.stage_id,
    stageName,
    enteredStageAt: toIso(deal.stage_change_time),
  };
}

export default async function handler(req, res) {
  const token = process.env.PIPEDRIVE_API_TOKEN;

  if (!token) {
    res.status(500).json({ error: "PIPEDRIVE_API_TOKEN não configurado no projeto Vercel." });
    return;
  }

  try {
    const allStages = await fetchStages(PIPELINE_ID, token);
    const stages = allStages.filter((stage) => !EXCLUDED_STAGE_NAMES.includes(normalize(stage.name)));

    const results = await Promise.all(
      stages.map(async (stage) => (await fetchOpenDeals(stage.id, token)).map((deal) => toRow(deal, stage.name)))
    );
    const allRows = results.flat();
    const rows = allRows
      .filter(isMine)
      .sort((a, b) => new Date(a.enteredStageAt ?? 0) - new Date(b.enteredStageAt ?? 0));

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json({
      pipelineId: PIPELINE_ID,
      stages: stages.map((s) => ({ id: s.id, name: s.name })),
      owner: OWNER_NAME,
      hidden: allRows.length - rows.length,
      rows,
      debug: allRows.map((r) => ({ id: r.id, name: r.name, owner: r.owner, stageId: r.stageId })), // TEMP
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Falha ao buscar follow-ups no Pipedrive.", message: String(error) });
  }
}
