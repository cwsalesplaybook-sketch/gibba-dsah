# PUMA — Insights & Resultados

Dashboard do Programa de Representantes: metas do mês e forecast, evolução de cadastros (Pipedrive), controle diário da assinatura de contratos, templates de mensagens e playbook.

Stack: Vite + React + TypeScript + Tailwind CSS + Recharts. As rotas em `api/` são funções serverless da Vercel que consultam o Pipedrive com a variável `PIPEDRIVE_API_TOKEN` (nunca exposta no navegador).

## Rodando localmente

```bash
npm install
npm run dev
```

As rotas `/api/*` só existem na Vercel; no `npm run dev` os cards que dependem do Pipedrive mostram aviso de erro.

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy no Vercel

O projeto Vercel é `gibba-dashboard` (nome interno mantido; o nome exibido é PUMA). Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.

O arquivo `vercel.json` já inclui o rewrite necessário para SPA (todas as rotas caem em `index.html`).
