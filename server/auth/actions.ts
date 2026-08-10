"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor, preencha e-mail e senha." };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "E-mail ou senha incorretos." };
    }
    return { error: "Ocorreu um erro ao fazer login." };
  }

  // Verificar se o usuário existe em public.users e está ativo
  const dbUser = await getCurrentUser();
  if (!dbUser) {
    // Se logou no auth, mas não está no db ou inativo, fazemos logout imediatamente
    await supabase.auth.signOut();
    return { error: "Usuário inativo ou sem permissão de acesso." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updatePasswordAction(prevState: any, formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword !== confirmPassword) {
    return { error: "A nova senha e a confirmação não conferem." };
  }

  if (newPassword.length < 6) {
    return { error: "A nova senha deve ter pelo menos 6 caracteres." };
  }

  const supabase = createClient();
  
  // Opcional: verificar a senha atual se a API permitir ou apenas forçar a atualização (já que a sessão é segura).
  // A atualização direta com supabase.auth.updateUser funciona porque o token JWT já garante a autenticação.
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    return { error: "Erro ao atualizar senha: " + error.message };
  }

  return { success: "Senha atualizada com sucesso!" };
}

export async function updateMyProfileAction(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { error: "Não autorizado." };

  const name = formData.get("name") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const creci = formData.get("creci") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const bio = formData.get("bio") as string;
  const photoPath = formData.get("photoPath") as string;
  const location = formData.get("location") as string;

  if (!name) return { error: "O nome é obrigatório." };

  const { db } = await import("@/db/client");
  const { users } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const { revalidatePath } = await import("next/cache");

  try {
    await db
      .update(users)
      .set({
        name,
        jobTitle: jobTitle || null,
        creci: creci || null,
        whatsapp: whatsapp?.replace(/\D/g, '') || null,
        bio: bio || null,
        photoPath: photoPath || null,
        location: location || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id));

    revalidatePath("/admin/perfil");
    revalidatePath("/admin/dashboard");
    return { success: "Perfil atualizado com sucesso!" };
  } catch (e: any) {
    return { error: e.message || "Erro ao atualizar perfil." };
  }
}
