"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { AtendimentoPorDia } from "@/lib/supabase";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props { data: AtendimentoPorDia[] }

export function LineChartAtendimentos({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.dia), "dd/MM", { locale: ptBR }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="total"  stroke="#3b82f6" strokeWidth={2} dot={false} name="Total" />
        <Line type="monotone" dataKey="ia"     stroke="#22c55e" strokeWidth={2} dot={false} name="IA" />
        <Line type="monotone" dataKey="humano" stroke="#f97316" strokeWidth={2} dot={false} name="Humano" />
      </LineChart>
    </ResponsiveContainer>
  );
}
