import { PropertyCard } from "@/components/site/property-card";
import { PropertyFilters } from "@/components/site/property-filters";
import { TODOS, findPublishedList, listTipos } from "@/server/properties/repository";

export default async function ImoveisPage(props: { searchParams: Promise<{ tipo?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams.tipo || TODOS;
  const allProperties = await findPublishedList({ tipo: filter });
  const tipos = [TODOS, ...(await listTipos())];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-10">
      <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Portfólio completo</span>
      <h1 className="font-display mt-4 text-4xl text-kenesis-greenDark lg:text-5xl">Todos os imóveis</h1>

      <div className="mt-8">
        <PropertyFilters tipos={tipos} active={filter} />
      </div>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {allProperties.map((p) => (
          <PropertyCard key={p.slug} p={p} />
        ))}
      </div>

      {allProperties.length === 0 && (
        <p className="mt-10 text-sm text-neutral-500">Nenhum imóvel encontrado para esse filtro.</p>
      )}
    </div>
  );
}
