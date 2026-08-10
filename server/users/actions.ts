"use server";

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminUserDetail = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "corretor";
  jobTitle: string | null;
  creci: string | null;
  whatsapp: string | null;
  bio: string | null;
  photoPath: string | null;
  location: string | null;
  isPublic: boolean;
  sortOrder: number;
  isActive: boolean;
  permissions: string[];
  isMaster: boolean;
};

export async function getUserById(id: string): Promise<AdminUserDetail | null> {
  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      jobTitle: users.jobTitle,
      creci: users.creci,
      whatsapp: users.whatsapp,
      bio: users.bio,
      photoPath: users.photoPath,
      location: users.location,
      isPublic: users.isPublic,
      sortOrder: users.sortOrder,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!row) return null;

  // Import userPermissions if needed (we'll assume it's imported above or we'll add it)
  // Actually we need to import it at the top of the file.
  const { userPermissions } = await import("@/db/schema");
  const perms = await db
    .select({ permission: userPermissions.permission })
    .from(userPermissions)
    .where(eq(userPermissions.userId, id));

  const isMaster = row.email === process.env.MASTER_ADMIN_EMAIL;
  
  return {
    ...row,
    permissions: perms.map((p) => p.permission),
    isMaster,
  } as AdminUserDetail;
}

export type UserFormState = {
  error?: string;
  success?: boolean;
};

export async function createUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "admin" | "corretor";
  const jobTitle = formData.get("jobTitle") as string | null;
  const creci = formData.get("creci") as string | null;
  const whatsapp = formData.get("whatsapp") as string | null;
  const bio = formData.get("bio") as string | null;
  const photoPath = formData.get("photoPath") as string | null;
  const location = formData.get("location") as string | null;
  const isPublic = formData.get("isPublic") === "on";
  const isActive = formData.get("isActive") === "on";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const permissions = formData.getAll("permissions") as string[];

  // Server-side validation for permissions based on current user
  const { requireAuth } = await import("@/server/auth");
  const currentUser = await requireAuth();

  if (role === "admin" && currentUser.role !== "admin") {
    return { error: "Apenas administradores podem criar outros administradores." };
  }

  if (!name || !email || !role) {
    return { error: "Nome, e-mail e nível de acesso são obrigatórios." };
  }

  try {
    const adminAuth = createAdminClient();
    
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await adminAuth.auth.admin.createUser({
      email,
      email_confirm: true,
      password: "Mudar123!", // Senha padrão para todos os novos usuários
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return { error: "Este e-mail já está em uso no sistema." };
      }
      return { error: "Erro na autenticação: " + authError.message };
    }

    const newUserId = authData.user.id;

    // 2. Criar registro correspondente em public.users
    await db.insert(users).values({
      id: newUserId,
      name,
      email,
      role,
      jobTitle: jobTitle || null,
      creci: creci || null,
      whatsapp: whatsapp?.replace(/\D/g, '') || null,
      bio: bio || null,
      photoPath: photoPath || null,
      location: location || null,
      isPublic,
      isActive,
      sortOrder,
    });

    // 3. Cadastrar permissões
    if (permissions.length > 0) {
      const { userPermissions } = await import("@/db/schema");
      await db.insert(userPermissions).values(
        permissions.map((p) => ({ userId: newUserId, permission: p }))
      );
    }

    revalidatePath("/admin/usuarios");
    revalidatePath("/");
  } catch (e: any) {
    if (e.code === '23505') { // unique violation in Postgres
      return { error: "Este e-mail já está em uso." };
    }
    return { error: e.message || "Erro ao criar usuário." };
  }

  redirect("/admin/usuarios");
}

export async function updateUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "admin" | "corretor";
  const jobTitle = formData.get("jobTitle") as string | null;
  const creci = formData.get("creci") as string | null;
  const whatsapp = formData.get("whatsapp") as string | null;
  const bio = formData.get("bio") as string | null;
  const photoPath = formData.get("photoPath") as string | null;
  const location = formData.get("location") as string | null;
  const isPublic = formData.get("isPublic") === "on";
  const isActive = formData.get("isActive") === "on";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const permissions = formData.getAll("permissions") as string[];
  const overridePassword = formData.get("overridePassword") as string | null;

  const { requireAuth } = await import("@/server/auth");
  const currentUser = await requireAuth();

  const targetUser = await getUserById(id);
  if (!targetUser) return { error: "Usuário não encontrado." };

  // Master rules
  if (targetUser.isMaster && currentUser.email !== targetUser.email) {
    return { error: "O Master Admin não pode ser alterado por outros usuários." };
  }
  if (targetUser.isMaster && (role !== "admin" || !isActive)) {
    return { error: "O Master Admin não pode ser rebaixado ou desativado." };
  }

  // Self rules
  if (currentUser.id === id && role !== currentUser.role) {
    return { error: "Você não pode alterar seu próprio nível de acesso." };
  }

  if (!id || !name || !email || !role) {
    return { error: "ID, nome, e-mail e nível de acesso são obrigatórios." };
  }

  try {
    await db
      .update(users)
      .set({
        name,
        email,
        role,
        jobTitle: jobTitle || null,
        creci: creci || null,
        whatsapp: whatsapp?.replace(/\D/g, '') || null,
        bio: bio || null,
        photoPath: photoPath || null,
        location: location || null,
        isPublic,
        isActive,
        sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    // Update permissions
    const { userPermissions } = await import("@/db/schema");
    await db.delete(userPermissions).where(eq(userPermissions.userId, id));
    if (permissions.length > 0) {
      await db.insert(userPermissions).values(
        permissions.map((p) => ({ userId: id, permission: p }))
      );
    }
    
    // Override password
    if (overridePassword && currentUser.isMaster) {
      if (overridePassword.length < 6) {
        return { error: "A nova senha deve ter pelo menos 6 caracteres." };
      }
      const adminAuth = createAdminClient();
      const { error: authError } = await adminAuth.auth.admin.updateUserById(id, {
        password: overridePassword
      });
      if (authError) {
        return { error: "Erro ao forçar redefinição de senha: " + authError.message };
      }
    }

    revalidatePath("/admin/usuarios");
    revalidatePath("/");
  } catch (e: any) {
    if (e.code === '23505') { // unique violation in Postgres
      return { error: "Este e-mail já está em uso." };
    }
    return { error: e.message || "Erro ao atualizar usuário." };
  }

  redirect("/admin/usuarios");
}

export async function toggleUserActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  try {
    await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id));
    revalidatePath("/admin/usuarios");
    revalidatePath("/");
    return {};
  } catch (e: any) {
    return { error: e.message || "Erro ao atualizar status do usuário." };
  }
}

export async function deleteUser(id: string): Promise<{ error?: string }> {
  const { requireAuth } = await import("@/server/auth");
  const currentUser = await requireAuth();

  if (!currentUser.isMaster) {
    return { error: "Apenas o Master Admin pode excluir usuários." };
  }

  const targetUser = await getUserById(id);
  if (!targetUser) return { error: "Usuário não encontrado." };

  if (targetUser.isMaster) {
    return { error: "O Master Admin não pode ser excluído." };
  }

  try {
    const adminAuth = createAdminClient();

    // 1. Apagar no Supabase Auth (Se der erro aqui, a gente aborta)
    const { error: authError } = await adminAuth.auth.admin.deleteUser(id);
    if (authError) {
      return { error: "Erro ao excluir identidade no Supabase Auth: " + authError.message };
    }

    // 2. Apagar no banco de dados (Drizzle)
    await db.delete(users).where(eq(users.id, id));

    revalidatePath("/admin/usuarios");
    revalidatePath("/");
    return {};
  } catch (e: any) {
    if (e.code === '23503') { // foreign_key_violation
      return { error: "Este usuário possui imóveis ou leads vinculados a ele. Não é possível excluí-lo permanentemente, por favor apenas desative-o." };
    }
    return { error: e.message || "Erro ao excluir o usuário." };
  }
}
