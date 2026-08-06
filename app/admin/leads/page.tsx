import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockLeads } from "@/lib/mock/leads";
import { Eye } from "lucide-react";

export default function LeadsPage() {
  const columns = [
    { key: "name", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "phone", label: "Telefone" },
    { key: "property", label: "Interesse" },
    { key: "source", label: "Origem" },
    { 
      key: "createdAt", 
      label: "Data",
      render: (row: any) => new Date(row.createdAt).toLocaleDateString("pt-BR")
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: "actions",
      label: "Detalhes",
      render: () => (
        <button className="text-gray-400 hover:text-kenesis-green">
          <Eye size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Leads" 
        description="Acompanhe os contatos e interesses recebidos pelo site."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <SearchInput className="max-w-md flex-1" placeholder="Buscar por nome, e-mail ou imóvel..." />
          <select className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green">
            <option value="">Status</option>
            <option value="novo">Novo</option>
            <option value="em atendimento">Em atendimento</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={mockLeads} />
    </div>
  );
}
