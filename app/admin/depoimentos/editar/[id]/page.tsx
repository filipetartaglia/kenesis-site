import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getTestimonialById } from "@/server/testimonials/actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarDepoimentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    return notFound();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Depoimento"
        description="Atualize as informações do depoimento."
      />
      <TestimonialForm initialData={testimonial} supabaseUrl={supabaseUrl} />
    </div>
  );
}
