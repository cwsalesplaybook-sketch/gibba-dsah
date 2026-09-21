export const goal = {
  tiers: [
    { label: "Meta 1", target: 39 },
    { label: "Meta 2", target: 42 },
    { label: "Meta 3", target: 45 },
  ],
};

export type Metric = {
  label: string;
  value: string;
  changeLabel: string | null;
  changeSub: string;
  icon: "users" | "trending" | "activity";
};

export const metrics: Metric[] = [
  {
    label: "Representantes cadastrados",
    value: "87",
    changeLabel: "12.4%",
    changeSub: "total na base",
    icon: "users",
  },
  {
    label: "Cadastros no mês",
    value: "33",
    changeLabel: "9.2%",
    changeSub: "4 hoje",
    icon: "trending",
  },
  {
    label: "Média diária",
    value: "3,2",
    changeLabel: null,
    changeSub: "cadastros por dia no mês",
    icon: "activity",
  },
];

// ---- Página Início ----------------------------------------------------

export const currentUser = {
  firstName: "Gabrielly",
  fullName: "Gabrielly Oliveira",
  role: "Channel Acquisition",
};

// Só a Meta 1 (novos representantes) vem do Pipedrive. As outras duas não
// têm fonte de dados ainda, então ficam editáveis à mão (lápis no card),
// começando pelos valores do layout de referência.
export const inicioMetaInfo = [
  { title: "Meta 1", subtitle: "Novos representantes", icon: "users" },
  { title: "Meta 2", subtitle: "Cadastros no sistema", icon: "calendar" },
  { title: "Meta 3", subtitle: "Ativações", icon: "target" },
] as const;

export const inicioSeed = {
  sistema: 8, // Meta 2 — cadastros no sistema
  ativacoes: 24, // Meta 3 — ativações
  cadastrosMes: 17, // card "Cadastros no mês"
  cadastrosMesDelta: 8.2, // % vs. mês anterior desse card
};

// Meta mensal de cadastros (linha tracejada do gráfico) de jan a ago — o mês
// atual e os seguintes usam a Meta 1 configurada no card.
export const monthlyGoals = [14, 18, 23, 27, 32, 29, 35, 42];
