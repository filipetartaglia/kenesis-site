import type { TeamMember } from "@/types";
import { equipe } from "./data";

// Chama-se "users" e não "team" porque login e vitrine são a mesma pessoa e vão
// para a mesma tabela (spec D4): tabelas separadas divergem no primeiro update
// esquecido. Quem só aparece na home entra com password_hash nulo.
//
// Regra da spec §4: nada de "next/*" nem React neste arquivo.

/**
 * Membros exibidos na seção Equipe da home.
 *
 * O recorte está no nome, como em properties: quando a tabela `users` existir,
 * isto vira `where is_public and is_active` aqui dentro. Uma função chamada
 * `getAll` acabaria devolvendo também quem só tem acesso ao painel — e o
 * e-mail de login de todo mundo iria para o HTML público.
 */
export function findPublicTeam(): TeamMember[] {
  return equipe;
}
