"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AdminCard } from "./admin-card";
import { TestimonialPhotoUpload as PhotoUpload } from "./testimonial-photo-upload";
import { updateMyProfileAction, updatePasswordAction } from "@/server/auth/actions";
import type { AdminUserDetail } from "@/server/users/actions";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-lg bg-kenesis-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-kenesis-greenDark disabled:opacity-50"
    >
      {pending ? "Salvando..." : text}
    </button>
  );
}

type Props = {
  user: AdminUserDetail;
  supabaseUrl: string;
};

export function ProfileForm({ user, supabaseUrl }: Props) {
  const [profileState, profileAction] = useFormState(updateMyProfileAction, {});
  const [passwordState, passwordAction] = useFormState(updatePasswordAction, {});

  return (
    <div className="space-y-8">
      {/* UPDATE PROFILE FORM */}
      <form action={profileAction} className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Meus Dados</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={user.name}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  E-mail (Login)
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  defaultValue={user.email}
                  disabled
                />
                <p className="mt-1 text-[10px] text-gray-500">O e-mail de login não pode ser alterado.</p>
              </div>

              <div>
                <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-gray-700">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={user.whatsapp || ""}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Perfil Público (Equipe)</h3>
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-gray-700">
                  Cargo
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={user.jobTitle || ""}
                />
              </div>
              <div>
                <label htmlFor="creci" className="mb-1 block text-sm font-medium text-gray-700">
                  CRECI
                </label>
                <input
                  id="creci"
                  name="creci"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={user.creci || ""}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                  Região de Atuação
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  defaultValue={user.location || ""}
                />
              </div>
            </div>
            <div>
              <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                defaultValue={user.bio || ""}
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Minha Foto</h3>
            <PhotoUpload initialPhotoPath={user.photoPath} supabaseUrl={supabaseUrl} />
          </AdminCard>

          {profileState?.error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
              {profileState.error}
            </div>
          )}
          {profileState?.success && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
              {profileState.success}
            </div>
          )}
          <SubmitButton text="Salvar Perfil" />
        </div>
      </form>

      {/* UPDATE PASSWORD FORM */}
      <form action={passwordAction} className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Alterar Senha</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Nova Senha
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {passwordState?.error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
              {passwordState.error}
            </div>
          )}
          {passwordState?.success && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
              {passwordState.success}
            </div>
          )}
          <SubmitButton text="Alterar Senha" />
        </div>
      </form>
    </div>
  );
}
