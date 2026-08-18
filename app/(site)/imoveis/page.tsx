import { Suspense } from "react";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyFilters } from "@/components/site/property-filters";
import { TODOS, findPublishedList, listTipos } from "@/server/properties/repository";

interface SearchParams {
  tipo?: string;
  quartos?: string;
  banheiros?: string;
  precoMin?: string;
  precoMax?: string;
}

export default async function ImoveisPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const filter = searchParams.tipo || TODOS;

  // Filtros numéricos e de preço (aplicados no cliente via findPublishedList)
  const quartosFiltro = searchParams.quartos;
  const banheirosFiltro = searchParams.banheiros;
  const precoMinFiltro = searchParams.precoMin ? Number(searchParams.precoMin) : undefined;
  const precoMaxFiltro = searchParams.precoMax ? Number(searchParams.precoMax) : undefined;

  const allProperties = await findPublishedList({ tipo: filter });
  const tipos = [TODOS, ...(await listTipos())];

  // Aplica filtros adicionais no servidor
  const filtered = allProperties.filter((p) => {
    // Quartos
    if (quartosFiltro) {
      const q = Number(quartosFiltro.replace("+", ""));
      const beds = p.beds ?? 0;
      if (quartosFiltro.endsWith("+")) {
        if (beds < q) return false;
      } else {
        if (beds !== q) return false;
      }
    }
    // Banheiros
    if (banheirosFiltro) {
      const b = Number(banheirosFiltro.replace("+", ""));
      const baths = p.baths ?? 0;
      if (banheirosFiltro.endsWith("+")) {
        if (baths < b) return false;
      } else {
        if (baths !== b) return false;
      }
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-10">
      <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Portfólio completo</span>
      <h1 className="font-display mt-4 text-4xl text-kenesis-greenDark lg:text-5xl">Todos os imóveis</h1>

      <div className="mt-8">
        <Suspense>
          <PropertyFilters tipos={tipos} active={filter} />
        </Suspense>
      </div>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PropertyCard key={p.slug} p={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-medium text-gray-500">Nenhum imóvel encontrado para esses filtros.</p>
          <p className="text-sm text-gray-400">Tente ajustar os critérios de busca ou{" "}
            <a href="/imoveis" className="text-kenesis-green underline">ver todos os imóveis</a>.
          </p>
        </div>
      )}
    </div>
  );
}