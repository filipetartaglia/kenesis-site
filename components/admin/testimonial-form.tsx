"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AdminCard } from "./admin-card";
import { TestimonialPhotoUpload } from "./testimonial-photo-upload";
import { createTestimonial, updateTestimonial, type AdminTestimonial } from "@/server/testimonials/actions";
import { useRouter } from "next/navigation";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-lg bg-kenesis-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-kenesis-greenDark disabled:opacity-50"
    >
      {pending ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Depoimento"}
    </button>
  );
}

type Props = {
  initialData?: AdminTestimonial | null;
  supabaseUrl: string;
};

export function TestimonialForm({ initialData, supabaseUrl }: Props) {
  const isEdit = !!initialData;
  const router = useRouter();

  const [state, formAction] = useFormState(
    isEdit ? updateTestimonial : createTestimonial,
    {}
  );

  return (
    <form action={formAction} className="grid items-start gap-6 lg:grid-cols-3">
      {isEdit && <input type="hidden" name="id" value={initialData.id} />}

      <div className="lg:col-span-2 space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Dados do Autor</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="authorName" className="mb-1 block text-sm font-medium text-gray-700">
                Nome do Cliente *
              </label>
              <input
                id="authorName"
                name="authorName"
                type="text"
                required
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                placeholder="Ex: João da Silva"
                defaultValue={initialData?.authorName || ""}
              />
            </div>
            
            <div>
              <label htmlFor="authorRole" className="mb-1 block text-sm font-medium text-gray-700">
                Papel / Cargo
              </label>
              <input
                id="authorRole"
                name="authorRole"
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                placeholder="Ex: Cliente comprador, Investidor..."
                defaultValue={initialData?.authorRole || ""}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Depoimento</h3>
          <textarea
            id="quote"
            name="quote"
            required
            rows={5}
            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
            placeholder="O que o cliente disse..."
            defaultValue={initialData?.quote || ""}
          />
        </AdminCard>
      </div>

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Foto (Opcional)</h3>
          <TestimonialPhotoUpload 
            initialPhotoPath={initialData?.photoPath} 
            supabaseUrl={supabaseUrl} 
          />
          <p className="mt-2 text-xs text-gray-500">
            Recomendado: Imagem quadrada (ex: 400x400).
          </p>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Publicação</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isPublished"
                className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green"
                defaultChecked={initialData ? initialData.isPublished : true}
              />
              Publicar no site
            </label>

            <div>
              <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium text-gray-700">
                Ordem de exibição
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                placeholder="0"
                defaultValue={initialData?.sortOrder ?? 0}
              />
              <p className="mt-1 text-xs text-gray-500">
                Menor número aparece primeiro.
              </p>
            </div>
          </div>
        </AdminCard>

        {state?.error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <SubmitButton isEdit={isEdit} />
        
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
