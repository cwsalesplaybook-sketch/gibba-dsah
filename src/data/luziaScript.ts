// Script da Luzia, copiado da planilha SCRIPT (Google Sheets) em 2026-09-21.
// Serve de reserva: quando /api/luzia-script responde, a Luzia usa a versão atual da planilha.
export type ScriptOption = { label: string; targetId: string };

export type ScriptEntry = {
  id: string;
  category: string;
  triggers: string[];
  question: string;
  answer: string;
  options: ScriptOption[];
  fallback: string;
};

export const luziaScript: ScriptEntry[] = [
  {
    "id": "002",
    "category": "Contrato",
    "triggers": [
      "inativação",
      "inativação do contrato",
      "60 dias",
      "ficar sem vender",
      "ficar sem clientes",
      "o que acontece se eu não vender",
      "contrato inativo",
      "suspensão do contrato",
      "sem novos clientes"
    ],
    "question": "O que acontece se eu ficar 60 dias sem adicionar clientes?",
    "answer": "A inativação não acontece de forma automática ou imediata.\nQuando identificarmos que um representante está há mais de 60 dias sem realizar novas vendas ou adicionar clientes, o Agente de Sucesso entrará em contato para entender o que aconteceu e se existe algum motivo que tenha impactado sua atuação.\nPode ser, por exemplo, algum imprevisto pessoal, questão familiar, ausência por saúde, férias ou qualquer outra situação que tenha impossibilitado a continuidade das vendas.\nA partir desse contato, avaliamos cada situação individualmente. Quando houver uma justificativa, ela será registrada e podemos combinar um período para que o representante retome suas atividades.\nCaso seja necessário, o representante poderá ficar temporariamente inativado para novas vendas e ter sua reativação programada para um momento posterior.\nO objetivo dessa regra não é simplesmente retirar representantes do canal, mas acompanhar a atuação, entender o cenário de cada um e manter uma base de parceiros ativos e engajados.",
    "options": [
      {
        "label": "Quero saber sobre exclusividade",
        "targetId": "003"
      },
      {
        "label": "Quero saber sobre multas",
        "targetId": "004"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 😕 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "003",
    "category": "Contrato",
    "triggers": [
      "exclusividade",
      "posso trabalhar com outra empresa",
      "posso representar outra plataforma",
      "concorrência",
      "outra marca",
      "trabalhar com concorrente",
      "posso ter outro cliente"
    ],
    "question": "Como funciona a exclusividade do contrato?",
    "answer": "A exclusividade se aplica somente a plataformas de Cardápio Digital.\nSabemos que existem diferentes tipos de plataformas no mercado: algumas atuam como Cardápio Digital, enquanto outras são voltadas para Sistema de Gestão e possuem outra finalidade.\nPor isso, o representante pode, sim, atuar com outras empresas que ofereçam soluções de gestão para restaurantes. Isso não impede a parceria com a Cardápio Web.\nO que não permitimos é a representação simultânea de outra plataforma que também atue diretamente como Cardápio Digital, justamente por uma questão de concorrência e conflito de interesses.\nOu seja: se a outra empresa trabalha com Sistema de Gestão, não há problema. A exclusividade é específica para o segmento de Cardápio Digital.",
    "options": [
      {
        "label": "Quero saber sobre multas",
        "targetId": "004"
      },
      {
        "label": "Quero saber sobre inativação",
        "targetId": "002"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 😕 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "004",
    "category": "Contrato",
    "triggers": [
      "multa",
      "multas",
      "penalidade",
      "o que acontece se eu sair",
      "posso ser multado",
      "aliciamento",
      "migração de clientes",
      "quanto pago de multa"
    ],
    "question": "Como funcionam as multas do contrato?",
    "answer": "As multas estão relacionadas a condutas específicas que não são permitidas durante ou após a parceria, principalmente em relação à concorrência, à migração de clientes e ao aliciamento da carteira:\n\n1. Não concorrência ativa: o representante não pode desenvolver, operar, licenciar, distribuir ou vender qualquer software ou plataforma de Cardápio Digital que seja concorrente direto da Cardápio Web.\n\n2. Migração de clientes ativos: durante o contrato, caso o representante incentive, ajude ou facilite a saída de um cliente da Cardápio Web para outra empresa, poderá ser aplicada uma multa correspondente a 18 vezes o valor mensal do plano de cada cliente migrado.\n\n3. Não aliciamento pós-contrato: mesmo após o encerramento da parceria, o representante não pode abordar, convidar ou induzir clientes da carteira da Cardápio Web a migrarem para plataformas concorrentes.\n\n4. Penalidade por violação pós-contratual: caso ocorra uma violação das regras de não aliciamento após o encerramento do contrato, poderá ser aplicada uma multa correspondente a 12 vezes a receita recorrente total gerada pela carteira na data do desligamento.\n\nImportante: não existe multa por inatividade, por ficar um período sem vender ou simplesmente por encerrar a parceria. As penalidades estão relacionadas a situações específicas, como incentivar migração de clientes, utilizar informações da carteira pra essa finalidade ou atuar como concorrente direto.",
    "options": [
      {
        "label": "Quero saber sobre exclusividade",
        "targetId": "003"
      },
      {
        "label": "Quero saber sobre inativação",
        "targetId": "002"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 😕 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "005",
    "category": "Planos e Preços",
    "triggers": [
      "plano",
      "planos",
      "preço",
      "preços",
      "valor",
      "quanto custa",
      "mensalidade",
      "plano mesas",
      "plano delivery",
      "plano premium",
      "mensal",
      "trimestral",
      "semestral",
      "anual"
    ],
    "question": "Quais são os planos e preços da Cardápio Web?",
    "answer": "Temos três planos, com quatro recorrências cada:\n\n1. Plano Mesas: mensal R$ 169,99 | trimestral R$ 479,97 | semestral R$ 899,94 | anual R$ 1.679,88.\n\n2. Plano Delivery: mensal R$ 209,99 | trimestral R$ 599,97 | semestral R$ 1.139,94 | anual R$ 2.159,88.\n\n3. Plano Premium: mensal R$ 269,99 | trimestral R$ 779,97 | semestral R$ 1.499,94 | anual R$ 2.879,88.\n\nAtenção: fidelidade, pagamento online, chatbot e extensão WhatsApp não estão disponíveis no Plano Mesas. O chatbot só existe nos planos Delivery e Premium. Sempre confirme o que o lead precisa antes de indicar o Mesas.",
    "options": [
      {
        "label": "Quero saber sobre módulos adicionais",
        "targetId": "006"
      },
      {
        "label": "Quero saber sobre descontos",
        "targetId": "007"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "006",
    "category": "Planos e Preços",
    "triggers": [
      "módulo",
      "módulos",
      "adicional",
      "adicionais",
      "gestão financeira",
      "fiscal",
      "cupom fiscal",
      "nota fiscal",
      "roteirização",
      "gestão de entregas",
      "estoque avançado",
      "marketplace",
      "ifood",
      "99food",
      "keeta",
      "aiqfome"
    ],
    "question": "Quais são os módulos adicionais e quanto custam?",
    "answer": "Valores mensais de referência dos módulos adicionais (a cobrança segue a recorrência do plano principal):\n\n1. Gestão Financeira: R$ 69,99\n2. Fiscal (Cupom Fiscal): R$ 69,99\n3. Gestão de Entregas (Roteirização): R$ 54,99\n4. Estoque Avançado: R$ 29,99\n5. Integração com marketplaces (iFood, 99food, Keeta, Aiqfome): R$ 29,99\n6. Totem (por dispositivo): R$ 99,99",
    "options": [
      {
        "label": "Quero saber sobre o totem",
        "targetId": "008"
      },
      {
        "label": "Quero saber sobre planos e preços",
        "targetId": "005"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "007",
    "category": "Planos e Preços",
    "triggers": [
      "desconto",
      "descontos",
      "negociar",
      "negociação",
      "promoção",
      "abatimento",
      "condição especial",
      "20%",
      "30%",
      "parceria",
      "fidelidade"
    ],
    "question": "Posso oferecer desconto para o lead?",
    "answer": "Não ofereça desconto espontaneamente. Ele é ferramenta de negociação: só entra quando o lead pedir e depois que o valor e o ROI já foram trabalhados.\n\nDescontos disponíveis para negociação: 20% por 3 meses ou 30% por 3 meses, válidos para planos mensal ou trimestral. Em parcerias, o desconto varia de 5% a 15% dependendo da fidelidade.\n\nSe o lead reclamar de preço, primeiro contorne pela lógica de valor antes de falar em desconto.",
    "options": [
      {
        "label": "Quero saber como contornar \"achei caro\"",
        "targetId": "012"
      },
      {
        "label": "Quero saber sobre garantia",
        "targetId": "009"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "008",
    "category": "Produto",
    "triggers": [
      "totem",
      "autoatendimento",
      "terminal",
      "touchscreen",
      "self service",
      "temos totem",
      "tem totem",
      "fast food",
      "smart tef"
    ],
    "question": "Vocês têm totem de autoatendimento?",
    "answer": "Sim, temos o módulo de Totem, lançado em maio de 2026. É um terminal touchscreen de autoatendimento presencial: o cliente faz o próprio pedido, sem precisar de atendente.\n\nCusta R$ 99,99 por dispositivo/mês. A Cardápio Web não vende o hardware: o cliente compra o equipamento que preferir, desde que seja touchscreen com navegador (Android, Windows ou Linux). Usa o mesmo catálogo do cardápio digital (link de balcão), sem cadastro separado.\n\nPagamento: dinheiro (padrão), Pix automático via Tuna e cartão via Smart TEF. A identificação do cliente por telefone é obrigatória e vincula ao programa de fidelidade. Impressora funciona apenas em dispositivos Windows. É possível ter vários totens no mesmo estabelecimento, cada um com configuração independente. Cupons só funcionam com código; descontos automáticos não funcionam no totem.\n\nO pedido cai normalmente no gestor: dinheiro entra como pagamento pendente e Pix/cartão após a confirmação.\n\nIdeal para hamburguerias, fast food, lanchonetes, açaiterias e restaurantes self-service com alto fluxo.",
    "options": [
      {
        "label": "Quero saber sobre módulos adicionais",
        "targetId": "006"
      },
      {
        "label": "Quero saber sobre planos e preços",
        "targetId": "005"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "009",
    "category": "Garantia",
    "triggers": [
      "teste grátis",
      "testar",
      "período de teste",
      "garantia",
      "reembolso",
      "devolução",
      "devolver o dinheiro",
      "cancelar",
      "arrependimento",
      "não gostei"
    ],
    "question": "Tem teste grátis? Como funciona a garantia?",
    "answer": "Não temos teste grátis, mas temos algo melhor: garantia de satisfação com reembolso integral, contada a partir da contratação.\n\n1. Planos mensal e trimestral: 10 dias de garantia.\n2. Planos semestral e anual: 30 dias de garantia.\n\nTexto pronto pro lead: Teste grátis a gente não tem, mas tem algo melhor: garantia de satisfação com reembolso integral. Mensal e trimestral têm 10 dias, semestral e anual têm 30 dias, tudo contado a partir da contratação. Você usa o sistema na prática e, se não atender o que você precisa, devolvemos tudo sem burocracia. Tudo bem?",
    "options": [
      {
        "label": "Quero saber sobre planos e preços",
        "targetId": "005"
      },
      {
        "label": "Quero saber sobre objeções de confiança",
        "targetId": "018"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "010",
    "category": "Produto",
    "triggers": [
      "o que a ferramenta faz",
      "funcionalidades",
      "benefícios",
      "pilares",
      "chatbot",
      "disparador de mensagens",
      "fidelidade",
      "meta ads",
      "google ads",
      "kds",
      "estoque",
      "relatórios",
      "fluxo de caixa",
      "diferenciais"
    ],
    "question": "Quais são os principais benefícios e funcionalidades do produto?",
    "answer": "O produto se apoia em três pilares:\n\n1. Automação de atendimento: chatbot com IA no WhatsApp (apenas nos planos Delivery e Premium), cardápio digital, extensão WhatsApp Web e pagamento online.\n\n2. Aumento de vendas: disparador de mensagens em massa no WhatsApp, programa de fidelidade (Delivery e Premium) e integração com Meta Ads e Google Ads. Mais de 800 agências parceiras.\n\n3. Gestão do negócio: fluxo de caixa, estoque, KDS, relatórios, gestão de mesas, controle remoto e integrações com F360, Foody Delivery, Pick N Go e iFood.",
    "options": [
      {
        "label": "Quero saber como demonstrar o retorno (ROI)",
        "targetId": "011"
      },
      {
        "label": "Quero saber sobre planos e preços",
        "targetId": "005"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "011",
    "category": "Argumento de Venda",
    "triggers": [
      "roi",
      "retorno",
      "retorno do investimento",
      "se paga",
      "vale a pena",
      "vale o investimento",
      "base inativa",
      "quanto retorna",
      "argumento de venda"
    ],
    "question": "Como demonstro o retorno do investimento para o lead?",
    "answer": "O ROI mais simples de demonstrar usa o disparador de mensagens. Texto pronto pro lead: Com o disparador de mensagens, imagina um disparo pra base inativa: 100 clientes, 10% voltam a comprar, ticket médio de R$ 50 = R$ 500 a mais. Isso já cobre a ferramenta e ainda sobra.\n\nUse esse cálculo sempre que o lead achar o valor alto ou disser que só está olhando o cardápio digital.",
    "options": [
      {
        "label": "Quero saber como contornar \"achei caro\"",
        "targetId": "012"
      },
      {
        "label": "Quero saber sobre os pilares do produto",
        "targetId": "010"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "012",
    "category": "Objeção - Valor",
    "triggers": [
      "caro",
      "achei caro",
      "muito caro",
      "preço alto",
      "não cabe no orçamento",
      "só quero saber o preço",
      "quanto custa",
      "me passa o valor"
    ],
    "question": "O lead achou caro ou só quer saber o preço. Como contornar?",
    "answer": "Objeção de preço nunca é sobre preço: é falta de valor percebido. Mude o critério de decisão de \"quanto custa\" para \"quanto retorna\". Nunca ofereça desconto espontaneamente e nunca valide o argumento de preço.\n\nSequência: valide sem se submeter, quebre a comparação rasa, reancore em valor, prove com um número simples de ROI e feche com uma pergunta que encerra o raciocínio.\n\nSe ele achou caro, use: Entendi. Se você achou caro é porque eu ainda não consegui te mostrar tudo que a ferramenta entrega. A plataforma costuma se pagar já no primeiro mês, porque não garante só a automatização dos pedidos, garante aumento de faturamento. Só com o disparador de mensagens, imagina um disparo pra sua base e 10 clientes voltam a comprar. Com ticket médio de R$ 50, já são R$ 500 a mais. Isso cobre a ferramenta e ainda sobra. Faz sentido?\n\nSe ele só quer saber o preço no início da conversa, use: Nós temos planos a partir de R$ 169,99 e esse investimento costuma se pagar já no primeiro mês, porque a ferramenta tem tudo pra você vender mais, não é só cardápio digital. Mas pra te indicar o plano certo, me fala: qual dificuldade você tá enfrentando hoje?",
    "options": [
      {
        "label": "Quero saber sobre concorrente mais barato",
        "targetId": "013"
      },
      {
        "label": "Quero saber sobre ROI",
        "targetId": "011"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "013",
    "category": "Objeção - Valor",
    "triggers": [
      "mais barato",
      "plataforma mais barata",
      "concorrente mais barato",
      "promoção do concorrente",
      "promoção enorme",
      "mesmo preço",
      "mesma coisa",
      "desconto do concorrente"
    ],
    "question": "O lead encontrou plataformas mais baratas ou uma promoção do concorrente. O que responder?",
    "answer": "Não ataque o concorrente: ataque o modelo de comparação por preço.\n\nSe ele disse que achou plataformas mais baratas com o mesmo: [NOME], é comum plataformas se apresentarem como completas. Mas com base no que você viu aqui, a gente de fato te atende? (Após a confirmação do lead) Então. Pra vender mais barato, essas outras plataformas precisam abrir mão de alguma coisa: suporte, funcionalidade ou estabilidade. Você acredita que faz sentido investir numa ferramenta que não vai estar em 100% quando você precisar?\n\nSe ele citou uma promoção enorme do concorrente: [NOME], hoje qual o valor do seu prato principal? (Após a resposta) Pra você vender esse prato pela metade do preço, ia precisar cortar alguma coisa: insumo, mão de obra. O mesmo vale pra ferramenta: pra fazer essa promoção toda, o concorrente tá cortando algo, seja suporte, funcionalidade ou estabilidade. Faz sentido investir numa ferramenta que vai estar em 80% quando você precisar de 100%?",
    "options": [
      {
        "label": "Quero saber sobre posicionamento por concorrente",
        "targetId": "015"
      },
      {
        "label": "Quero saber como contornar \"achei caro\"",
        "targetId": "012"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "014",
    "category": "Objeção - Valor",
    "triggers": [
      "estou começando agora",
      "começando",
      "negócio novo",
      "pagar 12 meses",
      "plano anual parcelado",
      "parcelado",
      "gestor de tráfego",
      "agência",
      "gestor acha caro"
    ],
    "question": "O lead está começando agora, tem dúvida sobre pagar 12 meses de uma vez ou é gestor de tráfego. Como contornar?",
    "answer": "1. Estou começando agora: Entendo que tá na fase inicial. Mas [NOME], já vi muito negócio começar sem sistema, a demanda cresce e aí não dá conta, e primeira impressão é a que fica. Faz mais sentido começar profissional desde o início pra que os primeiros clientes te divulguem bem, do que arrumar o processo depois quando já tem reclamação acumulada. Concorda?\n\n2. Tenho que pagar 12 meses de uma vez?: O plano anual é parcelado mensalmente: você paga todo mês, só que com o desconto de quem faz uma adesão maior. É o que tem melhor custo-benefício. Mas se preferir começar com menos comprometimento, temos planos trimestrais e mensais também. Qual se encaixa melhor pra você agora?\n\n3. Gestor de tráfego acha caro: Te entendo, você olha mais pelo ângulo do tráfego. Mas além do tráfego, a gente entrega automação de atendimento e gestão completa, coisas que o cliente ia precisar contratar em outros sistemas. Na prática, a Cardápio Web substitui ferramentas que sairiam mais caro separadas. Proponho uma vídeo chamada com você, seu cliente e nosso especialista pra você ver isso na prática. Consegue marcar?",
    "options": [
      {
        "label": "Quero saber sobre planos e preços",
        "targetId": "005"
      },
      {
        "label": "Quero saber sobre agendar a vídeo chamada",
        "targetId": "017"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "015",
    "category": "Objeção - Concorrente",
    "triggers": [
      "já uso",
      "já uso outro sistema",
      "concorrente",
      "anota aí",
      "brendi",
      "goomer",
      "instadelivery",
      "consumer",
      "menu dino",
      "whatsmenu",
      "saipos",
      "analisando outras plataformas",
      "comparando"
    ],
    "question": "O lead já usa outra ferramenta ou está analisando concorrentes. Como responder?",
    "answer": "Nunca ataque o concorrente diretamente: ataque o modelo de comparação e use as palavras do próprio lead para mostrar o gap.\n\nSe ele já usa outra ferramenta: Entendi, [NOME]. E você consegue identificar algum ponto de melhoria no sistema que usa hoje? (Após ele falar o gap) E como você acha que a ausência disso impacta na sua operação? (Após a resposta) É exatamente isso que a Cardápio Web resolve. Faz sentido marcar uma apresentação pra você ver como funciona na prática?\n\nSe ele está analisando outras plataformas: Faz sentido querer analisar bem. Mas a melhor forma de garantir que você tá tomando a decisão certa não é comparar por site, é ver a ferramenta na prática com um especialista que entende sua operação. A gente consegue marcar essa semana. Qual dia funciona melhor pra você?\n\nPosicionamento por concorrente (uso interno, não fale assim com o lead):\n\n1. Anota Aí: comprado pelo iFood, cresceu por promoção agressiva, não por qualidade. Suporte terceirizado, que aparece quando o cliente mais precisa.\n2. Brendi: caro pelo que entrega. Foco só em delivery, sem mesas e sem gestão.\n3. Goomer: foco em totens. Cardápio com fluxo ruim pro cliente, o que prejudica a conversão de quem faz tráfego pago.\n4. Instadelivery: barato, mas com visual pouco profissional, o que afeta a percepção do cliente final e a conversão.\n5. Consumer/Menu Dino: o cardápio (Menu Dino) tem bugs sérios pra quem faz tráfego pago. Precisa instalar software pra atualizar e não funciona no celular.\n6. WhatsMenu: ferramenta básica. Sem disparador nativo de WhatsApp, sem programa de fidelidade e sem ferramentas de crescimento.\n7. Saipos: focado em grandes operações e franquias. Para food service menor, é sobredimensionado.",
    "options": [
      {
        "label": "Quero saber sobre concorrente mais barato",
        "targetId": "013"
      },
      {
        "label": "Quero saber sobre agendar a vídeo chamada",
        "targetId": "017"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "016",
    "category": "Objeção - Timing",
    "triggers": [
      "me manda depois",
      "me manda no whatsapp",
      "depois eu olho",
      "tô ocupado",
      "sem tempo",
      "depois das 18h",
      "esperar",
      "janeiro",
      "ano que vem",
      "próximo ano",
      "retorno depois",
      "tô com pressa",
      "quer ir direto pro valor"
    ],
    "question": "O lead adiou a conversa (me manda depois, ocupado, esperar, pressa). O que responder?",
    "answer": "Dispensa não é não: é adiamento. O lead não rejeita o produto, está evitando a conversa.\n\n1. Me manda no WhatsApp que olho depois: Claro, assim que a gente terminar já te mando tudo no WhatsApp. Mas já que a gente tá aqui, deixa eu usar só 5 minutos pra ver se de fato faz sentido pra você. Se não fizer, eu nem te retorno mais. Pode ser?\n\n2. Posso falar depois das 18h / tô ocupado agora: Infelizmente depois das 18h não temos atendimento. Mas você tem algum tempinho disponível no horário de almoço ou começo da tarde? Mesmo que seja 10 minutos já resolve.\n\n3. Vou esperar pra contratar em janeiro ou no próximo ano: [NOME], você mencionou que quer resolver [DOR MAPEADA]. Cada mês que passa sem isso é mais vendas ficando na mesa. Faz mais sentido começar agora e já ter resultado antes do próximo ano. Vamos marcar uma vídeo chamada pra você ver como funciona?\n\n4. Lead com pressa, quer ir direto pros valores: [NOME], pra te falar o valor certo preciso entender sua operação primeiro, senão passo um plano que não é o ideal. São só 4 perguntas rápidas. Pode ser?",
    "options": [
      {
        "label": "Quero saber sobre agendar a vídeo chamada",
        "targetId": "017"
      },
      {
        "label": "Quero saber sobre situações especiais",
        "targetId": "021"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "017",
    "category": "Objeção - Processo",
    "triggers": [
      "vídeo chamada",
      "precisa de vídeo chamada",
      "reunião",
      "apresentação",
      "tenho sócio",
      "sócio",
      "me manda material",
      "me manda pdf",
      "material com os planos",
      "burocrático",
      "agendar"
    ],
    "question": "O lead resiste à vídeo chamada ou pede material. Como conduzir?",
    "answer": "O lead não está rejeitando o produto: está rejeitando a etapa.\n\n1. Essa vídeo chamada é necessária?: É justamente pra ser mais rápido e eficiente. O consultor vai mostrar tudo na prática, tirar suas dúvidas e já faz uma proposta personalizada, algo que não dá pra fazer por mensagem sem ver sua operação. Em 30 minutos você sai sabendo exatamente se faz sentido ou não. Faz sentido?\n\n2. Tenho sócio, mas sou eu que decido: Sem problema, podemos marcar com você e seu sócio juntos. Assim ambos ficam por dentro, tiram as dúvidas e a decisão pode ser feita com você na frente. Evita precisar refazer a apresentação depois. Tudo bem?\n\n3. Me manda um material com os planos: A gente tem esse material sim, mas ele vai ser passado pelo consultor na vídeo chamada, porque os planos são personalizados e ele precisa entender sua operação antes de recomendar. Imagina que você recebe o PDF e surgem dez dúvidas que ele não responde. Na chamada, o consultor já tira tudo ali. Faz mais sentido assim, não?",
    "options": [
      {
        "label": "Quero saber sobre o processo de agendamento",
        "targetId": "020"
      },
      {
        "label": "Quero saber sobre situações especiais",
        "targetId": "021"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "018",
    "category": "Objeção - Confiança",
    "triggers": [
      "vendas fracas",
      "não é o momento",
      "clientes preferem ligar",
      "pedir por ligação",
      "de onde vocês são",
      "onde fica a sede",
      "integra com meu sistema",
      "integração",
      "api",
      "é confiável"
    ],
    "question": "O lead tem dúvidas de confiança (vendas fracas, clientes ligam, localização, integração). O que responder?",
    "answer": "1. Minhas vendas estão fracas, não é o momento: Entendo o receio. Mas você já teve dificuldade pra atender clientes no WhatsApp? (Após a confirmação) Quando o cliente demora a ser atendido, ele não pede de novo. Se as vendas estão fracas, parte do motivo pode ser exatamente esse. A ferramenta resolve esse ciclo. Faz sentido pensar assim?\n\n2. Meus clientes preferem pedir por ligação: Geralmente isso acontece porque o cardápio digital que eles usam é complicado. O nosso é diferente: em poucos cliques o cliente já finaliza o pedido sem precisar de atendente. A gente pode marcar uma apresentação pra você ver como funciona. Quando você tem disponibilidade?\n\n3. De onde vocês são?: A gente é de Fortaleza, mas atende todo o Brasil, com clientes em todos os estados. A operação é 100% remota: qualquer dúvida ou ajuste é resolvido na hora, sem visita presencial.\n\n4. Vocês integram com meu sistema?: A gente tem integrações ativas com vários sistemas e, pra os que ainda não temos, temos API aberta: o outro sistema consegue se integrar com a gente. Qual sistema você usa hoje?",
    "options": [
      {
        "label": "Quero saber sobre garantia",
        "targetId": "009"
      },
      {
        "label": "Quero saber sobre agendar a vídeo chamada",
        "targetId": "017"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "019",
    "category": "Encerramento",
    "triggers": [
      "sem operação",
      "fora do perfil",
      "orçamento muito baixo",
      "não é food service",
      "sem operação digital",
      "encerrar conversa",
      "desistir do lead"
    ],
    "question": "Quando devo encerrar a conversa com o lead?",
    "answer": "Encerre quando o orçamento estiver muito abaixo do mínimo, o lead estiver completamente fora do perfil de food service, ou não tiver nenhuma operação digital nem plano de ter. Encerre sempre deixando a porta aberta.\n\nTexto pronto: Entendo, [NOME]. Pelo que você me descreveu, o momento ainda não é o ideal pra você tirar o máximo da ferramenta. Mas fica à vontade pra me chamar quando a situação mudar, a gente vai estar aqui.",
    "options": [
      {
        "label": "Quero saber sobre planos e preços",
        "targetId": "005"
      },
      {
        "label": "Quero saber como contornar \"achei caro\"",
        "targetId": "012"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "020",
    "category": "Processo",
    "triggers": [
      "agendar",
      "agendamento",
      "agendador",
      "meetime",
      "google agenda",
      "formulário de ganho",
      "no-show",
      "remarcar",
      "remarcação",
      "closer",
      "passagem de bastão",
      "bant",
      "cardápio no ar",
      "prazo do cardápio",
      "sede",
      "onde fica"
    ],
    "question": "Como funciona o agendamento e a passagem para o closer?",
    "answer": "Fluxo de agendamento: link do agendador → Meetime → Google Agenda → formulário de ganho → Pipedrive do closer.\n\nRemarcação e no-show: o closer marca o negócio como perdido \"[IS] No-show\" e o lead volta para o SDR na Meetime.\n\nPassagem de bastão para o closer, informações obrigatórias: como conheceu, nome do cliente, necessidade (N), plano indicado, valores dentro do orçamento (B), tomador de decisão (A) e prioridade de 0 a 10 (T).\n\nA Cardápio Web tem sede em Fortaleza-CE, atende todos os estados e a operação é 100% remota. O cardápio fica no ar em 4 dias úteis após a resposta do cliente.",
    "options": [
      {
        "label": "Quero saber sobre objeções de processo",
        "targetId": "017"
      },
      {
        "label": "Quero saber sobre situações especiais",
        "targetId": "021"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "021",
    "category": "Situações Especiais",
    "triggers": [
      "urgência",
      "quer pra amanhã",
      "prioridade",
      "quer fechar pelo whatsapp",
      "sem vídeo chamada",
      "insatisfeito com perguntas",
      "gestor de tráfego junto",
      "agência junto"
    ],
    "question": "Como agir em situações especiais (urgência, fechar sem vídeo, lead impaciente, agência junto)?",
    "answer": "1. Lead insatisfeito com as perguntas: tente ligar primeiro. Se não conseguir, abra exceção e responda direto, sempre com o objetivo de marcar a reunião. Texto: Entendo que você quer as informações logo. Me fala qual é a sua maior dificuldade hoje que te fez buscar a Cardápio Web, assim consigo te ajudar de forma mais direta.\n\n2. Lead com urgência (quer o sistema pronto amanhã): Se eu conseguir essa prioridade pra você, a gente fecha hoje? Se ele confirmar, consulte o grupo #prioridades_de_clientes no Slack antes de confirmar ao lead.\n\n3. Lead quer fechar pelo WhatsApp sem vídeo chamada: Entendo que o tempo é corrido. Mas a vídeo chamada dura 30 minutos e é onde você vai ver o sistema funcionando, isso já elimina qualquer dúvida. Tenho horário disponível hoje às [HORA]. Você estaria disponível?\n\n4. Lead com gestor de tráfego ou agência junto: inclua o gestor e o cliente na vídeo chamada com o especialista. O valor fica muito mais claro quando o especialista fala com os dois ao mesmo tempo.",
    "options": [
      {
        "label": "Quero saber sobre o processo de agendamento",
        "targetId": "020"
      },
      {
        "label": "Quero saber sobre objeções de timing",
        "targetId": "016"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "022",
    "category": "Programa de Representantes",
    "triggers": [
      "o que é o programa",
      "programa de representantes",
      "representante",
      "como funciona o programa",
      "o que faz um representante",
      "sobre a cardápio web",
      "quantos clientes",
      "quem é a cardápio web",
      "sem vínculo",
      "autônomo"
    ],
    "question": "O que é o Programa de Representantes e o que faz um representante?",
    "answer": "O Programa de Representantes Cardápio Web é um modelo de vendas autônomas com comissionamento recorrente.\n\nO que faz um representante:\n1. Prospecta donos de restaurantes, bares e deliveries para apresentar a Cardápio Web.\n2. Realiza vendas de forma autônoma, sem vínculo empregatício.\n3. Acompanha a implementação e o suporte inicial do cliente, quando aplicável.\n4. Usa um sistema próprio de CRM para gerir leads e oportunidades.\n\nSobre a Cardápio Web: atende mais de 17 mil clientes em todo o Brasil, processa mais de R$ 800 milhões por mês em pedidos, integra com iFood, 99Food, Forkit e Quase Pra Fome e oferece uma solução 360 com gestão, vendas e delivery integrados. O propósito da empresa é ser internacional até 2040.\n\nPlanos que o representante comercializa: Mesas a partir de R$ 169,99 (operações presenciais), Delivery R$ 209,99 (dark kitchens e delivery) e Premium a partir de R$ 269,99 (operações híbridas), além de seis módulos opcionais, incluindo marketplace e estoque avançado. O módulo fiscal custa R$ 69,99, com taxa adicional acima de 2.500 notas.\n\nOportunidade de mercado: o delivery cresceu com a pandemia e com apps como o iFood, os estabelecimentos precisam de estratégia presencial e delivery ao mesmo tempo, a digitalização aumentou a demanda por soluções completas e o sistema modular deixa o cliente escolher as funcionalidades de que precisa.",
    "options": [
      {
        "label": "Quero saber sobre a comissão",
        "targetId": "023"
      },
      {
        "label": "Quero saber sobre as ferramentas do representante",
        "targetId": "025"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "023",
    "category": "Comissão",
    "triggers": [
      "comissão",
      "quanto ganho",
      "quanto eu ganho",
      "percentual",
      "10%",
      "40%",
      "bônus",
      "recorrente",
      "pagamento",
      "quando recebo",
      "dia 15",
      "teto",
      "implementação",
      "suporte",
      "churn"
    ],
    "question": "Como funciona a comissão do representante e quando eu recebo?",
    "answer": "A comissão é recorrente e cresce conforme o representante assume mais responsabilidades:\n\n1. Comissão base: 10% recorrente sobre as vendas realizadas.\n2. Mais 10% ao assumir a implementação do cliente.\n3. Mais 10% ao assumir o suporte do cliente.\n4. Mais 10% de bônus de performance ao atingir 50 clientes com churn menor que 8%.\n\nA comissão recorrente máxima é de até 40%.\n\nPagamento: mensal, todo dia 15, enquanto o cliente permanecer ativo.",
    "options": [
      {
        "label": "Quero saber sobre projeções de ganho",
        "targetId": "024"
      },
      {
        "label": "Quero saber sobre multas e contrato",
        "targetId": "004"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "024",
    "category": "Comissão",
    "triggers": [
      "projeção",
      "quanto posso ganhar",
      "ganho estimado",
      "simulação",
      "10 vendas",
      "primeiro ano",
      "dois anos",
      "clientes ativos",
      "faturamento do representante"
    ],
    "question": "Quanto um representante pode ganhar? Existe alguma projeção?",
    "answer": "Projeção apresentada na reunião de apresentação do modelo, considerando 10 vendas por mês:\n\n1. Primeiro ano: ganho estimado de R$ 123.740. Após 1 ano, cerca de 107 clientes ativos, gerando R$ 18.188,29 por mês.\n2. Dois anos: ganho acumulado estimado de aproximadamente R$ 500 mil. Após 2 anos, cerca de 192 clientes ativos, gerando R$ 32.636,93 por mês.\n\nSão estimativas: a comissão é paga enquanto o cliente permanecer ativo.",
    "options": [
      {
        "label": "Quero saber sobre a comissão",
        "targetId": "023"
      },
      {
        "label": "Quero saber sobre o programa",
        "targetId": "022"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "025",
    "category": "Ferramentas",
    "triggers": [
      "ferramentas",
      "sistema do representante",
      "crm",
      "mapa de oportunidades",
      "calculadora de proposta",
      "link de pagamento",
      "cadastro de leads",
      "status do lead",
      "fatura",
      "portal do representante"
    ],
    "question": "Quais ferramentas o representante tem para trabalhar?",
    "answer": "O representante conta com um sistema exclusivo com CRM integrado:\n\n1. Mapa de oportunidades: mostra estabelecimentos por zona geográfica.\n2. Cadastro de leads: manual ou via base de dados.\n3. Status do lead: visitado, contatado ou cancelado.\n4. Calculadora de proposta: gera automaticamente o link de pagamento.\n5. Faturas e comissões: visualização da fatura e da comissão de todos os clientes.",
    "options": [
      {
        "label": "Quero saber sobre mentorias e suporte",
        "targetId": "026"
      },
      {
        "label": "Quero saber sobre o onboarding",
        "targetId": "027"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "026",
    "category": "Capacitação",
    "triggers": [
      "mentoria",
      "mentorias",
      "treinamento",
      "capacitação",
      "segunda-feira",
      "20h",
      "central de ajuda",
      "matriz de concorrentes",
      "suporte",
      "aulas",
      "gravadas",
      "dúvidas"
    ],
    "question": "Como funcionam as mentorias, o treinamento e o suporte para representantes?",
    "answer": "1. Mentorias semanais: toda segunda-feira às 20h, com conteúdo sobre vendas, implementação, suporte e empreendedorismo. Parte dos encontros é gravada e outros são exclusivos para participantes.\n2. Central de ajuda: documentação completa sobre a Cardápio Web.\n3. Matriz de concorrentes: reúne os diferenciais da Cardápio Web frente à concorrência.\n\nAlém disso, o onboarding é estruturado e acompanhado pelos especialistas da Cardápio Web.",
    "options": [
      {
        "label": "Quero saber sobre o onboarding",
        "targetId": "027"
      },
      {
        "label": "Quero saber sobre as ferramentas",
        "targetId": "025"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "027",
    "category": "Onboarding",
    "triggers": [
      "onboarding",
      "primeiros dias",
      "como começo",
      "treinamento inicial",
      "shadowing",
      "primeira venda",
      "mentor",
      "check-in",
      "boas-vindas",
      "dias iniciais",
      "autonomia"
    ],
    "question": "Como funciona o onboarding de novos representantes?",
    "answer": "O onboarding leva o recém-chegado a prospectar, vender e acompanhar clientes com autonomia, em fases progressivas:\n\n1. Boas-vindas e imersão institucional (dias 1 a 2): apresentação da Cardápio Web (propósito, números, planos e módulos) e do papel do representante: modelo autônomo, sem vínculo empregatício, expectativas e ferramentas.\n\n2. Domínio do produto e da comissão (dias 3 a 5): treinamento sobre os planos (Mesas, Delivery, Premium) e módulos opcionais, detalhamento do modelo de comissão (base de 10% recorrente, adicionais por implementação e suporte, bônus por churn baixo, teto de 40%) e apresentação do CRM próprio.\n\n3. Capacitação comercial e de prospecção (dias 6 a 8): técnicas de prospecção de donos de restaurantes, bares e deliveries, simulações de pitch, tratamento de objeções e integrações oferecidas (iFood, 99Food, Forkit e Quase Pra Fome).\n\n4. Acompanhamento prático (dias 9 a 12): o novo representante acompanha um representante experiente em reuniões reais de prospecção e observa um onboarding assistido ou híbrido conduzido com um cliente real.\n\n5. Primeira venda supervisionada (dias 13 a 15): conduz a primeira prospecção e venda com apoio de um mentor, seguida de feedback estruturado sobre pontos fortes e a melhorar.\n\n6. Autonomia e acompanhamento contínuo (a partir do dia 16): atua de forma independente, com check-ins semanais no primeiro mês e mensais depois, acompanhando performance de vendas e churn da carteira.",
    "options": [
      {
        "label": "Quero saber sobre a comissão",
        "targetId": "023"
      },
      {
        "label": "Quero saber sobre mentorias e suporte",
        "targetId": "026"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "028",
    "category": "CW Store",
    "triggers": [
      "cw store",
      "cw app store",
      "app store",
      "marketplace de apps",
      "loja de aplicativos",
      "integradora",
      "parceiro de tecnologia",
      "o que é a cw store",
      "apps parceiros"
    ],
    "question": "O que é a CW Store e qual o valor dela para restaurantes e integradoras?",
    "answer": "A CW Store (CW App Store) é o marketplace de aplicativos integrado ao portal da Cardápio Web. Restaurantes descobrem, instalam e gerenciam soluções de parceiros dentro do sistema que já usam, sem configuração técnica manual. Para integradoras e desenvolvedores, é o canal oficial de distribuição de soluções para food service: gestão, marketing, fidelidade, módulo fiscal, atendimento, logística, automação, inteligência artificial, delivery e outras. Conecta três pontas: o restaurante, a integradora que constrói a solução e a Cardápio Web, que fornece marketplace, autenticação e API.\n\nValor para o restaurante:\n1. Expande o que consegue fazer (marketing, fidelidade, gestão, logística, IA) sem contratar desenvolvimento próprio.\n2. Instalação em poucos cliques, direto no sistema que já usa.\n3. O dono decide quais permissões conceder e pode revogar o acesso a qualquer momento.\n\nValor para a integradora e o parceiro comercial:\n1. Acesso direto a uma base de restaurantes que já usa a Cardápio Web, o que reduz o esforço de prospecção.\n2. Fluxo de instalação e autorização padronizado, que acelera o fechamento e a ativação de novos clientes.\n3. Apps públicos ganham vitrine no marketplace e funcionam como gerador de leads.\n4. Possibilidade de publicar apps privados, acessíveis só por link direto, para clientes ou contratos específicos.\n5. Organização por categorias (Marketing, Vendas, Gestão ou Logística), o que ajuda a posicionar cada solução.\n\nArgumentos de venda: fazer parte de um ecossistema já validado por restaurantes, em vez de vender uma integração isolada; menor tempo de implementação comparado a integrações manuais ou personalizadas; e mais valor para todos os restaurantes conforme mais parceiros entram no ecossistema.",
    "options": [
      {
        "label": "Quero saber como funciona o fluxo de instalação",
        "targetId": "029"
      },
      {
        "label": "Quero saber sobre API e pontos de atenção",
        "targetId": "030"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "029",
    "category": "CW Store",
    "triggers": [
      "fluxo cw store",
      "cadastro do app",
      "aprovação do app",
      "publicar app",
      "publicação",
      "instalar app",
      "oauth",
      "token",
      "autorização",
      "prazo de aprovação",
      "7 dias",
      "app público",
      "app privado",
      "eventos em tempo real",
      "webhook"
    ],
    "question": "Como funciona o fluxo de cadastro, aprovação e instalação de um app na CW Store?",
    "answer": "Passo a passo:\n\n1. Cadastro do app: a integradora envia ao suporte da Cardápio Web nome, categoria, descrição, imagens, URLs técnicas e as permissões que o app precisa acessar.\n2. Aprovação: a Cardápio Web analisa primeiro em ambiente de testes (Sandbox) e depois em Produção. Pode levar até 7 dias corridos.\n3. Publicação: aprovado, o app fica disponível no marketplace, público (listado no catálogo) ou privado (só por link direto).\n4. Instalação: o Proprietário do restaurante encontra o app na CW Store e clica em instalar.\n5. Autorização (OAuth): o Proprietário escolhe qual loja será conectada e confirma as permissões solicitadas, de forma parecida com um login social.\n6. Emissão de tokens: o app recebe credenciais vinculadas àquela instalação (aquele app + aquela loja).\n7. Uso da API: com o token, o app consulta e atualiza dados da loja, do catálogo e dos pedidos, dentro do que foi autorizado.\n8. Eventos em tempo real (opcional): o app recebe notificações automáticas de novo pedido ou mudança de status, sem precisar consultar a API o tempo todo.\n\nGestão da instalação: cada loja que instala gera uma instalação própria, com tokens específicos. Se o restaurante desinstalar o app, o acesso daquela loja é revogado imediatamente, sem afetar outras lojas ou outros apps. Reinstalar repete a autorização do zero.",
    "options": [
      {
        "label": "Quero saber sobre API, ambientes e pontos de atenção",
        "targetId": "030"
      },
      {
        "label": "Quero saber o que é a CW Store",
        "targetId": "028"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "030",
    "category": "CW Store",
    "triggers": [
      "api",
      "api aberta",
      "módulos da api",
      "loja",
      "catálogo",
      "pedidos",
      "sandbox",
      "produção",
      "ambiente de teste",
      "permissões",
      "reinstalar app",
      "documentação",
      "integracao@cardapioweb.com",
      "dúvidas técnicas"
    ],
    "question": "Quais são os módulos da API, os ambientes e os pontos de atenção da CW Store?",
    "answer": "A API aberta tem três módulos:\n1. Loja: dados do estabelecimento, horários de funcionamento, formas de pagamento e configurações gerais.\n2. Catálogo: categorias, produtos, complementos e estrutura do cardápio.\n3. Pedidos: consulta, criação, atualização de status e histórico de pedidos.\n\nAmbientes: Sandbox (testes e validação) e Produção (uso real com clientes). Os dois são totalmente isolados: cada um tem seu próprio cadastro, credenciais e instalações, e nada é compartilhado entre eles.\n\nPontos de atenção para o time comercial:\n1. A aprovação de um novo app pode levar até 7 dias corridos, então alinhe esse prazo com clientes e parceiros.\n2. As permissões pedidas no cadastro não podem ser removidas depois, e adicionar novas permissões exige que os clientes já instalados reinstalem o app. Por isso, mapeie bem as permissões antes da publicação.\n\nDúvidas técnicas ou comerciais sobre cadastro e publicação: integracao@cardapioweb.com. Documentação oficial: https://docs.cardapioweb.com/",
    "options": [
      {
        "label": "Quero saber como funciona o fluxo de instalação",
        "targetId": "029"
      },
      {
        "label": "Quero saber o que é a CW Store",
        "targetId": "028"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "031",
    "category": "CW Club",
    "triggers": [
      "cw club",
      "club",
      "programa de parcerias",
      "agências",
      "consultorias",
      "gestor de tráfego",
      "comunidade",
      "mentorias",
      "biblioteca de materiais",
      "e-books",
      "templates"
    ],
    "question": "O que é o CW Club?",
    "answer": "O CW Club é o programa de parcerias da Cardápio Web voltado para agências de marketing, consultorias e gestores de tráfego que atuam no food service. Funciona como um ecossistema colaborativo de crescimento estratégico, com comunidade, conteúdo e suporte contínuo aos parceiros.\n\nPilares do programa:\n1. Comunidades temáticas para troca de experiências entre parceiros.\n2. Biblioteca de materiais com e-books, templates e guias.\n3. Mentorias e treinamentos especializados.\n4. Suporte especializado com canal de feedback.\n5. Atualizações e novidades do setor.\n\nDiferença para o Programa de Representantes: o CW Club fala com agências e consultorias e não tem modelo de comissão. Já os representantes prospectam donos de restaurante diretamente e são remunerados por comissão recorrente.",
    "options": [
      {
        "label": "Quero saber sobre o Programa de Representantes",
        "targetId": "022"
      },
      {
        "label": "Quero saber o que é a CW Store",
        "targetId": "028"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "032",
    "category": "Script de Prospecção",
    "triggers": [
      "script whatsapp",
      "script bant",
      "prospecção representantes",
      "abertura whatsapp",
      "mensagem de abertura",
      "qualificar lead representante",
      "hyorranes",
      "nome do lead",
      "formulário"
    ],
    "question": "Qual é o script de prospecção por WhatsApp (BANT) para leads do programa de representantes?",
    "answer": "Script de prospecção por WhatsApp (BANT adaptado). A abertura é automática; da segunda mensagem em diante, envie manualmente conforme a resposta do lead.\n\n1. Abertura (automática): Olá, NOME_DO_LEAD! Tudo certo? Aqui é o Hyorranes da Cardápio Web. Vi que você preencheu o formulário e demonstrou interesse em conhecer melhor o programa de representantes. Me conta: você hoje já atua com vendas, atendimento ao setor de restaurantes ou possui alguma carteira de clientes?\n\n2. Contexto: Show, NOME_DO_LEAD! Antes da gente seguir, me conta, como você conheceu a Cardápio Web?\n\n3. Need: Hoje você já tem uma carteira de clientes do ramo alimentício?\n\n4. Motivação: Entendi. E o que te fez buscar essa oportunidade como representante agora?\n\n5. Situacional: Hoje você tem disponibilidade pra trabalhar com a Cardápio Web no seu portfólio?\n\n6. Apresentação do programa: Deixa eu te explicar como funciona o programa. Você entra como representante e prospecta donos de restaurante, bar ou delivery pra vender a Cardápio Web. Pra isso, você tem um sistema próprio com CRM, mapa de oportunidades por região e calculadora de proposta com link de pagamento automático. A comissão é recorrente. Além disso, você conta com um onboarding estruturado, acompanhado pelos especialistas da Cardápio Web. Isso atende o que você procura?\n\n7. Verificar dúvida: Antes de seguirmos, ficou alguma dúvida até aqui?\n\n8. Budget (disponibilidade): Me conta, você consegue dedicar tempo pra prospecção ativa nas próximas semanas?\n\n9. Timing: De 0 a 10, qual seu nível de prioridade pra começar como representante nesse momento?\n\n10. Introduzir agendamento: Perfeito! Pra você entender tudo isso na prática e já sair sabendo como funciona o dia a dia, o próximo passo é marcarmos uma vídeo chamada pelo Google Meet. Nela, te explico o sistema, a comissão e tiro todas as suas dúvidas ao vivo.\n\n11. Marcando a reunião: Você tem mais disponibilidade pela manhã ou pela tarde? Perfeito, que tal às X horas no horário de Brasília?\n\n12. 1º gatilho de compromisso: Combinado, NOME_DO_LEAD! Nossa reunião está marcada pra DIA E HORA no horário de Brasília. Posso contar com seu compromisso nessa vídeo chamada?\n\n13. 2º gatilho de compromisso: Perfeito, sei que imprevistos acontecem. Se algo te impedir de participar, você consegue me avisar com antecedência pra eu reorganizar a agenda?\n\n14. Agradecimento: NOME_DO_LEAD, muito obrigada pela sua disponibilidade, foi um prazer falar com você! Fico na torcida aqui pra que dê tudo certo, e no que precisar, é só me chamar por aqui também.",
    "options": [
      {
        "label": "Quero saber sobre o script AIDA (WhatsApp e ligação)",
        "targetId": "033"
      },
      {
        "label": "Quero saber como lidar com objeções do lead",
        "targetId": "034"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "033",
    "category": "Script de Prospecção",
    "triggers": [
      "script aida",
      "aida",
      "prospecção por ligação",
      "script de ligação",
      "ligar para o lead",
      "atenção interesse desejo ação",
      "abertura por ligação"
    ],
    "question": "Qual é o script de prospecção AIDA, por WhatsApp e por ligação?",
    "answer": "Script AIDA (Atenção, Interesse, Desejo, Ação). As mensagens de Desejo e Ação são as mesmas do script BANT (ID 032): apresentação do programa, agendamento, gatilhos de compromisso e agradecimento.\n\nPor WhatsApp (a partir da segunda mensagem, envie manualmente conforme a resposta do lead):\n1. Atenção (automática): mesma abertura da mensagem 1 do ID 032.\n2. Interesse: Hoje você já tem uma carteira de clientes do ramo alimentício? Depois: Hoje você tem disponibilidade pra trabalhar com a Cardápio Web no seu portfólio?\n3. Desejo: apresentação do programa (mensagem 6 do ID 032).\n4. Ação: agendamento da vídeo chamada, os dois gatilhos de compromisso e o agradecimento (mensagens 10 a 14 do ID 032).\n\nPor ligação:\n1. Atenção: Olá, NOME_DO_LEAD! Tudo certo? Aqui é o Hyorranes da Cardápio Web. Vi que você preencheu o formulário e demonstrou interesse em conhecer melhor o programa de representantes, tá lembrado? Você tá com um minutinho pra gente conversar?\n2. Interesse: Show de bola! Antes da gente seguir, me conta, como você conheceu a Cardápio Web? Depois: Perfeito. E hoje você já tem uma carteira de clientes do ramo alimentício?\n3. Desejo: apresentação do programa (mensagem 6 do ID 032).\n4. Ação, agendamento: Você tem mais disponibilidade pela manhã ou pela tarde? Perfeito, que tal às X horas no horário de Brasília?\n5. Gatilho de compromisso: Combinado, NOME_DO_LEAD! Nossa reunião está marcada pra DIA E HORA no horário de Brasília. Posso contar com seu compromisso nessa vídeo chamada? Depois: Perfeito, sei que imprevistos acontecem. Se algo te impedir de participar, você consegue me avisar com antecedência pra eu reorganizar a agenda?\n6. Agradecimento: NOME_DO_LEAD, muito obrigada pela sua disponibilidade, foi um prazer falar com você! Fico na torcida aqui pra que dê tudo certo, e no que precisar, é só me chamar por aqui também.",
    "options": [
      {
        "label": "Quero saber sobre o script BANT por WhatsApp",
        "targetId": "032"
      },
      {
        "label": "Quero saber como lidar com objeções do lead",
        "targetId": "034"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  },
  {
    "id": "034",
    "category": "Objeção",
    "triggers": [
      "objeção",
      "sem tempo pra call",
      "desconfiança da comissão",
      "já tenho outro parceiro",
      "já tenho solução parecida",
      "não é a hora",
      "não tenho tempo",
      "lead representante"
    ],
    "question": "Como lidar com objeções de quem está avaliando entrar no programa de representantes?",
    "answer": "As objeções mais comuns são falta de tempo para uma call, desconfiança sobre o modelo de comissão e a sensação de já ter uma solução parecida com outro parceiro. A lógica para contornar:\n\n1. Agradeça o lead por trazer o ponto e demonstre empatia genuína com a preocupação.\n2. Faça perguntas abertas para entender a causa raiz da objeção.\n3. Peça para o próprio lead relembrar o que mais chamou a atenção dele no programa, reconectando com os benefícios que despertaram o interesse no primeiro contato.\n4. Use números concretos como prova social: mais de 17 mil clientes atendidos e mais de R$ 800 milhões por mês em pedidos movimentados na plataforma.\n\nAntes de chegar ao fechamento, faça uma boa descoberta: a dor do lead, o custo de não agir, quem decide, o tempo disponível, o que ele teme que dê errado e se ele confia na Cardápio Web. Quanto mais completa a descoberta, menos objeções de última hora.",
    "options": [
      {
        "label": "Quero saber sobre exclusividade",
        "targetId": "003"
      },
      {
        "label": "Quero saber sobre a comissão",
        "targetId": "023"
      }
    ],
    "fallback": "Não consegui entender sua pergunta 🙁 Você pode escolher uma das opções abaixo ou digitar de outra forma."
  }
];
