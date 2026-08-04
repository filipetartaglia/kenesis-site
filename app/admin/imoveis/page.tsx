import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockProperties } from "@/lib/mock/properties";

export default function ImoveisPage() {
  const columns = [
    { 
      key: "image", 
      label: "Foto",
      render: (row: any) => (
        <div className="h-10 w-16 overflow-hidden rounded bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {row.image && <img src={row.image} alt={row.title} className="h-full w-full object-cover" />}
        </div>
      )
    },
    { key: "title", label: "Título" },
    { key: "category", label: "Categoria" },
    { key: "city", label: "Cidade" },
    { key: "price", label: "Preço" },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: "actions",
      label: "Ações",
      render: () => (
        <div className="flex items-center gap-3">
          <Link href="/admin/imoveis/editar" className="text-gray-400 hover:text-kenesis-green">
            <Edit size={16} />
          </Link>
          <button className="text-gray-400 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Imóveis" 
        description="Gerencie todos os imóveis do portfólio."
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <SearchInput className="max-w-md flex-1" placeholder="Buscar por título, cidade ou categoria..." />
          <select className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green">
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={mockProperties} />

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">Mostrando 1 a {mockProperties.length} de {mockProperties.length} registros</p>
        <div className="flex gap-2">
          <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 disabled:opacity-50" disabled>Anterior</button>
          <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 disabled:opacity-50" disabled>Próxima</button>
        </div>
      </div>
    </div>
  );
}
