import { useCallback, useEffect, useState } from "react";

export type FollowupRow = {
  id: number;
  name: string;
  owner: string | null;
  stageId: number;
  stageName: string;
  enteredStageAt: string | null;
  manual?: boolean; // lead adicionado à mão (não vem do Pipedrive)
};

type FollowupsResponse = {
  pipelineId: number;
  stages: { id: number; name: string }[];
  owner: string;
  hidden: number;
  rows: FollowupRow[];
  updatedAt: string;
};

const REFRESH_MS = 5 * 60 * 1000; // atualiza sozinho a cada 5 minutos, igual Assinatura de Contrato

export function useFollowups() {
  const [data, setData] = useState<FollowupsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch("/api/followups", { signal: controller.signal });
      clearTimeout(timeout);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error ?? "Erro ao buscar follow-ups no Pipedrive");
      }
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Pipedrive demorou demais pra responder (timeout)");
      } else {
        setError(err instanceof Error ? err.message : "Erro ao buscar follow-ups no Pipedrive");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return { data, loading, error, refresh };
}
