"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Atendimento, DashboardResumo } from "@/lib/supabase";
import { Printer } from "lucide-react";

interface Stats {
  total: number;
  ia: number;
  humano: number;
  motivos: Record<string, number>;
}

interface Props {
  from: string;
  to: string;
  atendimentos: Atendimento[];
  stats: Stats;
  resumoGlobal: DashboardResumo | null;
}

export function RelatorioView({ from, to, atendimentos, stats }: Props) {
  const router = useRouter();
  const [inputFrom, setInputFrom] = useState(from);
  const [inputTo,   setInputTo]   = useState(to);

  function aplicar() {
    router.push(`/dashboard/relatorio?from=${inputFrom}&to=${inputTo}`);
  }

  const taxaIA = stats.total > 0 ? ((stats.ia / stats.total) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">

      {/* Controls — hidden on print */}
      <div className="no-print flex flex-wrap items-end gap-4 bg-white rounded-xl border border-gray-200 p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório de Atendimentos</h1>
          <p className="text-sm text-gray-500">Selecione o período e clique em Gerar PDF</p>
        </div>
        <div className="flex flex-wrap gap-3 items-end ml-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">De</label>
            <input type="date" value={inputFrom} onChange={(e) => setInputFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Até</label>
            <input type="date" value={inputTo} onChange={(e) => setInputTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button onClick={aplicar}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg">
            Aplicar período
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-lg">
            <Printer className="w-4 h-4" />
            Gerar PDF
          </button>
        </div>
      </div>

      {/* Report content — visible on screen AND print */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6" id="relatorio-content">

        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🐾</span>
              <h2 className="text-xl font-bold text-gray-900">Hospital Veterinário Doctor Vet</h2>
            </div>
            <p className="text-gray-500 text-sm">Av. Dom Severino, 3060 — Teresina, PI</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p className="font-semibold text-gray-800">Relatório de Atendimentos</p>
            <p>Período: {format(parseISO(from), "dd/MM/yyyy", { locale: ptBR })} a {format(parseISO(to), "dd/MM/yyyy", { locale: ptBR })}</p>
            <p>Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiBox label="Total de Atendimentos" value={stats.total} color="blue" />
          <KpiBox label="Resolvidos pela IA"     value={`${stats.ia} (${taxaIA}%)`} color="green" />
          <KpiBox label="Transferidos p/ Humano"  value={stats.humano} color="orange" />
          <KpiBox label="Taxa Resolução IA"       value={`${taxaIA}%`} color="purple" />
        </div>

        {/* Motivos table */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Distribuição por Motivo</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 border border-gray-200 font-medium text-gray-600">Motivo</th>
                <th className="text-right px-3 py-2 border border-gray-200 font-medium text-gray-600">Quantidade</th>
                <th className="text-right px-3 py-2 border border-gray-200 font-medium text-gray-600">% do total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.motivos)
                .sort(([, a], [, b]) => b - a)
                .map(([motivo, qtd]) => (
                  <tr key={motivo}>
                    <td className="px-3 py-2 border border-gray-200 capitalize">{motivo.replace("_", " ")}</td>
                    <td className="px-3 py-2 border border-gray-200 text-right">{qtd}</td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {stats.total > 0 ? ((qtd / stats.total) * 100).toFixed(1) : "0.0"}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Atendimentos list */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Detalhamento dos Atendimentos</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-2 py-2 border border-gray-200">Data</th>
                <th className="text-left px-2 py-2 border border-gray-200">Telefone</th>
                <th className="text-left px-2 py-2 border border-gray-200">Assunto</th>
                <th className="text-left px-2 py-2 border border-gray-200">Motivo</th>
                <th className="text-left px-2 py-2 border border-gray-200">Categoria</th>
                <th className="text-left px-2 py-2 border border-gray-200">Resolvido por</th>
                <th className="text-left px-2 py-2 border border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {atendimentos.map((a) => (
                <tr key={a.id} className="even:bg-gray-50">
                  <td className="px-2 py-1.5 border border-gray-200 whitespace-nowrap">
                    {format(new Date(a.started_at), "dd/MM/yy HH:mm")}
                  </td>
                  <td className="px-2 py-1.5 border border-gray-200 font-mono">{a.phone}</td>
                  <td className="px-2 py-1.5 border border-gray-200 max-w-[150px]">{a.assunto ?? "—"}</td>
                  <td className="px-2 py-1.5 border border-gray-200 capitalize">{a.motivo?.replace("_", " ") ?? "—"}</td>
                  <td className="px-2 py-1.5 border border-gray-200 capitalize">{a.categoria ?? "—"}</td>
                  <td className="px-2 py-1.5 border border-gray-200">
                    {a.resolvido_por === "ia" ? "🤖 IA" : a.resolvido_por === "humano" ? "👤 Humano" : "—"}
                  </td>
                  <td className="px-2 py-1.5 border border-gray-200">{a.status?.replace(/_/g, " ") ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {atendimentos.length === 0 && (
            <p className="text-center text-gray-400 py-6">Nenhum atendimento no período selecionado.</p>
          )}
        </div>

        {/* Footer print-only */}
        <div className="print-only border-t pt-3 text-xs text-gray-400 text-center">
          Doctor Vet — Relatório gerado automaticamente em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
      </div>
    </div>
  );
}

function KpiBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100", green: "bg-green-50 border-green-100",
    orange: "bg-orange-50 border-orange-100", purple: "bg-purple-50 border-purple-100",
  };
  const text: Record<string, string> = {
    blue: "text-blue-700", green: "text-green-700", orange: "text-orange-700", purple: "text-purple-700",
  };
  return (
    <div className={`rounded-lg border p-3 ${bg[color]}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${text[color]}`}>{value}</p>
    </div>
  );
}
