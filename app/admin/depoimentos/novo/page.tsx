import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const dynamic = "force-dynamic";

export default async function NovoDepoimentoPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Novo Depoimento"
        description="Adicione um novo depoimento para exibir no site público."
      />
      <TestimonialForm supabaseUrl={supabaseUrl} />
    </div>
  );
}
