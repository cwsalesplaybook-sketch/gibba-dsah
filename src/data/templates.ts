export type TemplateCategory = "Follow-up" | "Pagamento" | "Cobrança";

export type Template = {
  id: string;
  title: string;
  category: TemplateCategory;
  text: string;
};

export const templateCategories: TemplateCategory[] = ["Follow-up", "Pagamento", "Cobrança"];

export const templates: Template[] = [
  {
    id: "followup-padrao",
    title: "Follow-up Padrão",
    category: "Follow-up",
    text: "Olá! Tudo bem? Estou passando para saber se conseguiu analisar nossa proposta. Fico à disposição para esclarecer qualquer dúvida!",
  },
  {
    id: "followup-quente",
    title: "Follow-up Quente",
    category: "Follow-up",
    text: "Ei! Vi que você demonstrou bastante interesse. Que tal agendarmos uma call rápida para fecharmos?",
  },
  {
    id: "ultima-tentativa",
    title: "Última Tentativa",
    category: "Follow-up",
    text: "Olá! Essa é minha última tentativa de contato. Caso não tenha interesse, tudo bem! Mas se quiser aproveitar as condições especiais, me avise hoje.",
  },
  {
    id: "link-pagamento",
    title: "Link de Pagamento",
    category: "Pagamento",
    text: "Aqui está o link para finalizar sua assinatura: [LINK]. Qualquer dúvida, estou por aqui!",
  },
  {
    id: "cobranca-link-enviado",
    title: "Cobrança Link Enviado",
    category: "Cobrança",
    text: "Oi! Vi que o link ainda está pendente. Posso ajudar com algo? O pagamento está travando em algum ponto?",
  },
  {
    id: "cobranca-escassez",
    title: "Cobrança com Escassez",
    category: "Cobrança",
    text: "Última chamada! O desconto especial expira hoje às 23:59. Depois disso, só conseguiremos o valor cheio. Posso garantir pra você?",
  },
];
