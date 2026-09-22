// Vercel serverless function: conta representantes cadastrados no mês e a
// evolução mês a mês no ano corrente.
// Regra de negócio (confirmada com a Gabi em 2026-09-15, expandida em 2026-09-22):
// 1 representante cadastrado = 1 negócio marcado como "ganho" (won), em
// QUALQUER etapa, em QUALQUER um dos dois funis de captação de representantes:
//   - pipeline 75, "[REP] Funil de Reunião Agendada"
//   - pipeline 72, "[REP] Processo de Remarcação" (apelidado por ela de "funil de no-show":
//     quem falta à reunião agendada volta pra esse funil pra ser remarcado)
//
// As etapas de cada funil são buscadas ao vivo (GET /v1/stages?pipeline_id=X) em vez de
// fixas no código: o time já adicionou etapa nova no meio do caminho (ex.: "Contrato
// Assinado" em 2026-09-21) e um id fixo faria a contagem ficar pra trás silenciosamente.
//
// Nota: o endpoint /v1/deals ignora silenciosamente o filtro pipeline_id na query string
// (não é um parâmetro suportado por ele). stage_id, por outro lado, é suportado de
// verdade — por isso consultamos por estágio.
const PIPELINE_IDS = [75, 72];
const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

async function fetchStageIds(pipelineId, token) {
  const url = `https://api.pipedrive.com/v1/stages?pipeline_id=${pipelineId}&api_token=${token}`;
  const response = await fetch(url);
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error ?? `Erro ao buscar etapas do funil ${pipelineId}`);
  }
  return (json.data ?? []).map((stage) => stage.id);
}

async function fetchWonDealsForStage(stageId, token, yearStart) {
  const matches = [];
  let start = 0;
  const limit = 100;
  const maxPages = 20; // trava de segurança por estágio (cobre o ano inteiro)

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
      if (deal.update_time && new Date(deal.update_time) < yearStart) {
        shouldStop = true;
        break;
      }
      if (deal.won_time) matches.push(deal);
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
  const currentYear = now.getUTCFullYear();
  const currentMonthIndex = now.getUTCMonth(); // 0-11
  const monthPrefix = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}`;
  const yearStart = new Date(Date.UTC(currentYear, 0, 1));

  try {
    const stageIdsByPipeline = await Promise.all(PIPELINE_IDS.map((pipelineId) => fetchStageIds(pipelineId, token)));
    const stageIds = [...new Set(stageIdsByPipeline.flat())];

    const results = await Promise.all(stageIds.map((stageId) => fetchWonDealsForStage(stageId, token, yearStart)));
    // Um negócio pode, em teoria, aparecer em mais de uma busca (não deveria, mas por
    // segurança deduplicamos por id antes de contar).
    const seen = new Set();
    const allWonDeals = results.flat().filter((deal) => {
      if (seen.has(deal.id)) return false;
      seen.add(deal.id);
      return true;
    });

    const yearPrefix = `${currentYear}-`;
    const monthlyCounts = new Array(currentMonthIndex + 1).fill(0);
    for (const deal of allWonDeals) {
      if (!deal.won_time || !deal.won_time.startsWith(yearPrefix)) continue;
      const monthIndex = Number(deal.won_time.slice(5, 7)) - 1;
      if (monthIndex >= 0 && monthIndex <= currentMonthIndex) {
        monthlyCounts[monthIndex] += 1;
      }
    }

    const byMonth = monthlyCounts.map((value, index) => ({
      month: MONTH_LABELS[index],
      value,
    }));

    const count = monthlyCounts[currentMonthIndex] ?? 0;

    res.status(200).json({
      count,
      month: monthPrefix,
      pipelineIds: PIPELINE_IDS,
      byMonth,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Falha ao buscar dados do Pipedrive.", message: String(error) });
  }
}
