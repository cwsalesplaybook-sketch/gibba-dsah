// Todas as chaves de localStorage que o dashboard usa (tudo que é editado só
// no navegador, sem vir do Pipedrive). "Resetar site" apaga exatamente essas.
const RESETTABLE_KEYS = [
  "gibba:goal", // metas do mês (Meta 1/2/3, alvos)
  "gibba:manualAdjustment", // Meta 1, ajuste manual
  "gibba:inicio", // Meta 2, "Cadastros no mês" e ajuste manual da Meta 3
  "gibba:templateFavorites", // favoritos da aba Templates
  "gibba:contratos", // tags, comentários e leads manuais da Assinatura de Contrato
  "puma:luzia", // o que o Pedro aprendeu e o feedback (Ajudou/Não era isso)
  "puma:luzia:chat", // histórico da conversa com o Pedro
  "gibba:followups", // tags, comentários e leads manuais do Follow-up
];

export function resetSite() {
  for (const key of RESETTABLE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // localStorage indisponível (modo privado, etc.), nada a fazer
    }
  }
  window.location.reload();
}
