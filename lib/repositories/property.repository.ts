/**
 * Repository para imóveis.
 * Nesta fase consome dados estáticos. Futuramente apontará para o banco de dados.
 */

import type { Property } from "@/types";
import { properties } from "@/lib/content/properties";

export function getAllProperties(): Property[] {
  return properties;
}

export function getFeaturedProperties(count = 6): Property[] {
  return properties.slice(0, count);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertyTags(): string[] {
  return ["Todos", ...Array.from(new Set(properties.map((p) => p.tag)))];
}

export function getPropertiesByTag(tag: string): Property[] {
  if (tag === "Todos") return properties;
  return properties.filter((p) => p.tag === tag);
}

export function getSimilarProperties(excludeId: number, count = 3): Property[] {
  return properties.filter((p) => p.id !== excludeId).slice(0, count);
}

export function getAllSlugs(): string[] {
  return properties.map((p) => p.slug);
}
