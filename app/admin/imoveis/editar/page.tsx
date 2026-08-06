import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PropertyForm } from "@/components/admin/property-form";
import { mockProperties } from "@/lib/mock/properties";

export default function EditarImovelPage() {
  const data = mockProperties[0]; // mock data

  return (
    <div className="space-y-6">
      <Link href="/admin/imoveis" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
        <ChevronLeft size={16} />
        Voltar para imóveis
      </Link>

      <AdminPageHeader 
        title="Editar Imóvel" 
        description="Atualize as informações do imóvel."
      />

      <PropertyForm initialData={data} />
    </div>
  );
}
