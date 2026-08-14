import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { findAllTestimonialsForAdmin } from "@/server/testimonials/actions";
import { TestimonialStatusToggle } from "@/components/admin/testimonial-status-toggle";
import { DeleteTestimonialButton } from "@/components/admin/delete-testimonial-button";
import { getTestimonialImageUrl } from "@/server/testimonials/repository";
import { requirePermission } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function DepoimentosPage() {
  await requirePermission("testimonials.read");
  const testimonials = await findAllTestimonialsForAdmin();

  const columns = [
    {
      key: "photo",
      label: "Foto",
      render: (row: any) => (
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
          {row.photoPath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getTestimonialImageUrl(row.photoPath)!} alt={row.authorName} className="h-full w-full object-cover" />
          )}
        </div>
      )
    },
    { key: "authorName", label: "Nome" },
    { key: "authorRole", label: "Papel / Cargo" },
    { 
      key: "quote", 
      label: "Depoimento",
      render: (row: any) => (
        <div className="max-w-xs truncate text-sm text-gray-500" title={row.quote}>
          {row.quote}
        </div>
      )
    },
    { 
      key: "sortOrder", 
      label: "Ordem" 
    },
    { 
      key: "isPublished", 
      label: "Status",
      render: (row: any) => <TestimonialStatusToggle id={row.id} isPublished={row.isPublished} />
    },
    {
      key: "actions",
      label: "Ações",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/depoimentos/editar/${row.id}`} className="text-gray-400 hover:text-kenesis-green" title="Editar">
            <Edit size={16} />
          </Link>
          <DeleteTestimonialButton id={row.id} name={row.authorName} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Depoimentos" 
        description="Gerencie os depoimentos exibidos na página inicial."
        action={
          <Link href="/admin/depoimentos/novo" className="flex items-center gap-2 rounded-lg bg-kenesis-green px-4 py-2 text-sm font-medium text-white hover:bg-kenesis-greenDark">
            <Plus size={16} />
            Novo Depoimento
          </Link>
        }
      />

      <DataTable columns={columns} data={testimonials} />
    </div>
  );
}
