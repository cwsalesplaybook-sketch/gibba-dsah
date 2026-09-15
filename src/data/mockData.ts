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

