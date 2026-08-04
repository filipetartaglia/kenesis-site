/**
 * Repository para seções (categorias, serviços).
 * Nesta fase consome dados estáticos. Futuramente apontará para o banco de dados.
 */

import type { Categoria, Servico } from "@/types";
import { categorias, servicos } from "@/lib/content/sections";

export function getAllCategorias(): Categoria[] {
  return categorias;
}

export function getAllServicos(): Servico[] {
  return servicos;
}
