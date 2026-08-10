import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/user-form";

export const dynamic = "force-dynamic";

export default async function NovoUsuarioPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Novo Usuário"
        description="Adicione um novo membro da equipe (administrador ou corretor)."
      />
      <UserForm supabaseUrl={supabaseUrl} />
    </div>
  );
}
