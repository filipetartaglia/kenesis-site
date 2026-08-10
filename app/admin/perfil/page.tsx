import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProfileForm } from "@/components/admin/profile-form";
import { requireAuth } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const currentUser = await requireAuth();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Meu Perfil"
        description="Atualize suas informações pessoais, de contato e sua senha de acesso."
      />
      
      <ProfileForm user={currentUser} supabaseUrl={supabaseUrl} />
    </div>
  );
}
