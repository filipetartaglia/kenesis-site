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

  return row as AdminUserDetail || null;
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

  if (!name || !email || !role) {
    return { error: "Nome, e-mail e nível de acesso são obrigatórios." };
  }

  try {
    const adminAuth = createAdminClient();
    
    // 1. Criar usuário no Supabase Auth
    // Definimos uma senha provisória aleatória apenas para criação.
    // O ideal é acionar o fluxo de invite_user do Supabase depois, ou usar signInWithOtp.
    const { data: authData, error: authError } = await adminAuth.auth.admin.createUser({
      email,
      email_confirm: true,
      password: "TempPassword!" + Math.random().toString(36).substring(2, 10),
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
