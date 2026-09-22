import { goal as initialGoal, inicioSeed, monthlyGoals } from "@/data/mockData";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import { usePipedriveCount } from "@/lib/usePipedriveCount";

const MONTH_NAMES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function pct(from: number, to: number) {
  return from > 0 ? ((to - from) / from) * 100 : null;
}

export function formatPct(value: number) {
  return Math.abs(value).toFixed(1).replace(".", ",") + "%";
}

export function useMetasData() {
  // Mesmas chaves da página Metas: mexeu numa, reflete na outra.
  const [goal, setGoal] = useLocalStorageState("gibba:goal", initialGoal);
  const [manualAdjustment, setManualAdjustment] = useLocalStorageState("gibba:manualAdjustment", 0);
  const [extra, setExtra] = useLocalStorageState("gibba:inicio", inicioSeed);
  const pipedrive = usePipedriveCount();

  const now = new Date();
  const monthIndex = now.getMonth();
  const daysInMonth = new Date(now.getFullYear(), monthIndex + 1, 0).getDate();
  const daysElapsed = now.getDate();
  const daysLeft = Math.max(1, daysInMonth - now.getDate() + 1);

  const targets = [0, 1, 2].map(
    (i) => goal.tiers[i]?.target ?? initialGoal.tiers[i].target
  );

  const pipedriveCount = pipedrive.data?.count ?? 0;
  const registered = pipedriveCount + manualAdjustment;
  // Meta 3 (ativações) usa a mesma contagem do Pipedrive que a Meta 1, mais um ajuste
  // manual próprio — igual a Meta 1, confirmado com a Gabi em 2026-09-22.
  // `?? 0` cobre quem já tinha "gibba:inicio" salvo antes desse campo existir.
  const ativacoesAjuste = extra.ativacoesAjuste ?? 0;
  const activated = pipedriveCount + ativacoesAjuste;
  const counts = [registered, extra.sistema, activated];

  // Projeção linear simples: ritmo médio diário × dias restantes do mês.
  const dailyPace = registered / daysElapsed;
  const projection = Math.round(registered + dailyPace * (daysLeft - 1));

  // Comparações "vs. mês anterior" só existem quando o mês anterior tem dado.
  const byMonth = pipedrive.data?.byMonth ?? [];
  const prevValue = monthIndex > 0 ? byMonth[monthIndex - 1]?.value ?? 0 : 0;
  const prevDaysInMonth = new Date(now.getFullYear(), monthIndex, 0).getDate();
  const projectionDelta = pct(prevValue, projection);
  const dailyAvg = registered / daysElapsed;
  const dailyAvgDelta = pct(prevValue / prevDaysInMonth, dailyAvg);

  const chartData = byMonth.map((item, index) => ({
    month: item.month,
    value: item.value,
    goal: index === monthIndex ? targets[0] : monthlyGoals[index] ?? targets[0],
    current: index === monthIndex,
  }));

  return {
    goal,
    setGoal,
    manualAdjustment,
    setManualAdjustment,
    extra,
    setExtra,
    pipedrive,
    pipedriveCount,
    ativacoesAjuste,
    targets,
    counts,
    registered,
    projection,
    projectionDelta,
    dailyAvg,
    dailyAvgDelta,
    chartData,
    date: {
      daysInMonth,
      daysElapsed,
      daysLeft,
      monthName: MONTH_NAMES[monthIndex],
      year: now.getFullYear(),
      day: now.getDate(),
      lastDayLabel: `${String(daysInMonth).padStart(2, "0")}/${String(monthIndex + 1).padStart(2, "0")}`,
    },
  };
}

export type MetasData = ReturnType<typeof useMetasData>;
