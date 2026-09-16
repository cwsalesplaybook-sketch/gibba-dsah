export type TemplateCategory = "Direcionamento" | "Cadastro" | "Boas-vindas" | "Agendamento";

export type Template = {
  id: string;
  title: string;
  category: TemplateCategory;
  text: string;
};

export const templateCategories: TemplateCategory[] = [
  "Direcionamento",
  "Cadastro",
  "Boas-vindas",
  "Agendamento",
];

export const templates: Template[] = [
  {
    id: "direcionamento-afiliados",
    title: "Direcionamento para Afiliados",
    category: "Direcionamento",
    text: "Hoje contamos com um Programa de Afiliados voltado principalmente para consultores, gestores de tráfego, profissionais de marketing e outros profissionais que trabalham com indicação de soluções para empresas.\n\nVou te encaminhar para a pessoa responsável por esse setor, está bem?",
  },
  {
    id: "solicitacao-dados",
    title: "Solicitação de Dados Cadastrais",
    category: "Cadastro",
    text: "Vou precisar apenas de alguns dados para criar sua conta aqui no portal da Cardápio Web, certo?\n\nNome completo:\nTelefone:\nE-mail:\nCNPJ:\nChave pix:\nEndereço:\nCEP:\nInstagram:\n\nFico no aguardo do envio das informações. Obrigado!",
  },
  {
    id: "boas-vindas-programa",
    title: "Boas-vindas ao Programa",
    category: "Boas-vindas",
    text: "Seja muito bem-vindo ao Programa de Representantes Cardápio Web!\n\nFoi um prazer realizar essa reunião com você e dar início a essa parceria.\n\nAgradecemos pela confiança! Vamos juntos construir uma parceria estratégica e de muito sucesso.\n\nPróximo passo: a especialista Beatriz Andrade entrará em contato com você para explicar tudo sobre o programa e dar continuidade ao nosso processo.\n\nSeja muito bem-vindo ao time!",
  },
  {
    id: "acesso-portal",
    title: "Acesso ao Portal",
    category: "Boas-vindas",
    text: "Para começar, segue o acesso ao nosso portal:\n\nPortal: https://parceiro.cardapioweb.com/users/sign_in\nE-mail: xxxxxxxx\nSenha: xxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    id: "confirmacao-reuniao",
    title: "Confirmação de Reunião",
    category: "Agendamento",
    text: "Perfeito! Ficou agendado.\n\nSó pra eu me organizar por aqui: posso contar com você?\n\nA reunião é bem objetiva e vai ser o momento de você conhecer o sistema, entender como funciona a operação e tirar todas as suas dúvidas sobre o programa.",
  },
  {
    id: "perguntas-obrigatorias",
    title: "Perguntas Obrigatórias",
    category: "Agendamento",
    text: "Perguntas obrigatórias, nesta ordem.\n\nHá quanto tempo você atua com vendas B2B? Sempre nesse segmento ou migrou de outro?\n\nVocê já trabalha ou já trabalhou com clientes do ramo alimentício? Quantos você possui hoje?\n\nVocê opera sozinho ou tem equipe (SDR, closer, suporte)?\n\nVocê tem CNPJ ativo?\n\nQual sua cidade?\n\nQuanto tempo por semana você consegue dedicar à prospecção nos primeiros 60 dias?\n\nComo você conheceu a Cardápio Web e o programa de representantes? (anúncio, indicação, busca no Google, chat do site)\n\nO que te fez buscar o programa de representantes agora?",
  },
  {
    id: "perguntas-resumidas",
    title: "Perguntas Resumidas (versão curta)",
    category: "Agendamento",
    text: "Me conta um pouco mais sobre você: quanto tempo você já tem de operação na área, se você já trabalhou com clientes do ramo alimentício, se tem experiência com tecnologia ou vendas, e qual é a sua cidade.",
  },
];
