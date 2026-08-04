import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge } from "@/components/admin/status-badge";
import { findAllForAdmin } from "@/server/users/repository";

// Painel nunca serve página em cache: um usuário desativado precisa sumir da
// lista no mesmo instante, não na próxima revalidação.
export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const usuarios = await findAllForAdmin();

  const columns = [
    { key: "name", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "phone", label: "Telefone" },
    { key: "role", label: "Cargo" },
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
          <button className="text-gray-400 hover:text-kenesis-green">
            <Edit size={16} />
          </button>
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
        title="Usuários" 
        description="Gerencie os administradores e corretores do sistema."
        action={
          <button className="flex items-center gap-2 rounded-lg bg-kenesis-green px-4 py-2 text-sm font-medium text-white hover:bg-kenesis-greenDark">
            <Plus size={16} />
            Novo Usuário
          </button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput className="max-w-md flex-1" placeholder="Buscar por nome ou e-mail..." />
      </div>

      <DataTable columns={columns} data={usuarios} />
    </div>
  );
}
