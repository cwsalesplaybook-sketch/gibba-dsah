export type PlaybookBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { label: string; text: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type PlaybookSection = {
  id: string;
  title: string;
  summary: string;
  blocks: PlaybookBlock[];
};

export const playbookSections: PlaybookSection[] = [
  {
    id: "scripts-prospeccao",
    title: "Scripts de Prospecção",
    summary: "Roteiros de abordagem por ligação e WhatsApp (BANT e AIDA).",
    blocks: [
      {
        type: "subheading",
        text: "Ligação / Vídeo chamada, BANT adaptado",
      },
      {
        type: "steps",
        items: [
          { label: "Abertura", text: "Olá, NOME_DO_LEAD! Tudo certo? Aqui é o Hyorranes da Cardápio Web. Vi que você preencheu o formulário e demonstrou interesse em conhecer melhor o programa de representantes." },
          { label: "Contexto", text: "Estou entrando em contato pra entender melhor seu perfil e te explicar como funciona o modelo. Antes de começarmos, me conta, como você conheceu a Cardápio Web?" },
          { label: "Rapport", text: "Que bom que você chegou até aqui! Minha missão aqui é te ajudar a entender tudo antes da gente seguir." },
          { label: "Need", text: "Hoje você já tem uma carteira de clientes do ramo alimentício?" },
          { label: "Pergunta 1 (motivação)", text: "Entendi. E o que te fez buscar essa oportunidade como representante agora?" },
          { label: "Pergunta 2 (situacional)", text: "Hoje você tem disponibilidade pra trabalhar com a Cardápio Web no seu portfólio?" },
          { label: "Apresentação do programa", text: "Deixa eu te explicar como funciona o programa. Você entra como representante e prospecta donos de restaurante, bar ou delivery pra vender a Cardápio Web. Pra isso, você tem um sistema próprio com CRM, mapa de oportunidades por região e calculadora de proposta com link de pagamento automático. A comissão é recorrente. Além disso, você conta com um onboarding estruturado, acompanhado pelos especialistas da Cardápio Web. Isso atende o que você procura?" },
          { label: "Verificar dúvida", text: "Antes de seguirmos, ficou alguma dúvida até aqui?" },
          { label: "Budget (disponibilidade)", text: "Me conta, você consegue dedicar tempo pra prospecção ativa nas próximas semanas?" },
          { label: "Timing", text: "De 0 a 10, qual seu nível de prioridade pra começar como representante nesse momento?" },
          { label: "Introduzir agendamento", text: "Perfeito! Pra você entender tudo isso na prática e já sair sabendo como funciona o dia a dia, o próximo passo é marcarmos uma vídeo chamada pelo Google Meet. Nela, te explico o sistema, a comissão e tiro todas as suas dúvidas ao vivo." },
          { label: "Marcando a reunião", text: "Você tem mais disponibilidade pela manhã ou pela tarde? Perfeito, que tal às X horas no horário de Brasília?" },
          { label: "1º Gatilho de compromisso", text: "Combinado, NOME_DO_LEAD! Nossa reunião está marcada pra DIA E HORA no horário de Brasília. Posso contar com seu compromisso nessa vídeo chamada?" },
          { label: "2º Gatilho de compromisso", text: "Perfeito, sei que imprevistos acontecem. Se algo te impedir de participar, você consegue me avisar com antecedência pra eu reorganizar a agenda?" },
          { label: "Agradecimento", text: "NOME_DO_LEAD, muito obrigada pela sua disponibilidade, foi um prazer falar com você! Fico na torcida aqui pra que dê tudo certo, e no que precisar, é só me chamar por aqui também." },
        ],
      },
      { type: "subheading", text: "WhatsApp, mensagem de abertura automática (BANT)" },
      {
        type: "paragraph",
        text: "A abertura é automática; a partir da resposta do lead, as mensagens seguintes são enviadas manualmente.",
      },
      {
        type: "steps",
        items: [
          { label: "[Automático] Abertura", text: "Olá, NOME_DO_LEAD! Tudo certo? Aqui é o Hyorranes da Cardápio Web. Vi que você preencheu o formulário e demonstrou interesse em conhecer melhor o programa de representantes. Me conta: você hoje já atua com vendas, atendimento ao setor de restaurantes ou possui alguma carteira de clientes?" },
          { label: "Contexto", text: "Show, NOME_DO_LEAD! Antes da gente seguir, me conta, como você conheceu a Cardápio Web?" },
          { label: "Need", text: "Hoje você já tem uma carteira de clientes do ramo alimentício?" },
          { label: "Pergunta 1 (motivação)", text: "Entendi. E o que te fez buscar essa oportunidade como representante agora?" },
          { label: "Pergunta 2 (situacional)", text: "Hoje você tem disponibilidade pra trabalhar com a Cardápio Web no seu portfólio?" },
          { label: "Apresentação do programa", text: "Deixa eu te explicar como funciona o programa. Você entra como representante e prospecta donos de restaurante, bar ou delivery pra vender a Cardápio Web. Pra isso, você tem um sistema próprio com CRM, mapa de oportunidades por região e calculadora de proposta com link de pagamento automático. A comissão é recorrente. Além disso, você conta com um onboarding estruturado, acompanhado pelos especialistas da Cardápio Web. Isso atende o que você procura?" },
          { label: "Verificar dúvida", text: "Antes de seguirmos, ficou alguma dúvida até aqui?" },
          { label: "Budget (disponibilidade)", text: "Me conta, você consegue dedicar tempo pra prospecção ativa nas próximas semanas?" },
          { label: "Timing", text: "De 0 a 10, qual seu nível de prioridade pra começar como representante nesse momento?" },
          { label: "Introduzir agendamento", text: "Perfeito! Pra você entender tudo isso na prática e já sair sabendo como funciona o dia a dia, o próximo passo é marcarmos uma vídeo chamada pelo Google Meet. Nela, te explico o sistema, a comissão e tiro todas as suas dúvidas ao vivo." },
          { label: "Marcando a reunião", text: "Você tem mais disponibilidade pela manhã ou pela tarde? Perfeito, que tal às X horas no horário de Brasília?" },
          { label: "1º Gatilho de compromisso", text: "Combinado, NOME_DO_LEAD! Nossa reunião está marcada pra DIA E HORA no horário de Brasília. Posso contar com seu compromisso nessa vídeo chamada?" },
          { label: "2º Gatilho de compromisso", text: "Perfeito, sei que imprevistos acontecem. Se algo te impedir de participar, você consegue me avisar com antecedência pra eu reorganizar a agenda?" },
          { label: "Agradecimento", text: "NOME_DO_LEAD, muito obrigada pela sua disponibilidade, foi um prazer falar com você! Fico na torcida aqui pra que dê tudo certo, e no que precisar, é só me chamar por aqui também." },
        ],
      },
      { type: "subheading", text: "WhatsApp, Prospecção (AIDA)" },
      {
        type: "steps",
        items: [
          { label: "[Automático] Atenção", text: "Olá, NOME_DO_LEAD! Tudo certo? Aqui é o Hyorranes da Cardápio Web. Vi que você preencheu o formulário e demonstrou interesse em conhecer melhor o programa de representantes. Me conta: você hoje já atua com vendas, atendimento ao setor de restaurantes ou possui alguma carteira de clientes?" },
          { label: "Interesse", text: "Hoje você já tem uma carteira de clientes do ramo alimentício? Hoje você tem disponibilidade pra trabalhar com a Cardápio Web no seu portfólio?" },
          { label: "Desejo", text: "Deixa eu te explicar como funciona o programa. Você entra como representante e prospecta donos de restaurante, bar ou delivery pra vender a Cardápio Web. Pra isso, você tem um sistema próprio com CRM, mapa de oportunidades por região e calculadora de proposta com link de pagamento automático. A comissão é recorrente. Além disso, você conta com um onboarding estruturado, acompanhado pelos especialistas da Cardápio Web. Isso atende o que você procura?" },
          { label: "Ação", text: "Perfeito! Pra você entender tudo isso na prática e já sair sabendo como funciona o dia a dia, o próximo passo é marcarmos uma vídeo chamada pelo Google Meet. Você tem mais disponibilidade pela manhã ou pela tarde? Combinado, NOME_DO_LEAD! Nossa reunião está marcada pra DIA E HORA no horário de Brasília. Posso contar com seu compromisso nessa vídeo chamada? Perfeito, sei que imprevistos acontecem. Se algo te impedir de participar, você consegue me avisar com antecedência pra eu reorganizar a agenda? Muito obrigada pela sua disponibilidade, foi um prazer falar com você!" },
        ],
      },
      { type: "subheading", text: "Ligação (AIDA)" },
      {
        type: "steps",
        items: [
          { label: "Atenção", text: "Olá, Carlos! Tudo certo? Aqui é o Hyorranes da Cardápio Web. Vi que você preencheu o formulário e demonstrou interesse em conhecer melhor o programa de representantes, tá lembrado? Você tá com um minutinho pra gente conversar?" },
          { label: "Interesse", text: "Show de bola! Antes da gente seguir, me conta, como você conheceu a Cardápio Web? Perfeito. E hoje você já tem uma carteira de clientes do ramo alimentício?" },
          { label: "Desejo", text: "Deixa eu te explicar como funciona o programa. Você entra como representante e prospecta donos de restaurante, bar ou delivery pra vender a Cardápio Web. Pra isso, você tem um sistema próprio com CRM, mapa de oportunidades por região e calculadora de proposta com link de pagamento automático. A comissão é recorrente. Além disso, você conta com um onboarding estruturado, acompanhado pelos especialistas da Cardápio Web. Isso atende o que você procura?" },
          { label: "Ação, Agendamento", text: "Você tem mais disponibilidade pela manhã ou pela tarde? Perfeito, que tal às X horas no horário de Brasília?" },
          { label: "Gatilho de compromisso", text: "Combinado, Carlos! Nossa reunião está marcada pra DIA E HORA no horário de Brasília. Posso contar com seu compromisso nessa vídeo chamada? Perfeito, sei que imprevistos acontecem. Se algo te impedir de participar, você consegue me avisar com antecedência pra eu reorganizar a agenda?" },
          { label: "Agradecimento", text: "Carlos, muito obrigada pela sua disponibilidade, foi um prazer falar com você! Fico na torcida aqui pra que dê tudo certo, e no que precisar, é só me chamar por aqui também." },
        ],
      },
    ],
  },
  {
    id: "cw-store",
    title: "CW Store",
    summary: "Marketplace de apps integrado ao portal, como funciona e como vender.",
    blocks: [
      {
        type: "paragraph",
        text: "A CW Store (CW App Store) é o marketplace de aplicativos integrado ao portal da Cardápio Web. Restaurantes descobrem, instalam e gerenciam soluções de parceiros direto no sistema que já usam, sem configuração técnica manual. Para integradoras e desenvolvedores, é o canal oficial de distribuição de soluções de food service: gestão, marketing, fidelidade, módulo fiscal, atendimento, logística, automação, IA, delivery e outras experiências digitais.",
      },
      {
        type: "paragraph",
        text: "A CW Store conecta três pontas: o restaurante que precisa de soluções prontas, a integradora que constrói essas soluções, e a Cardápio Web, que fornece a infraestrutura (marketplace, autenticação e API) pra essa relação acontecer de forma padronizada e segura.",
      },
      { type: "subheading", text: "Como funciona (visão técnica)" },
      {
        type: "list",
        items: [
          "CW App Store (o marketplace): ponto de entrada para o estabelecimento, onde o restaurante descobre, instala e gerencia os apps parceiros, sem suporte técnico ou configuração manual.",
          "OAuth (a autorização): momento em que o Proprietário do estabelecimento concede as permissões que o app poderá usar, de forma parecida com um login social, dentro do próprio portal.",
          "API aberta (a integração de fato): por onde o app lê e escreve dados reais do estabelecimento (cardápio, pedidos, configurações de loja), depois que a instalação foi autorizada e o token foi emitido.",
        ],
      },
      { type: "subheading", text: "O fluxo completo, passo a passo" },
      {
        type: "list",
        items: [
          "Cadastro do app: a integradora envia ao suporte as informações do app (nome, categoria, descrição, imagens, URLs técnicas e permissões necessárias).",
          "Aprovação: análise em Sandbox e depois em Produção, pode levar até 7 dias corridos.",
          "Publicação: app disponível no marketplace, podendo ser público (catálogo) ou privado (link direto).",
          "Instalação: o Proprietário encontra o app na CW Store e clica em instalar.",
          "Autorização (OAuth): o Proprietário escolhe a loja e confirma as permissões solicitadas.",
          "Emissão de tokens: o app recebe credenciais vinculadas àquela instalação (app + loja).",
          "Uso da API: o app consulta e atualiza dados da loja, catálogo e pedidos, dentro do autorizado.",
          "Eventos em tempo real (opcional): notificações automáticas a cada novo pedido ou mudança de status.",
        ],
      },
      { type: "subheading", text: "Os três módulos da API" },
      {
        type: "list",
        items: [
          "Loja: dados do estabelecimento, horários, formas de pagamento e configurações gerais.",
          "Catálogo: categorias, produtos, complementos e estrutura do cardápio.",
          "Pedidos: consulta, criação, atualização de status e histórico.",
        ],
      },
      {
        type: "paragraph",
        text: "A Cardápio Web mantém dois ambientes isolados, Sandbox (testes) e Produção (uso real), cada um com seu próprio cadastro, credenciais e instalações. Cada loja que instala um app gera uma instalação própria com tokens específicos; se o restaurante desinstalar, o acesso daquela loja é revogado na hora, sem afetar outras lojas ou apps. Reinstalar repete o fluxo de autorização do zero.",
      },
      { type: "subheading", text: "Valor para o restaurante" },
      {
        type: "list",
        items: [
          "Expande o que o restaurante consegue fazer (marketing, fidelidade, gestão, logística, IA) sem contratar desenvolvimento próprio.",
          "Instalação simples, em poucos cliques, no sistema que já usa.",
          "O dono decide quais permissões conceder e pode revogar o acesso a qualquer momento.",
        ],
      },
      { type: "subheading", text: "Valor para a integradora e o parceiro comercial" },
      {
        type: "list",
        items: [
          "Acesso direto a uma base de restaurantes que já usa a Cardápio Web, reduzindo o esforço de prospecção.",
          "Fluxo de instalação e autorização padronizado, acelerando o fechamento comercial.",
          "Apps públicos ganham vitrine própria no marketplace, funcionando como gerador de leads.",
          "Apps privados atendem clientes ou contratos específicos, sem expor a solução no catálogo público.",
          "Organização por categorias (Marketing, Vendas, Gestão, Logística) ajuda a posicionar cada solução.",
        ],
      },
      { type: "subheading", text: "Argumentos de venda sugeridos" },
      {
        type: "list",
        items: [
          "Fazer parte de um ecossistema já validado por restaurantes, em vez de vender uma integração isolada.",
          "Redução do tempo de implementação comparado a integrações manuais ou personalizadas.",
          "Quanto mais parceiros no ecossistema, mais valor agregado pra todos os restaurantes, um argumento de crescimento conjunto.",
        ],
      },
      { type: "subheading", text: "Pontos de atenção para o time comercial" },
      {
        type: "list",
        items: [
          "A aprovação de um novo app pode levar até 7 dias corridos, alinhar esse prazo com clientes e parceiros.",
          "Permissões solicitadas no cadastro não podem ser removidas depois; adicionar novas exige que clientes já instalados reinstalem o app.",
          "Dúvidas técnicas ou comerciais: integracao@cardapioweb.com.",
        ],
      },
      {
        type: "paragraph",
        text: "Documentação oficial: docs.cardapioweb.com · Contato: integracao@cardapioweb.com",
      },
    ],
  },
  {
    id: "cw-club",
    title: "CW Club",
    summary: "Programa de parcerias para agências e gestores de tráfego, o que aproveitar no programa de representantes.",
    blocks: [
      {
        type: "paragraph",
        text: "O CW Club é o programa de parcerias da Cardápio Web voltado para agências de marketing, consultorias e gestores de tráfego do setor de food service. Funciona como um ecossistema colaborativo de crescimento estratégico, com comunidade, conteúdo e suporte contínuo.",
      },
      { type: "subheading", text: "Pilares do programa" },
      {
        type: "list",
        items: [
          "Comunidades temáticas para troca de experiências entre parceiros",
          "Biblioteca de materiais com e-books, templates e guias",
          "Mentorias e treinamentos especializados",
          "Suporte especializado com canal de feedback",
          "Atualizações e novidades do setor",
        ],
      },
      { type: "subheading", text: "Pontos que podem ser aproveitados no Programa de Representantes" },
      {
        type: "list",
        items: [
          "Criar uma comunidade entre representantes, hoje existem só mentorias semanais e central de ajuda, sem espaço de troca entre pares.",
          "Expandir a documentação atual (central de ajuda e matriz de concorrentes) pra uma biblioteca mais completa, com templates de propostas e roteiros de abordagem.",
          "Implementar um canal formal de novidades do setor e lançamentos de funcionalidades.",
          "Criar um canal de feedback ativo pra representantes sugerirem melhorias no programa.",
        ],
      },
      { type: "subheading", text: "Pontos que precisam ser adaptados" },
      {
        type: "list",
        items: [
          "Público diferente: o CW Club fala com agências/consultorias; os representantes prospectam donos de restaurante direto, o conteúdo precisa mudar de branding/tráfego pago pra prospecção, fechamento e retenção.",
          "O CW Club não tem modelo de comissão; o programa de representantes é estruturado em comissionamento recorrente, networking e autoridade de marca só complementam, não substituem o incentivo financeiro.",
          "Formato de entrega muda: CW Club é conteúdo assíncrono; representantes usam ferramentas ativas (CRM próprio, calculadora de propostas), qualquer nova biblioteca precisa se integrar a essas ferramentas.",
        ],
      },
    ],
  },
  {
    id: "tipos-onboarding",
    title: "Tipos de Onboarding",
    summary: "As 6 fases progressivas do onboarding de um novo representante.",
    blocks: [
      {
        type: "paragraph",
        text: "O onboarding do representante é o processo pelo qual uma pessoa recém-chegada ao programa se torna apta a prospectar, vender e acompanhar clientes com autonomia. Pode ser organizado em fases progressivas:",
      },
      {
        type: "steps",
        items: [
          { label: "1. Boas-vindas e imersão institucional (dias 1-2)", text: "Apresentação da Cardápio Web (propósito, números, planos e módulos) e do papel do representante, modelo autônomo, sem vínculo empregatício, expectativas e ferramentas disponíveis." },
          { label: "2. Domínio do produto e do comissionamento (dias 3-5)", text: "Treinamento sobre os planos comercializados (Mesas, Delivery, Premium) e módulos opcionais, explicação do modelo de comissão (base de 10% recorrente, adicionais por implementação e suporte, bônus de performance por churn baixo, teto de 40%) e apresentação do CRM próprio." },
          { label: "3. Capacitação comercial e de prospecção (dias 6-8)", text: "Técnicas de prospecção de donos de restaurantes, bares e deliveries, simulações de pitch e tratamento de objeções, e conhecimento das integrações oferecidas (iFood, 99Food, Forkit e Quase Pra Fome)." },
          { label: "4. Acompanhamento prático / shadowing (dias 9-12)", text: "O novo representante acompanha um representante experiente em reuniões reais de prospecção e observa de perto um onboarding assistido ou híbrido com um cliente real." },
          { label: "5. Primeira venda supervisionada (dias 13-15)", text: "O novo representante conduz sua primeira prospecção e venda com apoio de um mentor, seguida de feedback estruturado sobre pontos fortes e a melhorar." },
          { label: "6. Autonomia e acompanhamento contínuo (a partir do dia 16)", text: "O representante passa a atuar de forma independente, com check-ins semanais no primeiro mês e mensais depois, acompanhando performance de vendas e churn da carteira." },
        ],
      },
    ],
  },
  {
    id: "gestao-canais-parcerias",
    title: "Gestão de Canais e Parcerias",
    summary: "KPIs, MDF/co-marketing e por que usar um PRM em vez de planilha.",
    blocks: [
      {
        type: "paragraph",
        text: "Resumo rápido pra acompanhar parceiros com dado, não achismo, baseado em boas práticas de gestão de canais e KPIs de mercado.",
      },
      { type: "subheading", text: "Por que métricas importam" },
      {
        type: "list",
        items: [
          "Decisão com dado é mais rápida que decisão no achismo.",
          "Métrica clara mostra onde o canal trava.",
          "Sem número, não dá pra saber o que realmente funciona.",
        ],
      },
      { type: "subheading", text: "Ciclo de vida do parceiro" },
      {
        type: "list",
        items: [
          "Prospecção: achar o parceiro certo.",
          "Onboarding: treinar rápido, com trilha clara.",
          "Registro de oportunidades: parceiro cadastra o lead, evita conflito.",
          "Pipeline: acompanhar a venda junto com o parceiro.",
          "Engajamento: treinar, incentivar, manter o parceiro ativo.",
          "Mensuração: KPI e dashboard sempre visíveis.",
          "Retenção: cuidar da saúde do parceiro pra não perder ele.",
        ],
      },
      { type: "subheading", text: "KPIs, Ativação e engajamento" },
      {
        type: "list",
        items: [
          "Tempo médio de onboarding",
          "% do canal treinado",
          "Acesso ao portal do parceiro",
          "Consumo de treinamentos",
          "Ações de co-marketing feitas",
        ],
      },
      { type: "subheading", text: "KPIs, Performance comercial" },
      {
        type: "list",
        items: [
          "Leads indicados pelo parceiro",
          "Taxa de conversão por etapa",
          "Volume total de vendas",
          "Ticket médio",
          "Ciclo de vendas no canal",
        ],
      },
      { type: "subheading", text: "KPIs, Financeiro e retenção" },
      {
        type: "list",
        items: [
          "Receita recorrente gerada",
          "Comissões pagas",
          "Margem por canal",
          "Churn dos clientes do parceiro",
          "CLV (valor do cliente) por canal",
        ],
      },
      { type: "subheading", text: "MDF e co-marketing" },
      {
        type: "list",
        items: [
          "MDF é a verba pro parceiro fazer marketing: evento, campanha, conteúdo.",
          "Definir objetivo claro antes de liberar a verba.",
          "Vincular o MDF a um KPI do programa.",
          "Cobrar prestação de contas depois da ação.",
        ],
      },
      { type: "subheading", text: "Por que usar PRM (não só CRM ou planilha)" },
      {
        type: "list",
        items: [
          "CRM tradicional não foi feito pra múltiplos parceiros.",
          "PRM junta portal, comissão, treinamento e dashboard num só lugar.",
          "Dá pra ver o dado em tempo real, sem planilha manual.",
        ],
      },
      { type: "subheading", text: "Checklist pra desenvolver senso analítico" },
      {
        type: "list",
        items: [
          "Escolher de 3 a 5 KPIs fixos, não mais que isso.",
          "Olhar o dashboard toda semana, no mesmo dia e hora.",
          "Comparar o número com o mês anterior, não olhar isolado.",
          "Anotar 1 ação a tomar com base no dado.",
          "Revisar os KPIs a cada trimestre.",
        ],
      },
    ],
  },
  {
    id: "programa-representantes",
    title: "O que é o Programa de Representantes",
    summary: "Comissão, planos, ferramentas e projeções financeiras do programa.",
    blocks: [
      {
        type: "paragraph",
        text: "Resumo elaborado a partir da reunião de apresentação do modelo de representantes, com foco em vendas autônomas e comissionamento recorrente.",
      },
      { type: "subheading", text: "Sobre a Cardápio Web" },
      {
        type: "list",
        items: [
          "Atende mais de 17 mil clientes em todo o Brasil",
          "Processa mais de R$800 milhões mensais em pedidos",
          "Integra com iFood, 99Food, Forkit e Quase Pra Fome",
          "Oferece solução 360 com gestão, vendas e delivery integrados",
          "Tem propósito de ser internacional até 2040",
        ],
      },
      { type: "subheading", text: "O que faz um representante" },
      {
        type: "list",
        items: [
          "Prospecta donos de restaurantes, bares e deliveries para apresentar a Cardápio Web",
          "Realiza vendas autônomas, sem vínculo empregatício",
          "Acompanha a implementação e o suporte inicial do cliente quando aplicável",
          "Utiliza sistema próprio de CRM para gerir leads e oportunidades",
        ],
      },
      { type: "subheading", text: "Modelo de comissão" },
      {
        type: "list",
        items: [
          "Comissão base de 10% recorrente sobre as vendas realizadas",
          "Mais 10% ao assumir a implementação do cliente",
          "Mais 10% ao assumir o suporte do cliente",
          "Mais 10% de bônus de performance ao atingir 50 clientes com churn menor que 8%",
          "Comissão recorrente máxima de até 40%",
          "Pagamento mensal, todo dia 15, enquanto o cliente permanecer ativo",
        ],
      },
      { type: "subheading", text: "Planos e módulos comercializados" },
      {
        type: "list",
        items: [
          "Plano Mesas: a partir de R$169,99, para operações presenciais",
          "Plano Delivery: R$209,99, para dark kitchens e delivery",
          "Plano Premium: a partir de R$269,99, para operações híbridas",
          "Seis módulos opcionais, incluindo marketplace e estoque avançado",
          "Módulo fiscal: R$69,99, com taxa adicional acima de 2.500 notas",
        ],
      },
      { type: "subheading", text: "Ferramentas do representante" },
      {
        type: "list",
        items: [
          "Sistema exclusivo com CRM integrado",
          "Mapa de oportunidades mostrando estabelecimentos por zona geográfica",
          "Cadastro de leads manual ou via base de dados",
          "Marcação de status do lead: visitado, contatado ou cancelado",
          "Calculadora de proposta com geração automática de link de pagamento",
          "Visualização de fatura e comissão de todos os clientes",
        ],
      },
      { type: "subheading", text: "Capacitação e suporte" },
      {
        type: "list",
        items: [
          "Mentorias semanais toda segunda-feira às 20h",
          "Conteúdo sobre vendas, implementação, suporte e empreendedorismo",
          "Parte dos encontros gravados, outros exclusivos para participantes",
          "Central de ajuda com documentação completa sobre a Cardápio Web",
          "Matriz de concorrentes com os diferenciais frente à concorrência",
        ],
      },
      { type: "subheading", text: "Projeções financeiras" },
      {
        type: "list",
        items: [
          "Com 10 vendas mensais, ganho estimado de R$123.740 no primeiro ano",
          "Em 2 anos, ganho acumulado estimado de aproximadamente R$500 mil",
          "Após 1 ano: cerca de 107 clientes ativos, gerando R$18.188,29 mensais",
          "Após 2 anos: cerca de 192 clientes ativos, gerando R$32.636,93 mensais",
        ],
      },
      { type: "subheading", text: "Oportunidade de mercado" },
      {
        type: "list",
        items: [
          "Crescimento do delivery impulsionado pela pandemia e por apps como o iFood",
          "Estabelecimentos precisam de estratégia presencial e delivery simultâneas",
          "Digitalização dos restaurantes aumentou a demanda por soluções completas",
          "Sistema modular permite ao cliente escolher as funcionalidades que precisa",
        ],
      },
    ],
  },
  {
    id: "podcast-partner-cast",
    title: "Podcast Partner Cast",
    summary: "Episódios do podcast sobre o ecossistema de parceiros.",
    blocks: [
      {
        type: "list",
        items: ["Ep. 01, O desafio da IA que está transformando os ecossistemas"],
      },
    ],
  },
  {
    id: "modelo-canais",
    title: "Modelo de Canais",
    summary: "Os 6 modelos de canais mais comuns e onde o representante se encaixa.",
    blocks: [
      {
        type: "paragraph",
        text: "Resumo do conteúdo da Plural Sales sobre modelos de parceria, adaptado para situar onde o Programa de Representantes Cardápio Web se encaixa hoje e quais caminhos de evolução existem.",
      },
      { type: "subheading", text: "Os 6 modelos de canais mais comuns" },
      {
        type: "steps",
        items: [
          { label: "1. Finder / Afiliado", text: "O que faz: indica ou promove o produto para a própria audiência, gerando leads qualificados. Perfil ideal: influenciadores, veículos de comunicação ou negócios com bom relacionamento no nicho. Remuneração: valor fixo por lead ou venda, ou percentual sobre o contrato. Objetivo: ampliar a capilaridade e alimentar o funil de outros canais." },
          { label: "2. Reseller (Revendedor)", text: "O que faz: vende e fecha contratos diretamente com o cliente final em nome da marca. Perfil ideal: negócios com habilidade comercial e conhecimento técnico do produto. Remuneração: comissão sobre a venda, à vista ou recorrente enquanto o contrato durar. Objetivo: gerar receita de novos negócios com baixo risco e custo de expansão." },
          { label: "3. Implementador", text: "O que faz: garante a adoção do produto pelo cliente logo no início, reduzindo a complexidade percebida. Perfil ideal: empresas com know-how técnico do segmento. Remuneração: normalmente não recebe comissão direta; monetiza via serviço, certificações e indicações. Objetivo: reduzir o early-churn e a necessidade de uma equipe interna grande de suporte." },
          { label: "4. VAR (Value-Added Reseller)", text: "O que faz: combina venda e serviços complementares, atuando na aquisição e na retenção. Perfil ideal: parceiro com habilidade comercial e capacitação técnica. Remuneração: comissão sobre a venda (upfront ou diluída) + receita pelos serviços. Objetivo: aumentar capilaridade, retenção e sucesso do cliente ao mesmo tempo." },
          { label: "5. OEM (Original Equipment Manufacturer)", text: "O que faz: embarca a solução dentro do hardware ou produto de um fabricante parceiro. Perfil ideal: fabricante com hardware compatível. Remuneração: comissão por venda, ou o próprio ganho de usabilidade já funciona como incentivo. Objetivo: ampliar a capilaridade pela distribuição do parceiro." },
          { label: "6. ISV (Independent Software Vendor)", text: "O que faz: desenvolve integrações ou extensões que rodam sobre a plataforma do parceiro principal. Perfil ideal: desenvolvedores ou empresas de tecnologia independentes. Remuneração: participação em go-to-market conjunto, precificação agregada ou receita recorrente via marketplace. Objetivo: gerar upsell, aumentar o LTV e enriquecer o produto." },
        ],
      },
      { type: "subheading", text: "Como escolher o modelo com fit no seu negócio" },
      {
        type: "paragraph",
        text: "A escolha depende de dois fatores: o quanto o modelo conversa com a estratégia de growth e se o momento do negócio é adequado pra lidar com a complexidade de operar parceiros.",
      },
      {
        type: "list",
        items: [
          "Complexidade do produto: quanto mais técnico ou customizado, mais vale um parceiro que também implemente e dê suporte.",
          "Oportunidades de integração: produtos que fazem parte de um stack tecnológico se beneficiam de parceiros ISV ou complementares.",
          "Ticket médio e margem: tickets mais altos sustentam comissão de parceiros especializados; tickets baixos pedem canais de volume.",
          "Processo de vendas: vendas consultivas pedem parceiros com contato mais próximo do cliente.",
          "Integração entre áreas: cada modelo exige um tipo de suporte diferente (materiais, APIs, condições comerciais).",
          "Capacidade de gestão: quanto maior o envolvimento do parceiro com o cliente, mais estruturada precisa ser a gestão.",
          "Timing: o retorno de uma estratégia de canais costuma levar de 12 a 18 meses para tracionar.",
        ],
      },
      { type: "subheading", text: "Aplicação para os Representantes Cardápio Web" },
      {
        type: "paragraph",
        text: "O Programa de Representantes hoje se aproxima de um modelo híbrido entre Reseller e VAR: o representante prospecta e fecha a venda (papel de reseller), mas também pode assumir a implementação e o suporte, sendo remunerado em camadas por isso (lógica de VAR).",
      },
      {
        type: "list",
        items: [
          "Enquadramento como VAR: a comissão escalonada (venda, implementação, suporte, performance) já reflete a lógica de quanto mais serviço agregado, maior o ganho.",
          "Espaço para Finders: parceiros sem perfil pra vender e implementar poderiam só indicar, ampliando a capilaridade sem exigir a mesma capacitação técnica.",
          "Espaço para Implementadores puros: consultores/agências de tecnologia do setor poderiam atuar só na implementação e suporte, sem vínculo de venda.",
          "Potencial ISV: parceiros de tecnologia poderiam criar módulos complementares (a Cardápio Web já integra com iFood, 99Food, Forkit e Quase Pra Fome), gerando upsell sobre a base trazida pelos representantes.",
          "Timing: com volume relevante de clientes e comissionamento já definido, o próximo passo natural é diversificar os formatos de parceria em vez de manter um único modelo.",
        ],
      },
    ],
  },
  {
    id: "estruturar-parcerias-2026",
    title: "Como Estruturar Parcerias em 2026",
    summary: "As etapas para profissionalizar a área de canais, saindo da planilha manual.",
    blocks: [
      {
        type: "paragraph",
        text: "Guia baseado no artigo do blog da Canalize PRM. Defende que 2026 é o momento de profissionalizar a área de parcerias e canais, saindo de um modelo baseado em indicações espontâneas e controle manual (planilhas) para uma operação estruturada, com processos, métricas e tecnologia (PRM) que gerem receita previsível. Cita pesquisas (Sebrae/FGV e Exame) indicando que entre 70% e 75% das pequenas empresas já usam canais digitais para vender.",
      },
      { type: "subheading", text: "O passo a passo" },
      {
        type: "list",
        items: [
          "Diagnóstico, mapear a carteira atual de parceiros: quem gera oportunidades recorrentes, quem está inativo e quais processos dependem de planilhas manuais.",
          "Metas e estratégia, definir se o canal vai focar em aquisição, retenção ou cross-sell, e se o modelo será de volume (afiliados) ou nicho (parceiros estratégicos).",
          "Valores, premissas e benefícios, deixar claro o que a empresa oferece (comissões, treinamento, materiais) e o que espera em troca.",
          "Modelo de comissionamento, desenhar regras de setup, recorrência, clawback (cancelamentos/churn) e OTE (potencial de ganho anual).",
          "Onboarding, estruturar a jornada inicial com trilhas de treinamento, gamificação e acesso rápido a materiais.",
          "KPIs, acompanhar tempo até a primeira venda, taxa de ativação, ticket médio por canal e churn de parceiros.",
          "Automação de comissionamento, eliminar planilhas para dar transparência ao parceiro e evitar erros financeiros.",
          "Governança de dados, documentar processos e definir hierarquia de permissões para dados sensíveis (comissões, carteira de leads).",
          "Comunicação e feedback, criar rituais como boletins, webinars e canais de feedback acessíveis.",
          "Ativação e retenção, manter o parceiro engajado com campanhas de incentivo, gamificação e mentorias, não apenas treiná-lo uma vez.",
        ],
      },
    ],
  },
  {
    id: "partner-manager",
    title: "Partner Manager: Funções e Insights",
    summary: "O que faz o gestor de canais e insights aplicáveis ao nosso programa.",
    blocks: [
      {
        type: "paragraph",
        text: "O partner manager (gestor de canais) é o responsável por toda a jornada dos parceiros de vendas indireta: recrutamento e onboarding, treinamento, definição de metas conjuntas, gestão de contratos e comissionamento, engajamento, retenção e análise de indicadores. Precisa equilibrar visão estratégica com execução do dia a dia, já que cada parceiro tem expectativas e formas de operar diferentes.",
      },
      { type: "subheading", text: "Habilidades do gestor de parcerias" },
      {
        type: "list",
        items: [
          "Técnicas: modelos de negócio, precificação, regras de comissionamento, domínio de plataformas de PRM e leitura de dashboards.",
          "Comportamentais: comunicação empática, escuta ativa, pensamento estratégico e gestão de projetos.",
          "Ferramentas de PRM superam CRMs tradicionais por lidarem melhor com múltiplos parceiros, distribuição de leads por regras próprias, histórico e permissões diferenciadas.",
        ],
      },
      { type: "subheading", text: "Ciclo de vida do parceiro (4 fases)" },
      {
        type: "list",
        items: [
          "Recrutamento, ir além de aceitar qualquer parceiro; definir personas e critérios de fit.",
          "Onboarding, etapa que define o tom do relacionamento futuro.",
          "Engajamento, programas de incentivo, comunicação constante, materiais de suporte.",
          "Retenção, acompanhar NPS do canal, taxas de churn e agir rápido diante de sinais de desmotivação.",
        ],
      },
      { type: "subheading", text: "Estratégias e métricas citadas" },
      {
        type: "list",
        items: [
          "Comunidades exclusivas, gamificação e portais centralizados de informação.",
          "Métricas de valor: geração de leads por parceiro, ticket médio, LTV do canal e ranqueamento por performance.",
        ],
      },
      { type: "subheading", text: "Insights para o nosso setor de representantes" },
      {
        type: "list",
        items: [
          "Onboarding define o relacionamento futuro: revisar se o processo atual de entrada é claro o suficiente pra reduzir atrito e acelerar o ramp-up, com materiais padronizados, FAQ e reuniões estruturadas logo no início.",
          "Retenção é mais barata e estratégica do que captar novos representantes: acompanhar de perto indicadores de engajamento e satisfação, identificando sinais de desmotivação antes que o representante fique inativo.",
          "Faturamento não é tudo: o maior parceiro em vendas nem sempre é o que mais contribui pro crescimento consistente, vale considerar engajamento e recorrência no ranqueamento, não só volume bruto.",
          "Diferenciação por perfil: considerar metas conjuntas, comissionamento específico e níveis de suporte diferentes conforme o potencial e o estágio de cada representante.",
          "Engajamento contínuo e centralização: programas de incentivo (gamificação, rankings, comunidades) e centralizar informações, leads e comissionamento num único ambiente reduzem fricção e aumentam a sensação de suporte constante.",
        ],
      },
      {
        type: "paragraph",
        text: "Fonte: canalizeprm.com.br/blog/partner-manager-funcoes-habilidades",
      },
    ],
  },
  {
    id: "metodologia-canal-plural",
    title: "Metodologia de Programa de Canal (Plural Sales)",
    summary: "O modelo Flywheel de 9 passos, aplicado ao programa de representantes.",
    blocks: [
      {
        type: "paragraph",
        text: "A Plural Sales propõe uma metodologia de 9 passos para estruturar programas de canais indiretos, organizada em formato de Flywheel (roda de inércia) em vez do funil linear tradicional. A lógica: primeiro a empresa ganha tração interna (modelo de canal, recrutamento, proposta de valor e estrutura), depois transfere essa energia pro canal (onboarding, engajamento e indicadores) e, por fim, direciona tudo pro cliente final (validação e resultados). O tempo médio pra uma operação de canais indiretos atingir maturidade é de doze a dezoito meses.",
      },
      { type: "subheading", text: "Tração Inicial, Empresa" },
      {
        type: "steps",
        items: [
          { label: "1. Modelo de Canais", text: "Escolher entre Finder, Reseller, Implementação ou VAR, de acordo com o nível de responsabilidade, comprometimento e investimento que a empresa quer ter com cada tipo de parceiro." },
          { label: "2. Recrutamento", text: "Definir o perfil ideal de parceiro (afinidade com o cliente final, fit com a empresa, segmento) e usar critérios objetivos, como um ScoreCard, para selecionar candidatos." },
          { label: "3. Proposta de Valor", text: "Deixar claro como o canal ganha dinheiro, o que aprende e quais benefícios e diferenciais tem, para \"vender\" a entrada no programa." },
          { label: "4. Estrutura", text: "Organizar pessoas, processos, tecnologia e contrato de parceria (incluindo regras de registro de oportunidade) antes de escalar o programa." },
        ],
      },
      { type: "subheading", text: "Tração Secundária, Canal" },
      {
        type: "steps",
        items: [
          { label: "5. Onboarding", text: "Integrar rapidamente o novo canal à cultura, ao produto e aos processos da empresa, com trilha de treinamento, certificação e acompanhamento." },
          { label: "6. Jornada / Enablement", text: "Manter o canal engajado por meio de quatro frentes: experiência de desenvolvimento, conhecimento do negócio, capacitação técnica e auditoria de performance." },
          { label: "7. Indicadores", text: "Acompanhar KPIs específicos da operação de canais (CAC, MRR, Churn, LTV e engajamento dos parceiros), sempre separados das métricas de vendas diretas." },
        ],
      },
      { type: "subheading", text: "Tração Final, Cliente" },
      {
        type: "steps",
        items: [
          { label: "8. Validação", text: "Garantir que o sucesso do cliente final seja acompanhado ao longo de toda a jornada, e não só no onboarding, com responsabilidade compartilhada entre empresa e canal." },
          { label: "9. Resultados", text: "Medir a satisfação e o sucesso do cliente com métricas como uso e engajamento, churn, ativação, upsell/cross-sell, NPS, resolução no primeiro contato e volume de tickets de suporte." },
        ],
      },
      { type: "subheading", text: "Na prática: como seria no Programa de Representantes" },
      {
        type: "steps",
        items: [
          { label: "1. Modelo de Canais", text: "O representante já opera num modelo próximo ao Finder/Reseller: usa a própria rede e prospecção ativa, remunerado principalmente por comissão sobre a ativação." },
          { label: "2. Recrutamento", text: "Prioriza-se quem já atua com vendas, atendimento ao setor de restaurantes ou tem carteira ativa; o script de prospecção funciona como filtro entre leads \"Sem ficha\" e \"Alta Prioridade\", como um ScoreCard informal." },
          { label: "3. Proposta de Valor", text: "O que já é comunicado na abertura do script (número de estabelecimentos ativos, volume movimentado, modelo de comissão e suporte) é a proposta de valor do programa." },
          { label: "4. Estrutura", text: "O especialista de Channel Acquisition, o processo de anamnese/aprovação de leads e as calls pelo Google Meet já formam a estrutura interna necessária antes de escalar o recrutamento." },
          { label: "5. Onboarding", text: "Pode ser organizado em blocos: alinhamento de expectativas e metas, treinamento sobre CW Store e CW Club, e prática de atendimento e prospecção." },
          { label: "6. Jornada / Enablement", text: "Mostrar como o representante evolui (da primeira ativação até gerenciar uma carteira), reforçar conhecimento sobre a Cardápio Web, oferecer treinamentos de venda e negociação, e acompanhar performance com metas e feedback." },
          { label: "7. Indicadores", text: "Estabelecimentos ativados por mês, ticket médio dos restaurantes trazidos, churn dos estabelecimentos indicados e taxa de engajamento (representantes que venderam / total ativos)." },
          { label: "8. Validação", text: "Como o representante só é recompensado enquanto o restaurante continua ativo, o sucesso do estabelecimento precisa ser acompanhado em conjunto pelo time interno e pelo representante." },
          { label: "9. Resultados", text: "Percentual de restaurantes que completam o onboarding com sucesso, churn por representante, adesão a CW Club/Store, NPS dos estabelecimentos ativados por canal e volume de tickets de suporte." },
        ],
      },
    ],
  },
  {
    id: "checklist-90-dias",
    title: "Onboarding de Parceiros: Checklist 90 Dias",
    summary: "Por que os primeiros 90 dias decidem a retenção do parceiro.",
    blocks: [
      {
        type: "paragraph",
        text: "A entrada de um novo parceiro define o tom de toda a parceria. Quando o processo de boas-vindas é confuso, faltam informações sobre comissões ou o parceiro não sabe o que fazer, o engajamento cai rápido e o abandono nos primeiros meses aumenta. Um checklist claro pros primeiros 90 dias reduz incertezas, acelera a primeira venda e aumenta a retenção do canal.",
      },
      {
        type: "paragraph",
        text: "Vale aplicar um diagnóstico rápido logo no início, com poucas perguntas sobre experiência anterior no setor, preferência de treinamento e expectativa de faturamento, isso permite personalizar o fluxo de integração em vez de entregar o mesmo material genérico para todos.",
      },
      { type: "subheading", text: "Roteiro de onboarding passo a passo" },
      {
        type: "steps",
        items: [
          { label: "Semana 1, criação de vínculo", text: "Finalização do cadastro, envio do kit de boas-vindas com materiais e FAQs, reunião inicial de alinhamento com apresentação do programa e definição conjunta de metas, além da liberação de acesso ao portal do parceiro." },
          { label: "Semanas 2 a 4, treinamento e primeiros passos", text: "Sessões de treinamento sobre produto e processo comercial, simulações práticas de propostas, registro dos primeiros leads e coleta dos primeiros feedbacks para ajustar a abordagem." },
          { label: "Meses 2 e 3, acompanhamento e metas", text: "Acompanhamento periódico das atividades, envio de leads reais, revisão de comissionamento, avaliação da facilidade de uso das ferramentas e definição de metas de médio prazo." },
          { label: "Final dos 90 dias, avaliação e replanejamento", text: "Reunião de fechamento sobre a clareza dos processos e materiais, revisão do checklist de integração e ajustes para os próximos parceiros." },
        ],
      },
      {
        type: "paragraph",
        text: "O trabalho não termina depois do treinamento inicial. Check-ins semanais ou quinzenais, relatórios automáticos de andamento e revisões coletivas dos negócios já realizados ajudam a identificar dúvidas antes que se tornem motivo de abandono, ferramentas como um portal ou sistema de gestão de parceiros tornam isso mais confiável do que depender só de e-mails e planilhas.",
      },
      {
        type: "paragraph",
        text: "Nenhum checklist é perfeito desde a primeira versão: vale perguntar ao parceiro, ao final dos 90 dias, quais etapas foram confusas e o que ajudaria a melhorar o processo, tornando cada nova integração mais fluida que a anterior.",
      },
      { type: "subheading", text: "Como aplicar no setor de Representantes da Cardápio Web" },
      {
        type: "paragraph",
        text: "Assim que o cadastro e a anamnese forem aprovados, o representante recebe uma mensagem de boas-vindas padronizada, acesso ao portal de representantes e uma call inicial de alinhamento explicando o modelo de comissão, o mapa de oportunidades e as expectativas do programa. Nas primeiras semanas, o foco é o treinamento sobre a plataforma e o registro dos primeiros estabelecimentos prospectados, com acompanhamento próximo do time de Channel Acquisition. Entre o segundo e o terceiro mês, o representante já deve estar enviando propostas e fechando os primeiros contratos, com metas de 30, 60 e 90 dias acompanhadas em reuniões periódicas. Ao final dos 90 dias, uma conversa rápida sobre o que funcionou bem e o que pode melhorar ajuda a evoluir o processo para os próximos representantes.",
      },
    ],
  },
  {
    id: "sales-playbook",
    title: "Sales Playbook: Guia de Vendas",
    summary: "O que entra num playbook de vendas e como montar o nosso.",
    blocks: [
      {
        type: "paragraph",
        text: "Um sales playbook reúne personas de cliente, estratégias de vendas, roteiros de abordagem e as práticas que já deram certo com o time. Ajuda o vendedor a saber como agir em cada etapa da venda, reduz a dependência de tentativa e erro e garante que todo cliente tenha uma experiência consistente, independente de quem o atende.",
      },
      { type: "subheading", text: "O que costuma entrar em um playbook" },
      {
        type: "list",
        items: [
          "Estratégias e técnicas para cada etapa da venda, do primeiro contato ao fechamento.",
          "Personas dos clientes ideais, com as dores e critérios que ajudam a priorizar quem abordar.",
          "Roteiros e modelos de mensagens para manter a comunicação consistente.",
          "Informações completas sobre o produto ou serviço, incluindo preços e argumentos contra a concorrência.",
          "O passo a passo do processo comercial, com os marcos que indicam avanço de etapa.",
          "Os indicadores que mostram se o time está no caminho certo.",
        ],
      },
      { type: "subheading", text: "Sales plays (jogadas de vendas)" },
      {
        type: "list",
        items: [
          "Prospecção, abordar um lead novo pela primeira vez.",
          "Qualificação, perguntas que ajudam a saber se vale investir tempo naquele cliente.",
          "Follow-up, reengajar quem ficou em silêncio depois de um primeiro contato.",
          "Demonstração, apresentar o produto de forma direcionada à necessidade de quem assiste.",
          "Fechamento, técnicas para lidar com as últimas objeções e destravar a decisão.",
        ],
      },
      {
        type: "paragraph",
        text: "Pra montar: reunir quem vive o dia a dia da venda (líderes e linha de frente), definir objetivos e metas do time, mapear e segmentar público/personas, documentar cada etapa do processo comercial, criar roteiros e modelos de mensagem, escolher ferramentas de apoio e treinar todo o time antes de colocar o playbook em uso. É um documento vivo, vale acompanhar se o time consulta o material, coletar feedback e revisar a cada mudança relevante de produto, preço ou posicionamento.",
      },
      { type: "subheading", text: "Como aplicar no setor de Representantes" },
      {
        type: "paragraph",
        text: "Um playbook pode reunir o roteiro de abertura por perfil de lead, os argumentos sobre o modelo de comissão e as respostas para as objeções mais comuns, tudo em um único lugar de fácil consulta. Vale revisar sempre que o programa mudar (nova faixa de comissão, novo benefício, novo critério de aprovação) e reunir o time de Channel Acquisition periodicamente para trocar experiências.",
      },
    ],
  },
  {
    id: "lidar-objecoes",
    title: "Como Lidar com Objeções em Vendas",
    summary: "Como investigar antes de fechar e responder quando a objeção aparece.",
    blocks: [
      {
        type: "paragraph",
        text: "Lidar com objeções é a forma como o vendedor responde às preocupações do prospect sobre preço, timing ou apoio dos outros decisores antes de fechar a venda. Os motivos mais comuns: recursos ou orçamento limitado, falta de apoio dos demais envolvidos na decisão, comparação com um concorrente, achar que já tem uma solução parecida ou sentir que não é a hora certa.",
      },
      { type: "subheading", text: "Como investigar antes de fechar" },
      {
        type: "paragraph",
        text: "Fazer uma descoberta completa usando perguntas que cobrem a dor do cliente, o custo de não agir, o que ele realmente quer, quem tem poder de decisão, quais recursos estão disponíveis, o que ele teme que dê errado, se existe confiança genuína no fornecedor e os detalhes do dia a dia da operação. Quanto mais completa essa investigação, menos objeções de última hora aparecem no fechamento.",
      },
      { type: "subheading", text: "Como responder quando a objeção aparece" },
      {
        type: "paragraph",
        text: "Agradecer o prospect por trazer o ponto, demonstrar empatia genuína e fazer perguntas abertas pra entender a causa raiz. Depois, pedir pro próprio prospect relembrar o que mais chamou atenção dele na solução ajuda a reconectar a conversa com os pontos de valor que fizeram sentido até ali. Por fim, comprovar os argumentos com provas concretas, cases de outros clientes ou referências, dá mais segurança pra decisão.",
      },
      { type: "subheading", text: "Como aplicar no setor de Representantes" },
      {
        type: "paragraph",
        text: "Objeções recorrentes: falta de tempo pra uma call, desconfiança sobre o modelo de comissão ou a sensação de já ter uma solução parecida com outro parceiro. Vale entender a real preocupação do lead com perguntas abertas, reconectar com os benefícios do programa que despertaram o interesse dele no primeiro contato e usar números concretos, como o volume de estabelecimentos e o faturamento já movimentado na plataforma, como prova social.",
      },
    ],
  },
  {
    id: "partner-enablement",
    title: "Partner Enablement",
    summary: "Como equipar representantes com ferramentas, materiais e treinamentos.",
    blocks: [
      {
        type: "paragraph",
        text: "Partner enablement é o processo de equipar parceiros, revendedores, afiliados e representantes, com as ferramentas, materiais e treinamentos necessários pra vender e representar bem uma marca. Um programa bem estruturado amplia o alcance da empresa e aumenta a satisfação dos clientes atendidos pelos parceiros.",
      },
      { type: "subheading", text: "Como montar a estratégia" },
      {
        type: "paragraph",
        text: "Definir objetivos claros e segmentar os parceiros por tipo e maturidade. Criar mensagens e materiais já prontos e testados (roteiros de discovery, argumentos de posicionamento contra concorrentes, scripts de objeções), curtos e fáceis de consultar. Montar uma jornada de onboarding com marcos claros nos primeiros 30, 60 e 90 dias, incluindo acesso ao portal, treinamento básico e primeiras vendas acompanhadas. Depois entram programas de certificação (conteúdo on-line + sessões ao vivo + simulações) e, por fim, medir a adesão ao material e otimizar continuamente.",
      },
      { type: "subheading", text: "Comunicação, suporte e incentivos" },
      {
        type: "paragraph",
        text: "Comunicação constante com os parceiros, adaptada às características e à região de cada um, com reuniões regulares e pesquisas de satisfação. Suporte técnico: documentação clara, canal direto de dúvidas e um especialista disponível. Recompensas além da comissão (bônus, prêmios, reconhecimento ligados a metas) ajudam a manter o parceiro engajado. Um portal do parceiro reunindo materiais de marketing, manuais de vendas e demonstrações funciona como ponto central de apoio.",
      },
      { type: "subheading", text: "Como acompanhar os resultados" },
      {
        type: "paragraph",
        text: "Um programa de enablement costuma levar de um a dois anos pra mostrar resultado consistente. Acompanhar desde o início: conclusão de treinamentos, uso dos materiais disponibilizados, volume de negócios registrados e taxa de fechamento dos parceiros ativos. Comparar o desempenho de quem passou pelo programa completo com quem não passou ajuda a enxergar o real impacto do investimento.",
      },
      { type: "subheading", text: "Como aplicar no setor de Representantes" },
      {
        type: "paragraph",
        text: "Organizar uma trilha clara de capacitação nos primeiros dias após a aprovação, com acesso ao portal, treinamento sobre o modelo de comissão e simulações de abertura de conversa com leads. Manter contato constante com os representantes mais ativos, ouvir o que enfrentam no dia a dia de prospecção e reconhecer quem bate as metas com algo além da comissão padrão. Acompanhar número de representantes ativos, leads convertidos e tempo até a primeira venda.",
      },
    ],
  },
  {
    id: "comparativo-modelos-parceria",
    title: "Comparativo de Modelos de Parceria",
    summary: "Como RD Station, TOTVS, HubSpot, Shopify, iFood e Stripe estruturam parcerias.",
    blocks: [
      {
        type: "paragraph",
        text: "Pesquisa comparativa de modelos de parceria de mercado, organizada para embasar decisões sobre o modelo de parcerias do programa.",
      },
      { type: "subheading", text: "Cenário de Representante (venda/indicação direta)" },
      {
        type: "table",
        headers: ["Empresa", "Modelo", "Papel do representante", "Como ganha"],
        rows: [
          ["TOTVS", "ANT Finder (Agente de Negócios)", "Só indica oportunidades, não vende nem entrega", "Comissão por indicação convertida"],
          ["TOTVS", "CNT (Célula de Negócios)", "Vende e entrega o serviço completo", "Margem/comissão sobre venda + serviço"],
          ["TOTVS", "CPT (Célula de Plataformas)", "Híbrido: indicação, venda e/ou serviço conforme portfólio", "Comissão variável por modalidade"],
          ["RD Station", "Agências parceiras (Bronze a Diamante)", "Vende e implementa para o cliente final", "Comissão recorrente crescente por tier + bônus"],
          ["HubSpot", "Affiliate Program", "Divulga/indica via conteúdo, sem vender diretamente", "Comissão por indicação convertida em cliente"],
          ["Shopify", "Track \"Crie negócios\"", "Presta serviço de implementação e pode indicar lojistas", "Receita de serviço + comissões recorrentes"],
        ],
      },
      {
        type: "paragraph",
        text: "Destaque: a TOTVS separa claramente quem só indica (ANT Finder), quem vende e entrega (CNT) e um modelo híbrido (CPT), uma referência direta para comparar com o papel do representante da Cardápio Web hoje.",
      },
      { type: "subheading", text: "Cenários comuns de parceria (visão ampla do ecossistema)" },
      {
        type: "table",
        headers: ["Tipo de parceria", "Exemplos", "Como funciona na prática"],
        rows: [
          ["Canal/revenda com tiers", "RD Station (Bronze a Diamante), TOTVS (canais homologados)", "Progressão por maturidade/performance, com benefícios crescentes (selo, treinamento, comissão maior)"],
          ["Tecnologia/integração (ISV)", "HubSpot Technology Partner, Shopify Apps, Stripe", "Empresas constroem integrações sobre a plataforma; monetizam via marketplace, sem comissão de venda direta"],
          ["Certificação/recomendação sem revenue share", "iFood \"Super Integradoras\" (inclui a própria Cardápio Web)", "iFood não paga comissão; dá selo \"Recomendada pelo iFood\" e destaque no Portal do Parceiro"],
          ["Afiliados/indicação de conteúdo", "HubSpot Affiliate Program", "Criadores de conteúdo/sites ganham comissão por indicação, sem entrega de serviço"],
          ["Agência/consultoria de implementação", "HubSpot Solutions Partner, Shopify, Stripe", "Parceiro entrega o serviço fim a fim; ganha por projeto e/ou comissão recorrente"],
          ["Nicho/incentivo (startups, educação)", "HubSpot for Startups, HubSpot Education Partner", "Acesso a preço reduzido ou gratuito em troca de adoção e formação de futuros usuários"],
        ],
      },
      {
        type: "paragraph",
        text: "Detalhe interessante: a Cardápio Web já aparece como uma das \"Super Integradoras\" do iFood, o modelo de certificação sem comissão (só selo + visibilidade) já é vivido na prática, e pode ser um ponto de partida pra comparar com outros modelos que a empresa poderia oferecer aos seus representantes.",
      },
    ],
  },
  {
    id: "lideranca-santander",
    title: "Curso de Liderança (Santander Open Academy)",
    summary: "Os 7 tipos de líder, liderança situacional e os 7 pecados do líder.",
    blocks: [
      { type: "subheading", text: "Por que liderança importa" },
      {
        type: "list",
        items: [
          "Sem líder bom, nem o melhor planejamento salva a empresa.",
          "Hoje o líder é mentor + suporte emocional, não só \"chefe de tarefa\".",
          "3 coisas que um bom líder gera: mais motivação, mais confiança na empresa, hábitos melhores.",
          "Habilidades-chave: empatia, inteligência emocional, adaptabilidade, comunicação clara.",
        ],
      },
      { type: "subheading", text: "Os 7 tipos de líder" },
      {
        type: "steps",
        items: [
          { label: "1. Autoritária", text: "\"Faz porque eu mandei.\" Não delega, não explica muito. Usar só em emergência ou crise rápida, uso errado desmotiva geral." },
          { label: "2. Timoneiro", text: "Busca perfeição, lidera pelo exemplo, padrão alto. Problema: não explica bem o que quer, sobrecarrega o time. Combina bem com visionário ou afiliativo." },
          { label: "3. Afiliativa", text: "Foco nas pessoas e no clima, não na tarefa. Ótima em época de conflito ou moral baixa. Risco: não cobra desempenho ruim." },
          { label: "4. Democrática", text: "Ouve todo mundo, busca consenso. Boa quando falta clareza do caminho certo. Risco: reunião infinita, decisão trava." },
          { label: "5. Coach", text: "Foco no desenvolvimento de longo prazo de cada um. Frase-chave: \"eu acredito em você.\" Risco: virar microgerenciamento." },
          { label: "6. Visionária", text: "Visão clara de futuro, mobiliza o time. Reduz saída de bons funcionários. Não funciona com time mais expert que o líder. Variante: laissez-faire (deixa o time trabalhar sozinho), só funciona com time muito experiente." },
          { label: "7. Baseada em valores", text: "Criada por Simon Dolan. Usa 3 eixos: econômico-pragmático / evolutivo-emocional / ético-social. Ideia central: liderar com autenticidade dá resultado." },
        ],
      },
      {
        type: "paragraph",
        text: "Conclusão do bloco: não existe 1 estilo certo. O bom líder mistura estilos conforme a situação.",
      },
      { type: "subheading", text: "Liderança situacional (Hersey e Blanchard)" },
      {
        type: "paragraph",
        text: "O líder muda o estilo conforme a maturidade do time, em 4 estilos: Direcionar → Orientar → Apoiar → Delegar. Vantagens: mais flexibilidade, time se desenvolve, comunicação melhor, líder ganha tempo pro estratégico.",
      },
      { type: "subheading", text: "Competências de um bom líder" },
      {
        type: "paragraph",
        text: "Vai além do cargo: inspirar, orientar, motivar. Competências-chave: visão, inteligência emocional, comunicação, decisão, saber delegar, resiliência, reconhecer mérito.",
      },
      { type: "subheading", text: "Os 7 pecados do líder" },
      {
        type: "list",
        items: [
          "Querer ser \"queridinho\" em vez de respeitado.",
          "Não pedir ajuda/conselho ao time.",
          "Sufocar talento com regra demais.",
          "Não dar crítica construtiva.",
          "Não passar responsabilidade pro time.",
          "Tratar todo mundo igual (ignora diferenças individuais).",
          "Não manter o time informado.",
        ],
      },
      { type: "subheading", text: "Plano de ação pra se preparar pra liderar" },
      {
        type: "steps",
        items: [
          { label: "1. Autoconhecimento", text: "Pontos fortes/fracos, valores, 1 mês." },
          { label: "2. Comunicação", text: "Clareza, escuta, contínuo." },
          { label: "3. Inspirar e motivar o time", text: "Contínuo." },
          { label: "4. Melhorar tomada de decisão", text: "Contínuo." },
          { label: "5. Desenvolver talento da equipe", text: "Contínuo." },
          { label: "6. Resiliência e adaptação a mudança", text: "Contínuo." },
        ],
      },
      {
        type: "paragraph",
        text: "Frase pra guardar: liderança é processo contínuo de aprendizado, não um destino.",
      },
    ],
  },
];
