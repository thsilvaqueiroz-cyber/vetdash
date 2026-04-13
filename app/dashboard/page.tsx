import {
  getDashboardResumo,
  getAtendimentosPorDia,
  getTopMotivos,
  getAtendimentos,
} from "@/lib/supabase";
import { MetricCard } from "@/components/MetricCard";
import { LineChartAtendimentos } from "@/components/charts/LineChartAtendimentos";
import { PieChartMotivos } from "@/components/charts/PieChartMotivos";
import { BarChartCategorias } from "@/components/charts/BarChartCategorias";
import { TabelaAtendimentos } from "@/components/TabelaAtendimentos";
import { Bot, Users, UserCheck, TrendingUp } from "lucide-react";

export const revalidate = 60; // revalida a cada 60s

export default async function DashboardPage() {
  const [resumo, porDia, motivos, { data: recentes }] = await Promise.all([
    getDashboardResumo(),
    getAtendimentosPorDia(30),
    getTopMotivos(),
    getAtendimentos({ limit: 20 }),
  ]);

  // Derive categorias from motivos data for bar chart
  const categorias = recentes.reduce((acc: Record<string, number>, a) => {
    const cat = a.categoria ?? "outro";
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});
  const categoriaData = Object.entries(categorias).map(([name, total]) => ({ name, total }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel de Atendimentos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Dados em tempo real — Hospital Veterinário Doctor Vet</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Atendimentos"
          value={resumo?.total_atendimentos ?? 0}
          subtitle={`${resumo?.atendimentos_semana ?? 0} esta semana`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Resolvidos pela IA"
          value={`${resumo?.taxa_resolucao_ia?.toFixed(0) ?? 0}%`}
          subtitle={`${resumo?.total_ia ?? 0} atendimentos`}
          icon={<Bot className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Transferidos p/ Humano"
          value={resumo?.total_humano ?? 0}
          subtitle="atendimentos transferidos"
          icon={<UserCheck className="w-5 h-5" />}
          color="orange"
        />
        <MetricCard
          title="Tutores Únicos"
          value={resumo?.total_tutores ?? 0}
          subtitle={`${resumo?.atendimentos_mes ?? 0} atend. este mês`}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-4">Atendimentos por dia (últimos 30 dias)</h2>
          <LineChartAtendimentos data={porDia} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-4">Top Motivos</h2>
          <PieChartMotivos data={motivos} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-4">Por Categoria</h2>
          <BarChartCategorias data={categoriaData} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-2">Distribuição IA vs Humano</h2>
          <div className="space-y-3 mt-4">
            {motivos.map((m) => (
              <div key={m.motivo}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-700">{m.motivo?.replace("_", " ")}</span>
                  <span className="font-medium">{m.quantidade}</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="bg-green-500"
                    style={{ width: `${m.quantidade > 0 ? (m.resolvidos_ia / m.quantidade) * 100 : 0}%` }}
                  />
                  <div
                    className="bg-orange-400"
                    style={{ width: `${m.quantidade > 0 ? (m.resolvidos_humano / m.quantidade) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                  <span>🟢 IA: {m.resolvidos_ia}</span>
                  <span>🟠 Humano: {m.resolvidos_humano}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela recentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Últimos Atendimentos</h2>
          <a href="/dashboard/atendimentos" className="text-sm text-green-600 hover:underline">
            Ver todos →
          </a>
        </div>
        <TabelaAtendimentos data={recentes} />
      </div>
    </div>
  );
}
