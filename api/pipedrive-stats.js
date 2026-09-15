// Vercel serverless function: conta representantes cadastrados no mês.
// Regra de negócio (confirmada com a Gabi): 1 representante cadastrado =
// 1 negócio marcado como "ganho" (won) no funil "[REP] Funil de Reunião
// Agendada" (pipeline_id 75) do Pipedrive, dentro do mês corrente.
//
// Nota: o endpoint /v1/deals ignora silenciosamente o filtro pipeline_id
// na query string (não é um parâmetro suportado por ele). stage_id, por
// outro lado, é suportado de verdade — por isso consultamos por estágio.
const PIPELINE_ID = 75;
const STAGE_IDS = [421, 424, 425, 429]; // estágios do pipeline 75

async function fetchWonDealsForStage(stageId, token, monthPrefix, monthStart) {
  const matches = [];
  let start = 0;
  const limit = 100;
  const maxPages = 5; // trava de segurança por estágio

  for (let page = 0; page < maxPages; page++) {
    const url =
      `https://api.pipedrive.com/v1/deals?status=won&stage_id=${stageId}` +
      `&sort=${encodeURIComponent("update_time DESC")}` +
      `&start=${start}&limit=${limit}&api_token=${token}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error ?? "Erro desconhecido do Pipedrive");
    }

    const deals = json.data ?? [];
    let shouldStop = false;
    for (const deal of deals) {
      if (deal.update_time && new Date(deal.update_time) < monthStart) {
        shouldStop = true;
        break;
      }
      if (deal.won_time && deal.won_time.startsWith(monthPrefix)) matches.push(deal);
    }
    if (shouldStop) break;

    const pagination = json.additional_data?.pagination;
    if (!pagination?.more_items_in_collection) break;
    start = pagination.next_start;
  }

  return matches;
}

export default async function handler(req, res) {
  const token = process.env.PIPEDRIVE_API_TOKEN;

  if (!token) {
    res.status(500).json({ error: "PIPEDRIVE_API_TOKEN não configurado no projeto Vercel." });
    return;
  }

  const now = new Date();
  const monthPrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  try {
    const results = await Promise.all(
      STAGE_IDS.map((stageId) => fetchWonDealsForStage(stageId, token, monthPrefix, monthStart))
    );
    const count = results.reduce((sum, deals) => sum + deals.length, 0);

    res.status(200).json({
      count,
      month: monthPrefix,
      pipelineId: PIPELINE_ID,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Falha ao buscar dados do Pipedrive.", message: String(error) });
  }
}
