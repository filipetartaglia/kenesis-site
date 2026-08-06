import type { Property } from "@/types";
import { properties } from "./data";

// Toda leitura de imóvel passa por aqui. É a fronteira que o Postgres vai
// substituir: quando o banco entrar, só o corpo destas funções muda — nenhuma
// página e nenhum componente são tocados de novo.
//
// Regra da spec §4: nada de "next/*" nem React neste arquivo. É o que permite
// testar sem subir o Next e o que torna a migração para container real.

/** Rótulo do estado "sem filtro" na UI. Mora aqui porque a query o interpreta. */
export const TODOS = "Todos";

/**
 * Imóveis visíveis no site.
 *
 * O recorte de publicação está no NOME, não em parâmetro. Hoje não existe
 * rascunho — os 20 imóveis são todos públicos — mas quando a coluna `status`
 * existir, o filtro entra aqui dentro e nenhum chamador precisa lembrar de
 * passar nada. Um argumento esquecido vaza rascunho e imóvel vendido para o
 * site, e sem RLS esta é a única barreira (spec §7).
 */
export function findPublishedList(filter?: { tipo?: string }): Property[] {
  const tipo = filter?.tipo;
  if (!tipo || tipo === TODOS) return properties;
  return properties.filter((p) => p.tag === tipo);
}

/** Devolve null, não undefined: a página depende disso para chamar notFound(). */
export function findPublishedBySlug(slug: string): Property | null {
  return properties.find((p) => p.slug === slug) ?? null;
}

export function findFeatured(limit = 6): Property[] {
  return properties.slice(0, limit);
}

/**
 * Semelhantes do imóvel dado, excluindo ele próprio.
 *
 * Identifica por slug e não por id: o id numérico desaparece quando a PK virar
 * uuid no banco; o slug sobrevive.
 */
export function findSimilar(slug: string, limit = 3): Property[] {
  return properties.filter((p) => p.slug !== slug).slice(0, limit);
}

/**
 * Tipos distintos existentes no acervo.
 *
 * NÃO inclui "Todos": esse é rótulo de interface, e quem monta a UI é que o
 * adiciona. Camada de dados devolvendo texto de botão é o começo da mistura.
 */
export function listTipos(): string[] {
  return Array.from(new Set(properties.map((p) => p.tag)));
}

export function listSlugs(): string[] {
  return properties.map((p) => p.slug);
}

export function countPublished(): number {
  return properties.length;
}
