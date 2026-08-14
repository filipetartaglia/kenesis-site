import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { requirePermission } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  await requirePermission("settings.read");

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Configurações do Site" 
        description="Gerencie as informações de contato e redes sociais públicas da imobiliária."
      />

      <form className="max-w-4xl space-y-6" onSubmit={undefined}>
        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Informações de Contato</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Telefone Principal</label>
              <input type="text" defaultValue="(21) 97624-8282" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">WhatsApp</label>
              <input type="text" defaultValue="5521976248282" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">E-mail de Contato</label>
              <input type="email" defaultValue="kenesisimoveis@gmail.com" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Endereço e Horários</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Endereço Completo</label>
              <input type="text" defaultValue="Niterói, Rio de Janeiro" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Endereço Curto (Footer)</label>
              <input type="text" defaultValue="Niterói, RJ" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Horário de Atendimento</label>
              <input type="text" defaultValue="Seg a Sex: 9h às 18h" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Redes Sociais</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Instagram (URL)</label>
              <input type="text" defaultValue="https://www.instagram.com/kenesis.imoveis/" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Instagram (Handle)</label>
              <input type="text" defaultValue="@kenesis.imoveis" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Facebook (URL)</label>
              <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
            </div>
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <div className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            Funcionalidade de persistência será implementada em fase futura.
          </div>
        </div>
      </form>
    </div>
  );
}
