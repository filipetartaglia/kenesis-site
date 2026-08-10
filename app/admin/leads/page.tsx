import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { LeadDeleteButton } from "@/components/admin/lead-delete-button";
import { FilterSelect } from "@/components/admin/filter-select";
import { findAllLeadsForAdmin } from "@/server/leads/actions";
import { Eye } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "novo", label: "Novo" },
  { value: "em_atendimento", label: "Em Atendimento" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const filters = {
    search: params.q || undefined,
    status: params.status || undefined,
  };

  const leads = await findAllLeadsForAdmin(filters);
  const hasFilters = !!(filters.search || filters.status);

  const columns = [
    { key: "name", label: "Nome" },
    { 
      key: "contact", 
      label: "Contato",
      render: (row: any) => (
        <div className="flex flex-col">
          {row.email && <span>{row.email}</span>}
          {row.phone && <span className="text-xs text-gray-500">{row.phone}</span>}
        </div>
      )
    },
    { 
      key: "property", 
      label: "Interesse",
      render: (row: any) => row.propertyTitle ? (
        <Link href={`/imoveis/${row.propertySlug}`} target="_blank" className="hover:underline hover:text-kenesis-green">
          {row.propertyTitle}
        </Link>
      ) : (
        <span className="text-gray-400">Contato Geral</span>
      )
    },
    { 
      key: "createdAt", 
      label: "Data",
      render: (row: any) => new Date(row.createdAt).toLocaleDateString("pt-BR")
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <LeadStatusSelect id={row.id} status={row.status} />
    },
    {
      key: "actions",
      label: "Detalhes",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/leads/${row.id}`} className="text-gray-400 hover:text-kenesis-green" title="Ver detalhes">
            <Eye size={16} />
          </Link>
          <LeadDeleteButton id={row.id} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Leads" 
        description={`${leads.length} lead(s)${hasFilters ? " encontrado(s)" : " no sistema"}.`}
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
              placeholder="Buscar por nome ou e-mail..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
            />
          </form>

          <FilterSelect
            name="status"
            defaultValue={filters.status || ""}
            options={STATUS_OPTIONS}
            className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
          />
        </div>

        {hasFilters && (
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Limpar filtros
          </Link>
        )}
      </div>

      <DataTable columns={columns} data={leads} />
    </div>
  );
}
