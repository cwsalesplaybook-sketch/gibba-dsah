// Vercel serverless function: conta representantes cadastrados no mês.
// Regra de negócio (confirmada com a Gabi): 1 representante cadastrado =
// 1 negócio marcado como "ganho" (won) no funil "[REP] Funil de Reunião
// Agendada" (pipeline_id 75) do Pipedrive, dentro do mês corrente.
const PIPELINE_ID = 75;

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
    const dealsThisMonth = [];
    let start = 0;
    const limit = 100;
    const maxPages = 10; // trava de segurança: no máximo 1000 negócios por consulta

    // Ordena por update_time desc e para assim que aparecer um negócio
    // atualizado antes do início do mês — evita paginar todo o histórico
    // "won" do funil (que pode ter anos) só pra filtrar em memória depois.
    outer: for (let page = 0; page < maxPages; page++) {
      const url =
        `https://api.pipedrive.com/v1/deals?status=won&pipeline_id=${PIPELINE_ID}` +
        `&sort=${encodeURIComponent("update_time DESC")}` +
        `&start=${start}&limit=${limit}&api_token=${token}`;
      const response = await fetch(url);
      const json = await response.json();

      if (!json.success) {
        res.status(502).json({ error: "Erro ao consultar o Pipedrive.", details: json.error ?? null });
        return;
      }

      const deals = json.data ?? [];
      for (const deal of deals) {
        if (deal.update_time && new Date(deal.update_time) < monthStart) break outer;
        if (deal.won_time && deal.won_time.startsWith(monthPrefix)) dealsThisMonth.push(deal);
      }

      const pagination = json.additional_data?.pagination;
      if (!pagination?.more_items_in_collection) break;
      start = pagination.next_start;
    }

    const count = dealsThisMonth.length;

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
