import Link from "next/link";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
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

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    rascunho: "Rascunho",
    publicado: "Ativo",
    reservado: "Reservado",
    vendido: "Vendido",
    arquivado: "Arquivado",
  };
  return map[status] || status;
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

export default async function ImoveisPage() {
  const allProperties = await findAllForAdmin();

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
          <StatusBadge status={formatStatus(row.status)} />
          {row.isFeatured && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
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
        description={`${allProperties.length} imóveis no portfólio.`}
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

      <DataTable columns={columns} data={allProperties} />
    </div>
  );
}
