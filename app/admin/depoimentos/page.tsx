import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { mockTestimonials } from "@/lib/mock/testimonials";

export default function DepoimentosPage() {
  const columns = [
    { key: "name", label: "Nome" },
    { key: "role", label: "Papel / Cargo" },
    { 
      key: "quote", 
      label: "Depoimento",
      render: (row: any) => (
        <div className="max-w-md truncate text-sm text-gray-500">
          {row.quote}
        </div>
      )
    },
    {
      key: "actions",
      label: "Ações",
      render: () => (
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-kenesis-green">
            <Edit size={16} />
          </button>
          <button className="text-gray-400 hover:text-red-500">
            <Trash2 size={16} />
          </button>
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
          <button className="flex items-center gap-2 rounded-lg bg-kenesis-green px-4 py-2 text-sm font-medium text-white hover:bg-kenesis-greenDark">
            <Plus size={16} />
            Novo Depoimento
          </button>
        }
      />

      <DataTable columns={columns} data={mockTestimonials} />
    </div>
  );
}
