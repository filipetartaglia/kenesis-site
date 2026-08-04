/**
 * Repository para equipe.
 * Nesta fase consome dados estáticos. Futuramente apontará para o banco de dados.
 */

import type { TeamMember } from "@/types";
import { equipe } from "@/lib/content/team";

export function getAllTeamMembers(): TeamMember[] {
  return equipe;
}
