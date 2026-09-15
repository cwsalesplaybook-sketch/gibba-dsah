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

export const registrationsByMonth = [
  { month: "Jan", value: 42 },
  { month: "Fev", value: 55 },
  { month: "Mar", value: 62 },
  { month: "Abr", value: 58 },
  { month: "Mai", value: 72 },
  { month: "Jun", value: 68 },
  { month: "Jul", value: 75 },
  { month: "Ago", value: 94 },
  { month: "Set", value: 87 },
];

export const targetLine = 87;

export const funnel = [
  { label: "Inscrições recebidas", value: 412, percent: 100, highlight: false },
  { label: "Entrevistas realizadas", value: 196, percent: 48, highlight: false },
  { label: "Representantes cadastrados", value: 87, percent: 44, highlight: true },
];

