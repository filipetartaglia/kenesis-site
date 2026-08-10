import { Home, Users, MousePointerClick, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { AdminCard } from "@/components/admin/admin-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { findAllForAdmin } from "@/server/properties/actions";
import { findAllLeadsForAdmin } from "@/server/leads/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [properties, leads] = await Promise.all([
    findAllForAdmin(),
    findAllLeadsForAdmin(),
  ]);

  const featuredProperties = properties.filter((p) => p.isFeatured).length;

  const propertyColumns = [
    { key: "title", label: "Imóvel" },
    { 
      key: "category", 
      label: "Categoria",
      render: (row: any) => row.propertyType 
    },
    { 
      key: "price", 
      label: "Preço",
      render: (row: any) => row.priceVisible && row.priceCents ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(row.priceCents / 100) : "Consulte"
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <StatusBadge status={row.status} />
    }
  ];

  const leadColumns = [
    { key: "name", label: "Nome" },
    { 
      key: "property", 
      label: "Interesse",
      render: (row: any) => row.propertyTitle ? (
        <Link href={`/imoveis/${row.propertySlug}`} target="_blank" className="hover:underline hover:text-kenesis-green">
          {row.propertyTitle}
        </Link>
      ) : (
        <span className="text-gray-400">Contato Geral</span>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <LeadStatusSelect id={row.id} status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Dashboard" 
        description="Bem-vindo ao painel administrativo da Kenesis."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total de Imóveis" 
          value={properties.length} 
          icon={Home} 
        />
        <StatsCard 
          title="Imóveis em Destaque" 
          value={featuredProperties} 
          icon={Star} 
        />
        <StatsCard 
          title="Leads Recebidos" 
          value={leads.length} 
          icon={MousePointerClick} 
        />
        <StatsCard 
          title="Leads Novos" 
          value={leads.filter((l) => l.status === "novo").length} 
          icon={Users} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Últimos Imóveis Adicionados</h3>
            <Link href="/admin/imoveis" className="text-xs font-medium text-kenesis-green hover:underline">Ver todos</Link>
          </div>
          <DataTable columns={propertyColumns} data={properties.slice(0, 5)} />
        </AdminCard>

        <AdminCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Leads Recentes</h3>
            <Link href="/admin/leads" className="text-xs font-medium text-kenesis-green hover:underline">Ver todos</Link>
          </div>
          <DataTable columns={leadColumns} data={leads.slice(0, 5)} />
        </AdminCard>
      </div>
    </div>
  );
}
