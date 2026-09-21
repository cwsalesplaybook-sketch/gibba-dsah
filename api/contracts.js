// Vercel serverless function: controle diário da assinatura de contratos.
// Fonte: Pipedrive, funil "[REP] Funil de Reunião Agendada" (pipeline 75), etapa
// "Assinatura de Contrato" (id 425).
//  - Aguardando assinatura = negócios ABERTOS nessa etapa; a data de envio é quando o
//    negócio entrou nela (stage_change_time).
//  - Assinado = negócio que estava nessa etapa e foi marcado como GANHO, nos últimos
//    dias. Negócios ganhos direto de outras etapas (ex.: "Reunião Agendada") são só
//    cadastros e NÃO entram aqui.
// Só aparecem os negócios cuja responsável é a usuária configurada em OWNER_NAME.
// Não devolvemos telefone/e-mail: esta rota é aberta e não deve expor contatos.
const API = "https://api.pipedrive.com/v1";
const STAGE_CONTRATO = 425;
const SIGNED_WINDOW_DAYS = 7;
const OWNER_NAME = "Gabrielly Oliveira";

// O Pipedrive v1 devolve "2026-09-21 18:44:32" (UTC, sem fuso). Vira ISO com Z.
const toIso = (value) => (value ? `${String(value).replace(" ", "T")}Z` : null);

async function fetchDeals(params, token, shouldStop) {
  const deals = [];
  let start = 0;
  const maxPages = 20; // trava de segurança

  for (let page = 0; page < maxPages; page++) {
    const query = new URLSearchParams({
      ...params,
      start: String(start),
      limit: "100",
      api_token: token,
    });
    const response = await fetch(`${API}/deals?${query}`);
    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error ?? "Erro desconhecido do Pipedrive");
    }

    let stop = false;
    for (const deal of json.data ?? []) {
      if (shouldStop && shouldStop(deal)) {
        stop = true;
        break;
      }
      deals.push(deal);
    }
    if (stop) break;

    const pagination = json.additional_data?.pagination;
    if (!pagination?.more_items_in_collection) break;
    start = pagination.next_start;
  }

  return deals;
}

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();

const isMine = (row) => normalize(row.owner).includes(normalize(OWNER_NAME));

function toRow(deal) {
  return {
    id: deal.id,
    name: deal.person_name || deal.title,
    owner: deal.owner_name || deal.user_id?.name || null,
    sentAt: toIso(deal.stage_change_time),
    signedAt: toIso(deal.won_time),
  };
}

export default async function handler(req, res) {
  const token = process.env.PIPEDRIVE_API_TOKEN;

  if (!token) {
    res.status(500).json({ error: "PIPEDRIVE_API_TOKEN não configurado no projeto Vercel." });
    return;
  }

  const cutoff = new Date(Date.now() - SIGNED_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  try {
    const [pendingDeals, wonDeals] = await Promise.all([
      fetchDeals({ status: "open", stage_id: String(STAGE_CONTRATO) }, token),
      fetchDeals(
        { status: "won", stage_id: String(STAGE_CONTRATO), sort: "update_time DESC" },
        token,
        // ordenado por update_time desc: dá pra parar quando passar da janela
        (deal) => deal.update_time && new Date(toIso(deal.update_time)) < cutoff
      ),
    ]);

    const allPending = pendingDeals.map(toRow);
    const allSigned = wonDeals
      .filter((deal) => deal.won_time && new Date(toIso(deal.won_time)) >= cutoff)
      .map(toRow);

    const pending = allPending.filter(isMine).sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
    const signed = allSigned.filter(isMine).sort((a, b) => new Date(b.signedAt) - new Date(a.signedAt));

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json({
      stageId: STAGE_CONTRATO,
      windowDays: SIGNED_WINDOW_DAYS,
      owner: OWNER_NAME,
      // quantos contratos de outros responsáveis foram deixados de fora
      hidden: { pending: allPending.length - pending.length, signed: allSigned.length - signed.length },
      pending,
      signed,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Falha ao buscar contratos no Pipedrive.", message: String(error) });
  }
}
