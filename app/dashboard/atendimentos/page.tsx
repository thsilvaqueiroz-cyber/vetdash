import { getAtendimentos } from "@/lib/supabase";
import { TabelaAtendimentos } from "@/components/TabelaAtendimentos";
import { FiltrosAtendimentos } from "@/components/FiltrosAtendimentos";

export const revalidate = 0;

interface Props {
  searchParams: Promise<{
    from?: string;
    to?: string;
    motivo?: string;
    status?: string;
    page?: string;
  }>;
}

const LIMIT = 50;

export default async function AtendimentosPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const offset = (page - 1) * LIMIT;

  const { data, count } = await getAtendimentos({
    from: params.from,
    to: params.to,
    motivo: params.motivo,
    status: params.status,
    limit: LIMIT,
    offset,
  });

  const totalPages = Math.ceil((count ?? 0) / LIMIT);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Atendimentos</h1>
        <p className="text-sm text-gray-500 mt-0.5">{count} registros encontrados</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <FiltrosAtendimentos params={params} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <TabelaAtendimentos data={data} showPhone />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Anterior
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Próxima →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
