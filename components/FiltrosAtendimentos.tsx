"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MOTIVOS = ["todos","consulta","emergencia","vacina","exame","duvida_geral","orcamento","retorno","cirurgia","banho_tosa","outro"];
const STATUS  = ["todos","em_andamento","transferido","resolvido","encerrado_sem_resposta"];

interface Props {
  params: { from?: string; to?: string; motivo?: string; status?: string };
}

export function FiltrosAtendimentos({ params }: Props) {
  const router = useRouter();
  const [from,   setFrom]   = useState(params.from   ?? "");
  const [to,     setTo]     = useState(params.to     ?? "");
  const [motivo, setMotivo] = useState(params.motivo ?? "todos");
  const [status, setStatus] = useState(params.status ?? "todos");

  function apply() {
    const p = new URLSearchParams();
    if (from)   p.set("from",   from);
    if (to)     p.set("to",     to);
    if (motivo !== "todos") p.set("motivo", motivo);
    if (status !== "todos") p.set("status", status);
    router.push(`/dashboard/atendimentos?${p}`);
  }

  function clear() {
    setFrom(""); setTo(""); setMotivo("todos"); setStatus("todos");
    router.push("/dashboard/atendimentos");
  }

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">De</label>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Até</label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Motivo</label>
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          {MOTIVOS.map((m) => <option key={m} value={m}>{m === "todos" ? "Todos os motivos" : m.replace("_", " ")}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          {STATUS.map((s) => <option key={s} value={s}>{s === "todos" ? "Todos os status" : s.replace(/_/g, " ")}</option>)}
        </select>
      </div>
      <button onClick={apply}
        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
        Filtrar
      </button>
      <button onClick={clear}
        className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1.5">
        Limpar
      </button>
    </div>
  );
}
