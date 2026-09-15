# Gibba — Representantes Cadastrados

Dashboard do Programa de Representantes: meta do mês, evolução de cadastros, funil de recrutamento, últimos representantes e aquisição por canal.

Recriado como projeto independente (Vite + React + TypeScript + Tailwind CSS + Recharts) a partir do app publicado em `rose-metrics-dash.lovable.app`, para rodar fora do Lovable. Os dados exibidos são mockados em [src/data/mockData.ts](src/data/mockData.ts) — troque por uma fonte real (API, Supabase etc.) quando quiser.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy no Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

O arquivo `vercel.json` já inclui o rewrite necessário para SPA (todas as rotas caem em `index.html`).
