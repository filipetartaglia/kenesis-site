import { Home, Users, MessageSquareQuote, MousePointerClick } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { AdminCard } from "@/components/admin/admin-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockProperties } from "@/lib/mock/properties";
import { mockLeads } from "@/lib/mock/leads";

export default function AdminDashboardPage() {
  const propertyColumns = [
    { key: "title", label: "Imóvel" },
    { key: "category", label: "Categoria" },
    { key: "price", label: "Preço" },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <StatusBadge status={row.status} />
    }
  ];

  const leadColumns = [
    { key: "name", label: "Nome" },
    { key: "property", label: "Interesse" },
    { key: "source", label: "Origem" },
    { 
      key: "status", 
      label: "Status",
      render: (row: any) => <StatusBadge status={row.status} />
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
          value="45" 
          icon={Home} 
          trend={{ value: "12%", positive: true }} 
        />
        <StatsCard 
          title="Imóveis em Destaque" 
          value="6" 
          icon={Home} 
        />
        <StatsCard 
          title="Leads Recebidos" 
          value="128" 
          icon={MousePointerClick} 
          trend={{ value: "8%", positive: true }} 
        />
        <StatsCard 
          title="Corretores Ativos" 
          value="12" 
          icon={Users} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Últimos Imóveis Adicionados</h3>
          <DataTable columns={propertyColumns} data={mockProperties.slice(0, 5)} />
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Leads Recentes</h3>
          <DataTable columns={leadColumns} data={mockLeads.slice(0, 5)} />
        </AdminCard>
      </div>
    </div>
  );
}
