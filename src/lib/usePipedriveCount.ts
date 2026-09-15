import { useCallback, useEffect, useState } from "react";

type PipedriveStats = {
  count: number;
  month: string;
  updatedAt: string;
};

export function usePipedriveCount() {
  const [data, setData] = useState<PipedriveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch("/api/pipedrive-stats", { signal: controller.signal });
      clearTimeout(timeout);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error ?? "Erro ao buscar dados do Pipedrive");
      }
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Pipedrive demorou demais pra responder (timeout)");
      } else {
        setError(err instanceof Error ? err.message : "Erro ao buscar dados do Pipedrive");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
