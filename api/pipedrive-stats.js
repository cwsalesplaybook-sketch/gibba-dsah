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

  try {
    const deals = [];
    let start = 0;
    const limit = 100;

    while (true) {
      const url = `https://api.pipedrive.com/v1/deals?status=won&pipeline_id=${PIPELINE_ID}&start=${start}&limit=${limit}&api_token=${token}`;
      const response = await fetch(url);
      const json = await response.json();

      if (!json.success) {
        res.status(502).json({ error: "Erro ao consultar o Pipedrive.", details: json.error ?? null });
        return;
      }

      deals.push(...(json.data ?? []));

      const pagination = json.additional_data?.pagination;
      if (!pagination?.more_items_in_collection) break;
      start = pagination.next_start;
    }

    const count = deals.filter((deal) => deal.won_time && deal.won_time.startsWith(monthPrefix)).length;

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
