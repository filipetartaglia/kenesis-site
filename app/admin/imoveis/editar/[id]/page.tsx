import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PropertyForm } from "@/components/admin/property-form";
import { findOneForAdmin } from "@/server/properties/actions";

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await findOneForAdmin(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/imoveis" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
        <ChevronLeft size={16} />
        Voltar para imóveis
      </Link>

      <AdminPageHeader
        title="Editar Imóvel"
        description={`Atualize as informações de "${property.title}".`}
      />

      <PropertyForm
        initialData={property}
        supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
      />
    </div>
  );
}
