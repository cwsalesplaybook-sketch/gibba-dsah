import { useCallback, useEffect, useState } from "react";

export type ContractRow = {
  id: number;
  name: string;
  owner: string | null;
  sentAt: string | null;
  signedAt: string | null;
  manual?: boolean; // lead adicionado à mão (não vem do Pipedrive)
};

type ContractsResponse = {
  stageId: number;
  windowDays: number;
  owner: string;
  hidden: { pending: number; signed: number };
  pending: ContractRow[];
  signed: ContractRow[];
  updatedAt: string;
};

const REFRESH_MS = 5 * 60 * 1000; // controle diário: atualiza sozinho a cada 5 minutos
const TIME_ZONE = "America/Sao_Paulo";

export function useContracts() {
  const [data, setData] = useState<ContractsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch("/api/contracts", { signal: controller.signal });
      clearTimeout(timeout);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error ?? "Erro ao buscar contratos no Pipedrive");
      }
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Pipedrive demorou demais pra responder (timeout)");
      } else {
        setError(err instanceof Error ? err.message : "Erro ao buscar contratos no Pipedrive");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return { data, loading, error, refresh };
}

// ---- Datas (sempre no horário de Brasília) --------------------------------

export function dayKey(iso: string | Date) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE }); // AAAA-MM-DD
}

export function daysBetween(fromIso: string, to: string | Date = new Date()) {
  const [fy, fm, fd] = dayKey(fromIso).split("-").map(Number);
  const [ty, tm, td] = dayKey(to).split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000);
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

export function formatWaiting(days: number) {
  if (days <= 0) return "Hoje";
  return days === 1 ? "1 dia" : `${days} dias`;
}
