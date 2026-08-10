import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { TeamMember } from "@/types";

// Chama-se "users" e não "team" porque login e vitrine são a mesma pessoa e vão
// para a mesma tabela (spec D4): tabelas separadas divergem no primeiro update
// esquecido. Quem só aparece na home entra com password_hash nulo.
//
// Este arquivo agora fala com o Postgres. server/users/data.ts virou apenas a
// entrada do seed (db/seed.ts) e não é mais lido em runtime.
//
// Regra da spec §4 mantida: nada de "next/*" nem React aqui.

/** O que o site público exibe. Nunca inclui e-mail nem nada de credencial. */
export type PublicTeamMember = TeamMember;

/** O que a tabela do painel exibe. */
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isMaster: boolean;
};

/** "5521976248282" -> "(21) 97624-8282" */
function formatPhone(digits: string | null): string {
  if (!digits) return "—";
  const m = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
}

/**
 * Membros exibidos na seção Equipe da home.
 *
 * O recorte está no nome, como em properties: `is_public and is_active` vive
 * aqui dentro, não em parâmetro. Uma função chamada `getAll` acabaria devolvendo
 * também quem só tem acesso ao painel — e o e-mail de login de todo mundo iria
 * para o HTML público.
 *
 * A projeção é explícita de propósito: `select *` traria password_hash e
 * failed_login_attempts para dentro de um componente de marketing.
 */
export async function findPublicTeam(): Promise<PublicTeamMember[]> {
  const linhas = await db
    .select({
      name: users.name,
      jobTitle: users.jobTitle,
      location: users.location,
      bio: users.bio,
      photoPath: users.photoPath,
      whatsapp: users.whatsapp,
    })
    .from(users)
    .where(and(eq(users.isPublic, true), eq(users.isActive, true)))
    .orderBy(asc(users.sortOrder), asc(users.name));

  return linhas.map((u) => ({
    name: u.name,
    // job_title (cargo) alimenta `role` da view. O `role` da tabela é permissão
    // e não pode aparecer aqui: renderizaria "admin" no card da home.
    role: u.jobTitle ?? "",
    location: u.location ?? "",
    bio: u.bio ?? undefined,
    photo: u.photoPath ?? undefined,
    whatsapp: u.whatsapp ?? undefined,
  }));
}

/**
 * Todos os usuários, para a tela de gestão.
 *
 * Separado de findPublicTeam pelo NOME, não por parâmetro (spec §4, regra 4):
 * esta função devolve inclusive inativos e quem não aparece no site. Só pode ser
 * chamada sob sessão autenticada — o guard entra junto com a autenticação.
 *
 * Traduz os enums do banco para os rótulos que a tabela do painel exibe. O
 * banco guarda 'admin'/'corretor'; a tela mostra "Administrador"/"Corretor".
 * Texto de interface não vira valor de coluna.
 */
export async function findAllForAdmin(): Promise<AdminUser[]> {
  const linhas = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      whatsapp: users.whatsapp,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .orderBy(asc(users.name));

  const masterEmail = process.env.MASTER_ADMIN_EMAIL;

  return linhas.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: formatPhone(u.whatsapp),
    role: u.role === "admin" ? "Administrador" : "Corretor",
    isActive: u.isActive,
    isMaster: u.email === masterEmail,
  }));
}
