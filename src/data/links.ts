export type ImportantLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: "portal" | "pipedrive" | "planilha" | "form" | "playbook";
};

export const importantLinks: ImportantLink[] = [
  {
    id: "portal",
    title: "Portal do representante",
    description: "Login em parceiro.cardapioweb.com",
    url: "https://parceiro.cardapioweb.com/users/sign_in",
    icon: "portal",
  },
  {
    id: "pipedrive",
    title: "Pipedrive",
    description: "Funil de Prospecção de Representantes, visão de todo o time",
    url: "https://cardapioweb.pipedrive.com/pipeline/60/user/everyone?quickFilter=none",
    icon: "pipedrive",
  },
  {
    id: "planilha-acompanhamento",
    title: "Planilha de acompanhamento",
    description: "Acompanhamento diário do time (Google Sheets)",
    url: "https://docs.google.com/spreadsheets/d/1pzea8Dyp85JGXknbVfBYI6-FYimdbhHJbtzrm57TwOk/edit?usp=sharing",
    icon: "planilha",
  },
  {
    id: "form-parceiro",
    title: "Formulário de adição de parceiro",
    description: "Cadastro manual de parceiro",
    url: "https://interno.cardapioweb.com/adicao-manual-de-parceiros/",
    icon: "form",
  },
  {
    id: "form-representante",
    title: "Formulário de adição de representante",
    description: "Cadastro manual de representante",
    url: "https://interno.cardapioweb.com/adicao-manual-de-representantes/",
    icon: "form",
  },
  {
    id: "playbook-representante",
    title: "Playbook de representante",
    description: "Planilha completa (Google Sheets)",
    url: "https://docs.google.com/spreadsheets/d/1HB4YTjzjmF0sOPFc410ZgowKmYN_2zi8boszxqe1uS8/edit?gid=46957881#gid=46957881",
    icon: "playbook",
  },
];
