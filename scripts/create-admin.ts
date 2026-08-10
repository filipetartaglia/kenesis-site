import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Carregar variáveis do .env.local ANTES de importar o banco
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ Faltam variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMasterAdmin() {
  // Importação dinâmica para garantir que o dotenv rode antes do drizzle inicializar
  const { db } = await import("../db/client");
  const { users } = await import("../db/schema");

  const email = "admin@kenesis.com.br";
  const password = "AdminPassword123!"; // Você poderá trocar depois
  const name = "Filipe Tartaglia";

  console.log(`\n⏳ Criando usuário admin: ${email}...`);

  // 1. Criar no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      console.log("⚠️ O e-mail já está cadastrado no Supabase Auth.");
    } else {
      console.error("❌ Erro ao criar no Auth:", authError.message);
      process.exit(1);
    }
  }

  // 2. Pegar o ID gerado pelo Auth
  let userId;
  if (authData?.user?.id) {
    userId = authData.user.id;
  } else {
    const { data: { users: allUsers } } = await supabase.auth.admin.listUsers();
    const existing = allUsers.find(u => u.email === email);
    userId = existing?.id;
  }

  if (!userId) {
    console.error("❌ Não foi possível encontrar a ID do usuário.");
    process.exit(1);
  }

  // 3. Cadastrar a relação na Drizzle (public.users)
  try {
    await db.insert(users).values({
      id: userId,
      email,
      name,
      role: "admin",
      isActive: true,
      isPublic: false,
      jobTitle: "Administrador Executivo"
    });
    console.log("✅ Usuário mestre vinculado no Postgres com sucesso!");
  } catch (e: any) {
    if (e.code === '23505') {
      console.log("⚠️ Usuário já estava vinculado na tabela public.users.");
    } else {
      console.error("❌ Erro ao inserir na base de dados (Drizzle):", e.message);
      process.exit(1);
    }
  }

  console.log("\n🎉 CONTA CRIADA COM SUCESSO!");
  console.log("-----------------------------------------");
  console.log(`👤 E-mail:  ${email}`);
  console.log(`🔑 Senha:   ${password}`);
  console.log("-----------------------------------------");
  console.log("Vá até http://localhost:3000/admin/login e faça o login.\n");
}

createMasterAdmin();
