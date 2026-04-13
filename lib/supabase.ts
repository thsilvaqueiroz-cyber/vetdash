import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-only client with service_role — never import this in client components
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardResumo {
  total_atendimentos: number;
  total_ia: number;
  total_humano: number;
  taxa_resolucao_ia: number;
  total_tutores: number;
  atendimentos_semana: number;
  atendimentos_mes: number;
}

export interface AtendimentoPorDia {
  dia: string;
  total: number;
  ia: number;
  humano: number;
  tutores_unicos: number;
}

export interface TopMotivo {
  motivo: string;
  quantidade: number;
  percentual: number;
  resolvidos_ia: number;
  resolvidos_humano: number;
}

export interface Atendimento {
  id: string;
  phone: string;
  conversation_id: string | null;
  motivo: string | null;
  assunto: string | null;
  categoria: string | null;
  resolvido_por: string | null;
  status: string | null;
  resumo_ia: string | null;
  tags: string[];
  started_at: string;
  ended_at: string | null;
  transferred_at: string | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getDashboardResumo(): Promise<DashboardResumo | null> {
  const { data, error } = await supabase
    .from("vw_dashboard_resumo")
    .select("*")
    .single();
  if (error) { console.error("getDashboardResumo", error); return null; }
  return data;
}

export async function getAtendimentosPorDia(days = 30): Promise<AtendimentoPorDia[]> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from("vw_atendimentos_por_dia")
    .select("*")
    .gte("dia", since.split("T")[0])
    .order("dia", { ascending: true });
  if (error) { console.error("getAtendimentosPorDia", error); return []; }
  return data ?? [];
}

export async function getTopMotivos(): Promise<TopMotivo[]> {
  const { data, error } = await supabase
    .from("vw_top_motivos")
    .select("*")
    .order("quantidade", { ascending: false });
  if (error) { console.error("getTopMotivos", error); return []; }
  return data ?? [];
}

export async function getAtendimentos(opts: {
  from?: string;
  to?: string;
  motivo?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Atendimento[]; count: number }> {
  let q = supabase
    .from("atendimentos")
    .select("*", { count: "exact" })
    .order("started_at", { ascending: false })
    .limit(opts.limit ?? 50)
    .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 50) - 1);

  if (opts.from) q = q.gte("started_at", opts.from);
  if (opts.to)   q = q.lte("started_at", opts.to + "T23:59:59");
  if (opts.motivo && opts.motivo !== "todos") q = q.eq("motivo", opts.motivo);
  if (opts.status && opts.status !== "todos") q = q.eq("status", opts.status);

  const { data, error, count } = await q;
  if (error) { console.error("getAtendimentos", error); return { data: [], count: 0 }; }
  return { data: data ?? [], count: count ?? 0 };
}

export async function getAtendimentosRelatorio(from: string, to: string): Promise<Atendimento[]> {
  const { data, error } = await supabase
    .from("atendimentos")
    .select("*")
    .gte("started_at", from)
    .lte("started_at", to + "T23:59:59")
    .order("started_at", { ascending: true });
  if (error) { console.error("getAtendimentosRelatorio", error); return []; }
  return data ?? [];
}
