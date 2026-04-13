import type { Atendimento } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColor: Record<string, string> = {
  em_andamento:          "bg-yellow-100 text-yellow-800",
  encerrado_sem_resposta:"bg-gray-100 text-gray-600",
  transferido:           "bg-blue-100 text-blue-800",
  resolvido:             "bg-green-100 text-green-700",
};

const resolvidoPorColor: Record<string, string> = {
  ia:     "bg-green-100 text-green-700",
  humano: "bg-orange-100 text-orange-700",
};

interface Props {
  data: Atendimento[];
  showPhone?: boolean;
}

export function TabelaAtendimentos({ data, showPhone }: Props) {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-8">Nenhum atendimento encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {showPhone && <th className="text-left py-2 px-2 font-medium text-gray-500">Telefone</th>}
            <th className="text-left py-2 px-2 font-medium text-gray-500">Assunto</th>
            <th className="text-left py-2 px-2 font-medium text-gray-500">Motivo</th>
            <th className="text-left py-2 px-2 font-medium text-gray-500">Categoria</th>
            <th className="text-left py-2 px-2 font-medium text-gray-500">Resolvido por</th>
            <th className="text-left py-2 px-2 font-medium text-gray-500">Status</th>
            <th className="text-left py-2 px-2 font-medium text-gray-500">Data</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {showPhone && (
                <td className="py-2.5 px-2 text-gray-600 font-mono text-xs">{a.phone}</td>
              )}
              <td className="py-2.5 px-2 text-gray-800 max-w-[200px] truncate" title={a.assunto ?? ""}>
                {a.assunto ?? "—"}
              </td>
              <td className="py-2.5 px-2">
                <span className="capitalize text-gray-600">{a.motivo?.replace("_", " ") ?? "—"}</span>
              </td>
              <td className="py-2.5 px-2">
                <span className="capitalize text-gray-600">{a.categoria ?? "—"}</span>
              </td>
              <td className="py-2.5 px-2">
                {a.resolvido_por ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resolvidoPorColor[a.resolvido_por] ?? "bg-gray-100 text-gray-600"}`}>
                    {a.resolvido_por === "ia" ? "🤖 IA" : "👤 Humano"}
                  </span>
                ) : "—"}
              </td>
              <td className="py-2.5 px-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
                  {a.status?.replace("_", " ") ?? "—"}
                </span>
              </td>
              <td className="py-2.5 px-2 text-gray-500 whitespace-nowrap text-xs">
                {format(new Date(a.started_at), "dd/MM/yy HH:mm", { locale: ptBR })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
