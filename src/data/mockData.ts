export const goal = {
  tiers: [
    { label: "Meta 1", target: 39 },
    { label: "Meta 2", target: 42 },
    { label: "Meta 3", target: 45 },
  ],
};

// ---- Página Metas ------------------------------------------------------

export const currentUser = {
  firstName: "Gabrielly",
  fullName: "Gabrielly Oliveira",
  role: "Channel Acquisition",
};

// Meta 1 (novos representantes) e Meta 3 (ativações) vêm do Pipedrive: 1 negócio
// ganho, em qualquer etapa, nos funis de captação de representante (pipelines 75 e
// 72), confirmado com a Gabi em 2026-09-22 ("é cadastro... conta quando dou ganho no
// funil de reunião agendada e no funil de no show"). Meta 2 ainda não tem fonte de
// dados automática, então fica editável à mão (lápis no card).
export const inicioMetaInfo = [
  { title: "Meta 1", subtitle: "Novos representantes", icon: "users" },
  { title: "Meta 2", subtitle: "Cadastros no sistema", icon: "calendar" },
  { title: "Meta 3", subtitle: "Ativações", icon: "target" },
] as const;

export const inicioSeed = {
  sistema: 8, // Meta 2, cadastros no sistema (só manual)
  ativacoes: 24, // legado: valor antigo do card, sem uso (Meta 3 agora vem do Pipedrive)
  ativacoesAjuste: 0, // Meta 3, ajuste manual (soma com a contagem do Pipedrive, igual a Meta 1)
  cadastrosMes: 17, // card "Cadastros no mês"
  cadastrosMesDelta: 8.2, // % vs. mês anterior desse card
};

// Meta mensal de cadastros (linha tracejada do gráfico) de jan a ago, o mês
// atual e os seguintes usam a Meta 1 configurada no card.
export const monthlyGoals = [14, 18, 23, 27, 32, 29, 35, 42];
