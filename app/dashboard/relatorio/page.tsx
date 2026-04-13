import { getAtendimentosRelatorio, getDashboardResumo } from "@/lib/supabase";
import { RelatorioView } from "@/components/RelatorioView";
import { format, subDays } from "date-fns";

export const revalidate = 0;

interface Props {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function RelatorioPage({ searchParams }: Props) {
  const params = await searchParams;
  const to   = params.to   ?? format(new Date(), "yyyy-MM-dd");
  const from = params.from ?? format(subDays(new Date(), 30), "yyyy-MM-dd");

  const [atendimentos, resumo] = await Promise.all([
    getAtendimentosRelatorio(from, to),
    getDashboardResumo(),
  ]);

  // Compute period stats
  const total = atendimentos.length;
  const ia    = atendimentos.filter((a) => a.resolvido_por === "ia").length;
  const humano = atendimentos.filter((a) => a.resolvido_por === "humano").length;
  const motivos = atendimentos.reduce((acc: Record<string, number>, a) => {
    const m = a.motivo ?? "outro";
    acc[m] = (acc[m] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <RelatorioView
      from={from}
      to={to}
      atendimentos={atendimentos}
      stats={{ total, ia, humano, motivos }}
      resumoGlobal={resumo}
    />
  );
}
