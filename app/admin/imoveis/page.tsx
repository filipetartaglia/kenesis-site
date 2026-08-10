import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { PropertyStatusToggle } from "@/components/admin/property-status-toggle";
import { PropertyFeaturedToggle } from "@/components/admin/property-featured-toggle";
import { FilterSelect } from "@/components/admin/filter-select";
import { findAllForAdmin } from "@/server/properties/actions";
import { getImageUrl } from "@/server/properties/repository";

export const dynamic = "force-dynamic";

function formatPrice(cents: number | null, visible: boolean): string {
  if (!visible || cents === null) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatType(type: string): string {
  const map: Record<string, string> = {
    casa: "Casa",
    apartamento: "Apartamento",
    terreno: "Terreno",
    empreendimento: "Empreendimento",
    cobertura: "Cobertura",
    comercial: "Comercial",
  };
  return map[type] || type;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
  { value: "reservado", label: "Reservado" },
  { value: "vendido", label: "Vendido" },
  { value: "arquivado", label: "Arquivado" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "empreendimento", label: "Empreendimento" },
  { value: "cobertura", label: "Cobertura" },
  { value: "comercial", label: "Comercial" },
];

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tipo?: string }>;
}) {
  const params = await searchParams;
  const filters = {
    search: params.q || undefined,
    status: params.status || undefined,
    tipo: params.tipo || undefined,
  };

  const allProperties = await findAllForAdmin(filters);
  const hasFilters = !!(filters.search || filters.status || filters.tipo);

  const selectClass =
    "rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green";

  const columns = [
    {
      key: "image",
      label: "Foto",
      render: (row: any) => (
        <div className="h-10 w-16 overflow-hidden rounded bg-gray-100">
          {row.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getImageUrl(row.coverImage)} alt={row.title} className="h-full w-full object-cover" />
          )}
        </div>
      ),
    },
    { key: "title", label: "Título" },
    {
      key: "propertyType",
      label: "Tipo",
      render: (row: any) => formatType(row.propertyType),
    },
    {
      key: "city",
      label: "Cidade",
      render: (row: any) =>
        [row.neighborhood, row.city].filter(Boolean).join(", "),
    },
    {
      key: "price",
      label: "Preço",
      render: (row: any) => formatPrice(row.priceCents, row.priceVisible),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <PropertyStatusToggle id={row.id} status={row.status} />
          <PropertyFeaturedToggle id={row.id} isFeatured={row.isFeatured} />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/imoveis/editar/${row.id}`}
            className="text-gray-400 hover:text-kenesis-green"
          >
            <Edit size={16} />
          </Link>
          <DeletePropertyButton id={row.id} title={row.title} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Imóveis"
        description={`${allProperties.length} imóvel(is)${hasFilters ? " encontrado(s)" : " no portfólio"}.`}
        action={
          <Link
            href="/admin/imoveis/novo"
            className="flex items-center gap-2 rounded-lg bg-kenesis-green px-4 py-2 text-sm font-medium text-white hover:bg-kenesis-greenDark"
          >
            <Plus size={16} />
            Novo Imóvel
          </Link>
        }
      />

      {/* Busca e Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <form className="relative max-w-md flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              name="q"
              defaultValue={filters.search || ""}
              placeholder="Buscar por título ou slug..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
            />
          </form>

          <FilterSelect
            name="status"
            defaultValue={filters.status || ""}
            options={STATUS_OPTIONS}
            className={selectClass}
          />

          <FilterSelect
            name="tipo"
            defaultValue={filters.tipo || ""}
            options={TYPE_OPTIONS}
            className={selectClass}
          />
        </div>

        {hasFilters && (
          <Link
            href="/admin/imoveis"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Limpar filtros
          </Link>
        )}
      </div>

      <DataTable columns={columns} data={allProperties} />
    </div>
  );
}
