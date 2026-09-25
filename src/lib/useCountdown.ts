import { useEffect, useState } from "react";

// Card "Até o fechamento" do redesign: contagem regressiva até o fim do mês, viva
// (atualiza a cada segundo), sem precisar de mais nenhuma fonte de dado.
export function useCountdown(deadline: Date) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = Math.max(0, deadline.getTime() - now);
  const pad = (n: number) => String(n).padStart(2, "0");

  const days = Math.floor(msLeft / 86_400_000);
  const hours = Math.floor((msLeft % 86_400_000) / 3_600_000);
  const minutes = Math.floor((msLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((msLeft % 60_000) / 1000);

  return [
    { unit: "dias", value: pad(days) },
    { unit: "horas", value: pad(hours) },
    { unit: "min", value: pad(minutes) },
    { unit: "seg", value: pad(seconds) },
  ];
}
