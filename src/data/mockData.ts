export const goal = {
  current: 87,
  target: 120,
  percent: 73,
  remaining: 33,
  daysLeft: 15,
  paceNeeded: 3,
  today: 4,
  week: 19,
  dailyAverage: 3.2,
};

export const metrics = [
  {
    label: "Representantes cadastrados",
    value: "87",
    changeLabel: "12.4%",
    changeSub: "total na base",
    icon: "users" as const,
  },
  {
    label: "Cadastros no mês",
    value: "33",
    changeLabel: "9.2%",
    changeSub: "4 hoje",
    icon: "trending" as const,
  },
  {
    label: "Média diária",
    value: "3,2",
    changeLabel: null,
    changeSub: "cadastros por dia no mês",
    icon: "activity" as const,
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

export const representatives = [
  { name: "Marina Alves", region: "São Paulo - SP", channel: "Indicação", date: "12/09/2026" },
  { name: "Rafael Lima", region: "Recife - PE", channel: "Instagram", date: "10/09/2026" },
  { name: "Camila Souza", region: "Curitiba - PR", channel: "Eventos", date: "08/09/2026" },
  { name: "Diego Martins", region: "Belo Horizonte - MG", channel: "Site / Landing", date: "05/09/2026" },
  { name: "Juliana Prado", region: "Fortaleza - CE", channel: "Indicação", date: "03/09/2026" },
  { name: "Pedro Nogueira", region: "Porto Alegre - RS", channel: "Outbound", date: "28/08/2026" },
  { name: "Larissa Rocha", region: "Salvador - BA", channel: "Instagram", date: "25/08/2026" },
];

export const channelAcquisition = [
  { channel: "Indicação", value: 13, colorVar: "--chart-1" },
  { channel: "Instagram", value: 10, colorVar: "--chart-2" },
  { channel: "Eventos", value: 5, colorVar: "--chart-3" },
  { channel: "Site / Landing", value: 3, colorVar: "--chart-4" },
  { channel: "Outbound", value: 2, colorVar: "--chart-5" },
];
