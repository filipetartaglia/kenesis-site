import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { SearchInput } from "@/components/admin/search-input";
import { findAllForAdmin } from "@/server/users/repository";
import { UserStatusToggle } from "@/components/admin/user-status-toggle";
import { requirePermission } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const currentUser = await requirePermission("users.read");
  const usuarios = await findAllForAdmin();

  const canCreate = currentUser.isMaster || currentUser.permissions.includes("users.create");
  const canUpdate = currentUser.isMaster || currentUser.permissions.includes("users.update");
  const canDeactivate = currentUser.isMaster || currentUser.permissions.includes("users.deactivate");

  const columns = [
    { 
      key: "name", 
      label: "Nome",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <span>{row.name}</span>
          {row.isMaster && (
            <span className="rounded bg-kenesis-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-kenesis-green">
              Master
            </span>
          )}
        </div>
      )
    },
    { key: "email", label: "E-mail" },
    { key: "phone", label: "Telefone" },
    { key: "role", label: "Nível" },
    { 
      key: "isActive", 
      label: "Status",
      render: (row: any) => {
        if (row.isMaster || !canDeactivate) {
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {row.isActive ? "Ativo" : "Inativo"}
            </span>
          );
        }
        return <UserStatusToggle id={row.id} isActive={row.isActive} statusLabel={row.isActive ? "Ativo" : "Inativo"} />;
      }
    },
    {
      key: "actions",
      label: "Ações",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {canUpdate && (
            <Link href={`/admin/usuarios/editar/${row.id}`} className="text-gray-400 hover:text-kenesis-green" title="Editar">
              <Edit size={16} />
            </Link>
          )}
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
          canCreate ? (
            <Link href="/admin/usuarios/novo" className="flex items-center gap-2 rounded-lg bg-kenesis-green px-4 py-2 text-sm font-medium text-white hover:bg-kenesis-greenDark">
              <Plus size={16} />
              Novo Usuário
            </Link>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput className="max-w-md flex-1" placeholder="Buscar por nome ou e-mail..." />
      </div>

      <DataTable columns={columns} data={usuarios} />
    </div>
  );
}
