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
