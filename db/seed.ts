import { eq } from "drizzle-orm";
import { db } from "./client";
import { users } from "./schema";
import { equipe } from "@/server/users/data";

// Popula o banco a partir da fonte em memória. Idempotente: roda quantas vezes
// quiser, casa pelo e-mail e atualiza em vez de duplicar.
//
//   npm run db:seed                                      local
//   npx tsx --env-file=.env.supabase.local db/seed.ts     produção
//
// O env entra por --env-file, e não por dotenv dentro do arquivo, porque
// db/client.ts lê process.env na avaliação do módulo — e import ES é içado,
// então qualquer config() aqui rodaria tarde demais.
//
// Isto NÃO é migration. Migration cria estrutura; seed carrega conteúdo inicial,
// e conteúdo inicial é coisa que se corrige e roda de novo.

/**
 * PROVISÓRIO — precisa de confirmação da Kenesis.
 *
 * A spec §10 registra a premissa: os dois sócios-CEO como `admin` e Vinicius
 * como `corretor`. Nenhum dos três tem e-mail real no acervo atual, então os
 * endereços abaixo são placeholders no domínio da empresa.
 *
 * Ninguém recebe senha aqui: password_hash fica nulo, que é o que significa
 * "aparece na home, não faz login". O acesso ao painel se cria depois, pelo
 * npm run seed:admin, com senha vinda do ambiente — senha em código é senha
 * vazada no primeiro clone.
 */
const PERFIS: Record<string, { email: string; role: "admin" | "corretor"; creci?: string }> = {
  "Filipe Moura": { email: "filipe.moura@kenesis.com.br", role: "admin" },
  "Filipe Tartaglia": { email: "filipe.tartaglia@kenesis.com.br", role: "admin" },
  "Vinicius Rodrigues": { email: "vinicius.rodrigues@kenesis.com.br", role: "corretor" },
};

async function seedUsers() {
  let criados = 0;
  let atualizados = 0;

  // Laço indexado e não equipe.entries(): o tsconfig tem target es5, onde
  // iterar um ArrayIterator exigiria ligar downlevelIteration no projeto todo.
  for (let indice = 0; indice < equipe.length; indice++) {
    const membro = equipe[indice];
    const perfil = PERFIS[membro.name];
    if (!perfil) {
      throw new Error(
        `Sem perfil definido para "${membro.name}". Adicione em PERFIS antes de rodar o seed.`
      );
    }

    // `role` do arquivo de conteúdo é CARGO e vai para job_title.
    // `role` da tabela é PERMISSÃO e vem de PERFIS. Trocar os dois faz o card da
    // home exibir "admin" no lugar de "CEO & Estratégia".
    const linha = {
      email: perfil.email,
      name: membro.name,
      role: perfil.role,
      jobTitle: membro.role,
      creci: perfil.creci ?? null,
      whatsapp: membro.whatsapp ?? null,
      bio: membro.bio ?? null,
      photoPath: membro.photo ?? null,
      location: membro.location ?? null,
      isPublic: true,
      sortOrder: indice,
      isActive: true,
    };

    const [existente] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, perfil.email))
      .limit(1);

    if (existente) {
      await db
        .update(users)
        .set({ ...linha, updatedAt: new Date() })
        .where(eq(users.id, existente.id));
      atualizados++;
    } else {
      await db.insert(users).values(linha);
      criados++;
    }
  }

  return { criados, atualizados };
}

async function main() {
  const r = await seedUsers();
  console.log(`users: ${r.criados} criados, ${r.atualizados} atualizados`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("seed falhou:", e);
    process.exit(1);
  });
