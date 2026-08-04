"use client";

import { AdminCard } from "./admin-card";
import { PropertyGallery } from "./property-gallery";

export function PropertyForm({ initialData }: { initialData?: any }) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Informações Principais</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Título do Imóvel</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="Ex: Mansão no Jardim Ubá I" defaultValue={initialData?.title} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Slug (URL)</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="mansao-no-jardim-uba-i" defaultValue={initialData?.slug} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                <textarea rows={5} className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="Descreva os detalhes do imóvel..." defaultValue={initialData?.desc} />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Localização</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Endereço</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="Rua / Avenida" defaultValue={initialData?.location} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cidade</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="Niterói" defaultValue={initialData?.city} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Estado (UF)</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="RJ" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">CEP</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="00000-000" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Bairro</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="Icaraí" />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <PropertyGallery />
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Detalhes Comerciais</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green">
                  <option>Ativo</option>
                  <option>Inativo</option>
                  <option>Vendido</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Preço de Venda</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="R$ 0,00" defaultValue={initialData?.price} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Valor do Condomínio</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="R$ 0,00" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Valor do IPTU</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" placeholder="R$ 0,00" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <input type="checkbox" className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green" defaultChecked />
                Destaque na página inicial
              </label>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Características</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Dormitórios</label>
                <input type="number" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" defaultValue={initialData?.beds} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Suítes</label>
                <input type="number" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Banheiros</label>
                <input type="number" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" defaultValue={initialData?.baths} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Vagas</label>
                <input type="number" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" defaultValue={initialData?.garage} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Área útil (m²)</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" defaultValue={initialData?.area} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Área total (m²)</label>
                <input type="text" className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green" />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-gray-200 bg-gray-50 p-4 rounded-xl">
        <button type="button" className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200">
          Cancelar
        </button>
        <button type="button" className="rounded-lg bg-kenesis-green px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-kenesis-greenDark">
          {initialData ? "Salvar Alterações" : "Criar Imóvel"}
        </button>
      </div>
    </form>
  );
}
