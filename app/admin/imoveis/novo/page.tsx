import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PropertyForm } from "@/components/admin/property-form";

export default function NovoImovelPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/imoveis" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
        <ChevronLeft size={16} />
        Voltar para imóveis
      </Link>

      <AdminPageHeader 
        title="Novo Imóvel" 
        description="Cadastre um novo imóvel no portfólio."
      />

      <PropertyForm />
    </div>
  );
}
