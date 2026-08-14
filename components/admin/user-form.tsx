"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AdminCard } from "./admin-card";
import { TestimonialPhotoUpload as PhotoUpload } from "./testimonial-photo-upload"; // Reusing the same upload component
import { createUser, updateUser, type AdminUserDetail } from "@/server/users/actions";
import { useRouter } from "next/navigation";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-lg bg-kenesis-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-kenesis-greenDark disabled:opacity-50"
    >
      {pending ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Usuário"}
    </button>
  );
}

const AVAILABLE_PERMISSIONS = [
  { id: "dashboard.view", label: "Visualizar Dashboard", defaultAdmin: true, defaultBroker: true },
  
  { id: "properties.read", label: "Visualizar imóveis", defaultAdmin: true, defaultBroker: true },
  { id: "properties.create", label: "Cadastrar imóveis", defaultAdmin: true, defaultBroker: true },
  { id: "properties.update", label: "Editar imóveis", defaultAdmin: true, defaultBroker: true },
  { id: "properties.delete", label: "Excluir imóveis", defaultAdmin: true, defaultBroker: false },
  { id: "properties.publish", label: "Publicar imóveis", defaultAdmin: true, defaultBroker: false },
  
  { id: "leads.read", label: "Visualizar leads", defaultAdmin: true, defaultBroker: true },
  { id: "leads.update", label: "Gerenciar leads", defaultAdmin: true, defaultBroker: true },
  
  { id: "users.read", label: "Visualizar usuários", defaultAdmin: true, defaultBroker: false },
  { id: "users.create", label: "Criar usuários", defaultAdmin: true, defaultBroker: false },
  { id: "users.update", label: "Editar usuários", defaultAdmin: true, defaultBroker: false },
  { id: "users.deactivate", label: "Desativar usuários", defaultAdmin: true, defaultBroker: false },
  
  { id: "testimonials.read", label: "Visualizar depoimentos", defaultAdmin: true, defaultBroker: false },
  { id: "testimonials.create", label: "Criar depoimentos", defaultAdmin: true, defaultBroker: false },
  { id: "testimonials.update", label: "Editar depoimentos", defaultAdmin: true, defaultBroker: false },
  { id: "testimonials.delete", label: "Excluir depoimentos", defaultAdmin: true, defaultBroker: false },
  
  { id: "settings.read", label: "Visualizar configurações", defaultAdmin: false, defaultBroker: false },
  { id: "settings.update", label: "Editar configurações", defaultAdmin: false, defaultBroker: false },
];

type Props = {
  initialData?: AdminUserDetail | null;
  supabaseUrl: string;
  currentUser: AdminUserDetail;
};

import { useState } from "react";

export function UserForm({ initialData, supabaseUrl, currentUser }: Props) {
  const isEdit = !!initialData;
  const router = useRouter();
  
  const [role, setRole] = useState<"admin" | "corretor">(initialData?.role || "corretor");

  const [state, formAction] = useFormState(
    isEdit ? updateUser : createUser,
    {}
  );
  
  const canEditRole = currentUser.role === "admin" && (!isEdit || currentUser.id !== initialData?.id) && !initialData?.isMaster;
  const canEditStatus = !initialData?.isMaster && currentUser.id !== initialData?.id;

  return (
    <form action={formAction} className="grid items-start gap-6 lg:grid-cols-3">
      {isEdit && <input type="hidden" name="id" value={initialData.id} />}

      <div className="lg:col-span-2 space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Dados Principais</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                placeholder="Ex: João da Silva"
                defaultValue={initialData?.name || ""}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                E-mail (Login) *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                placeholder="Ex: joao@kenesis.com.br"
                defaultValue={initialData?.email || ""}
                disabled={isEdit}
              />
              {isEdit && <input type="hidden" name="email" value={initialData.email} />}
            </div>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
                Nível de Acesso no Painel *
              </label>
              <select
                id="role"
                name="role"
                required
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green bg-white disabled:bg-gray-100 disabled:text-gray-500"
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "corretor")}
                disabled={!canEditRole}
              >
                <option value="corretor">Corretor (Acesso limitado)</option>
                <option value="admin">Administrador (Acesso total)</option>
              </select>
              {!canEditRole && <input type="hidden" name="role" value={role} />}
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
                placeholder="Apenas números (Ex: 21999999999)"
                defaultValue={initialData?.whatsapp || ""}
              />
            </div>
            
            {!isEdit && (
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Senha Inicial *
                </label>
                <input
                  id="password"
                  name="password"
                  type="text"
                  required
                  minLength={6}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>
            )}
          </div>
        </AdminCard>
        
        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Permissões de Acesso</h3>
          {initialData?.isMaster ? (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
              Este é o <strong>Administrador Master</strong>. Ele possui acesso absoluto e irrevogável a todas as áreas do sistema.
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isDefault = role === "admin" ? perm.defaultAdmin : perm.defaultBroker;
                const isChecked = isEdit 
                  ? initialData.permissions?.includes(perm.id) 
                  : isDefault;
                  
                return (
                  <label key={perm.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="permissions"
                      value={perm.id}
                      defaultChecked={isChecked}
                      disabled={!currentUser.isMaster && currentUser.role !== "admin"}
                      className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green disabled:opacity-50"
                    />
                    {perm.label}
                  </label>
                );
              })}
            </div>
          )}
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Perfil Público (Equipe)</h3>
          
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-gray-700">
                Cargo Exibido no Site
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
                placeholder="Ex: Corretor Especialista"
                defaultValue={initialData?.jobTitle || ""}
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
                placeholder="Ex: 123456"
                defaultValue={initialData?.creci || ""}
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
                placeholder="Ex: Niterói, Região Oceânica"
                defaultValue={initialData?.location || ""}
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
              placeholder="Fale um pouco sobre a experiência do corretor..."
              defaultValue={initialData?.bio || ""}
            />
          </div>
        </AdminCard>
      </div>

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Foto de Perfil</h3>
          <PhotoUpload 
            initialPhotoPath={initialData?.photoPath} 
            supabaseUrl={supabaseUrl} 
          />
          <p className="mt-2 text-xs text-gray-500">
            Será exibida na seção Equipe do site público.
          </p>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Configurações</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green disabled:opacity-50"
                defaultChecked={initialData ? initialData.isActive : true}
                disabled={!canEditStatus}
              />
              Acesso Ativo (Login)
              {!canEditStatus && <input type="hidden" name="isActive" value="on" />}
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isPublic"
                className="rounded border-gray-300 text-kenesis-green focus:ring-kenesis-green"
                defaultChecked={initialData ? initialData.isPublic : false}
              />
              Exibir na seção Equipe do site
            </label>

            <div>
              <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium text-gray-700">
                Ordem de exibição (Equipe)
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
            </div>
            
            {isEdit && currentUser.isMaster && !initialData?.isMaster && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <label htmlFor="overridePassword" className="mb-1 block text-sm font-medium text-red-600">
                  Forçar Nova Senha (Opcional)
                </label>
                <input
                  id="overridePassword"
                  name="overridePassword"
                  type="text"
                  minLength={6}
                  className="w-full rounded-md border border-red-300 p-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Deixe em branco para não alterar"
                />
                <p className="mt-1 text-[10px] text-gray-500">
                  Apenas o Master pode forçar a troca de senha de outro usuário sem precisar da senha atual.
                </p>
              </div>
            )}
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
