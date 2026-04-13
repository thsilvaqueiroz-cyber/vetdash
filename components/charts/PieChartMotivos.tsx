"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { TopMotivo } from "@/lib/supabase";

const COLORS = ["#22c55e","#3b82f6","#f97316","#a855f7","#ec4899","#14b8a6","#f59e0b"];

interface Props { data: TopMotivo[] }

export function PieChartMotivos({ data }: Props) {
  const formatted = data.map((d) => ({
    name: d.motivo?.replace("_", " "),
    value: d.quantidade,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={formatted} cx="50%" cy="45%" outerRadius={75}
          dataKey="value" nameKey="name" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false} fontSize={11}>
          {formatted.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
