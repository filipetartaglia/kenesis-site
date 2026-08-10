import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/user-form";
import { getUserById } from "@/server/users/actions";
import { requirePermission } from "@/server/auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requirePermission("users.update");
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return notFound();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Usuário"
        description="Atualize as informações do membro da equipe."
      />
      <UserForm initialData={user} supabaseUrl={supabaseUrl} currentUser={currentUser} />
    </div>
  );
}
