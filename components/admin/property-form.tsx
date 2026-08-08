"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AdminCard } from "./admin-card";
import { PropertyGallery } from "./property-gallery";
import { createProperty, updateProperty } from "@/server/properties/actions";
import type { AdminPropertyFull, PropertyFormState } from "@/server/properties/actions";
import { useRouter } from "next/navigation";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-kenesis-green px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-kenesis-greenDark disabled:opacity-50"
    >
      {pending
        ? "Salvando..."
        : isEditing
          ? "Salvar Alterações"
          : "Criar Imóvel"}
    </button>
  );
}

function formatCentsToDisplay(cents: number | null): string {
  if (cents === null) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Props = {
  initialData?: AdminPropertyFull;
  supabaseUrl?: string;
};

export function PropertyForm({ initialData, supabaseUrl }: Props) {
  const isEditing = !!initialData;
  const action = isEditing ? updateProperty : createProperty;
  const [state, formAction] = useFormState<PropertyFormState, FormData>(action, {});
  const router = useRouter();

  return (
    <form action={formAction} className="space-y-6">
      {/* ID hidden para edição */}
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      {/* Feedback */}
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Informações Principais</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                  Título do Imóvel *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="Ex: Mansão no Jardim Ubá I"
                  defaultValue={initialData?.title}
                  onChange={(e) => {
                    // Auto-gera slug quando estiver criando
                    if (!isEditing) {
                      const slugInput = document.getElementById("slug") as HTMLInputElement;
                      if (slugInput) slugInput.value = slugify(e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
                  Slug (URL) *
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="mansao-no-jardim-uba-i"
                  defaultValue={initialData?.slug}
                />
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="Descreva os detalhes do imóvel..."
                  defaultValue={initialData?.description || ""}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Localização</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="addressStreet" className="mb-1 block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  id="addressStreet"
                  name="addressStreet"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="Rua / Avenida"
                  defaultValue={initialData?.addressStreet || ""}
                />
              </div>
              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="Niterói"
                  defaultValue={initialData?.city || "Niterói"}
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-1 block text-sm font-medium text-gray-700">
                  Estado (UF)
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  maxLength={2}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="RJ"
                  defaultValue={initialData?.state || "RJ"}
                />
              </div>
              <div>
                <label htmlFor="zip" className="mb-1 block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="00000-000"
                  defaultValue={initialData?.zip || ""}
                />
              </div>
              <div>
                <label htmlFor="neighborhood" className="mb-1 block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  id="neighborhood"
                  name="neighborhood"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="Icaraí"
                  defaultValue={initialData?.neighborhood || ""}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <PropertyGallery
              slug={initialData?.slug}
              initialImages={initialData?.images}
              supabaseUrl={supabaseUrl}
            />
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Classificação</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="propertyType" className="mb-1 block text-sm font-medium text-gray-700">
                  Tipo do Imóvel *
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  required
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.propertyType || ""}
                >
                  <option value="">Selecione...</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="empreendimento">Empreendimento</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label htmlFor="segment" className="mb-1 block text-sm font-medium text-gray-700">
                  Segmento
                </label>
                <select
                  id="segment"
                  name="segment"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.segment || ""}
                >
                  <option value="">Sem segmento</option>
                  <option value="medio_padrao">Médio padrão</option>
                  <option value="alto_padrao">Alto padrão</option>
                </select>
              </div>
              <div>
                <label htmlFor="purpose" className="mb-1 block text-sm font-medium text-gray-700">
                  Finalidade
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.purpose || "venda"}
                >
                  <option value="venda">Venda</option>
                  <option value="locacao">Locação</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.status || "rascunho"}
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="publicado">Publicado</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Detalhes Comerciais</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="priceCents" className="mb-1 block text-sm font-medium text-gray-700">
                  Preço (R$)
                </label>
                <input
                  id="priceCents"
                  name="priceCents"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="1.500.000,00"
                  defaultValue={formatCentsToDisplay(initialData?.priceCents ?? null)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="priceVisible"
                  className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green"
                  defaultChecked={initialData?.priceVisible ?? false}
                />
                Exibir preço no site
              </label>
              <div>
                <label htmlFor="condoFeeCents" className="mb-1 block text-sm font-medium text-gray-700">
                  Valor do Condomínio (R$)
                </label>
                <input
                  id="condoFeeCents"
                  name="condoFeeCents"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="850,00"
                  defaultValue={formatCentsToDisplay(initialData?.condoFeeCents ?? null)}
                />
              </div>
              <div>
                <label htmlFor="iptuCents" className="mb-1 block text-sm font-medium text-gray-700">
                  Valor do IPTU (R$)
                </label>
                <input
                  id="iptuCents"
                  name="iptuCents"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="300,00"
                  defaultValue={formatCentsToDisplay(initialData?.iptuCents ?? null)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="isFeatured"
                  className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green"
                  defaultChecked={initialData?.isFeatured ?? false}
                />
                Destaque na página inicial
              </label>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Características</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bedrooms" className="mb-1 block text-sm font-medium text-gray-700">
                  Dormitórios
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.bedrooms ?? ""}
                />
              </div>
              <div>
                <label htmlFor="suites" className="mb-1 block text-sm font-medium text-gray-700">
                  Suítes
                </label>
                <input
                  id="suites"
                  name="suites"
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.suites ?? ""}
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="mb-1 block text-sm font-medium text-gray-700">
                  Banheiros
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.bathrooms ?? ""}
                />
              </div>
              <div>
                <label htmlFor="parkingSpaces" className="mb-1 block text-sm font-medium text-gray-700">
                  Vagas
                </label>
                <input
                  id="parkingSpaces"
                  name="parkingSpaces"
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.parkingSpaces ?? ""}
                />
              </div>
              <div>
                <label htmlFor="areaBuiltM2" className="mb-1 block text-sm font-medium text-gray-700">
                  Área útil (m²)
                </label>
                <input
                  id="areaBuiltM2"
                  name="areaBuiltM2"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.areaBuiltM2 ?? ""}
                />
              </div>
              <div>
                <label htmlFor="areaTotalM2" className="mb-1 block text-sm font-medium text-gray-700">
                  Área total (m²)
                </label>
                <input
                  id="areaTotalM2"
                  name="areaTotalM2"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={initialData?.areaTotalM2 ?? ""}
                />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          onClick={() => router.push("/admin/imoveis")}
          className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Cancelar
        </button>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
