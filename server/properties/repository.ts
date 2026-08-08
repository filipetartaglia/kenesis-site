import { db } from "@/db/client";
import { properties, propertyImages } from "@/db/schema";
import type { Property } from "@/types";
import { and, asc, desc, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";

export const TODOS = "Todos";

function formatCurrency(cents: number | null, visible: boolean): string {
  if (!visible || cents === null) return "Consulte valores";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatTag(type: string | null, segment: string | null): string {
  if (segment === "alto_padrao") return "Alto padrão";
  if (type === "empreendimento") return "Empreendimento";
  return capitalize(type ?? "");
}

// Resolve o path da imagem para uma URL acessível.
// Paths locais (ex: /imoveis/mansao-jardim-uba/01.webp) são retornados como estão.
// Paths do Supabase Storage (ex: mansao-jardim-uba/123-abc.webp) recebem a URL base.
export function getImageUrl(path: string | null): string {
  if (!path) return "/placeholder-image.jpg";
  // Se já é um path absoluto local, retorna direto
  if (path.startsWith("/")) return path;
  // Se já é uma URL completa, retorna direto
  if (path.startsWith("http")) return path;
  // Caso contrário, é um path do Supabase Storage
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/properties/${path}`;
  }
  return path;
}

// Mapper from DB to Frontend Property
function mapRowToProperty(row: any): Property {
  const p = row.prop;
  const allImages: string[] = row.images || [];
  const covers: string[] = row.covers || [];
  
  // Clean nulls from array_agg se ocorrerem (o sql `array_remove(..., NULL)` já cuida da maioria, mas é bom garantir)
  const cleanImages = allImages.filter(Boolean);
  const cleanCovers = covers.filter(Boolean);
  
  const coverImage = cleanCovers.length > 0 ? cleanCovers[0] : (cleanImages.length > 0 ? cleanImages[0] : null);

  const locParts = [p.neighborhood, p.city, p.state].filter(Boolean);
  
  return {
    id: p.id,
    slug: p.slug,
    tag: formatTag(p.propertyType, p.segment),
    title: p.title,
    location: locParts.join(", "),
    price: formatCurrency(p.priceCents, p.priceVisible),
    note: p.purpose === "locacao" ? "Mensal" : undefined,
    beds: p.bedrooms ?? undefined,
    baths: p.bathrooms ?? undefined,
    garage: p.parkingSpaces ?? undefined,
    area: p.areaTotalM2 ? `${p.areaTotalM2} m²` : (p.areaBuiltM2 ? `${p.areaBuiltM2} m²` : undefined),
    desc: p.description ?? "",
    img: getImageUrl(coverImage),
    gallery: cleanImages.map(getImageUrl),
  };
}

function buildBaseQuery() {
  return db
    .select({
      prop: properties,
      images: sql<string[]>`array_remove(array_agg(${propertyImages.path} ORDER BY ${propertyImages.sortOrder}), NULL)`,
      covers: sql<string[]>`array_remove(array_agg(${propertyImages.path}) FILTER (WHERE ${propertyImages.isCover}), NULL)`,
    })
    .from(properties)
    .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
    .where(eq(properties.status, "publicado"))
    .groupBy(properties.id);
}

export async function findPublishedList(filter?: { tipo?: string }): Promise<Property[]> {
  const rows = await buildBaseQuery().orderBy(desc(properties.publishedAt));
  
  const mapped = rows.map(mapRowToProperty);
  const tipo = filter?.tipo;
  if (!tipo || tipo === TODOS) return mapped;
  return mapped.filter((p) => p.tag === tipo); 
}

export async function findPublishedBySlug(slug: string): Promise<Property | null> {
  const rows = await db
    .select({
      prop: properties,
      images: sql<string[]>`array_remove(array_agg(${propertyImages.path} ORDER BY ${propertyImages.sortOrder}), NULL)`,
      covers: sql<string[]>`array_remove(array_agg(${propertyImages.path}) FILTER (WHERE ${propertyImages.isCover}), NULL)`,
    })
    .from(properties)
    .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
    .where(and(eq(properties.status, "publicado"), eq(properties.slug, slug)))
    .groupBy(properties.id)
    .limit(1);

  if (rows.length === 0) return null;
  return mapRowToProperty(rows[0]);
}

export async function findFeatured(limit = 6): Promise<Property[]> {
  const rows = await buildBaseQuery()
    // No Postgres local, ordenar por boolean requires desc (true > false)
    .orderBy(desc(properties.isFeatured), asc(properties.featuredOrder), desc(properties.publishedAt))
    .limit(limit);
  return rows.map(mapRowToProperty);
}

export async function findSimilar(slug: string, limit = 3): Promise<Property[]> {
  const rows = await db
    .select({
      prop: properties,
      images: sql<string[]>`array_remove(array_agg(${propertyImages.path} ORDER BY ${propertyImages.sortOrder}), NULL)`,
      covers: sql<string[]>`array_remove(array_agg(${propertyImages.path}) FILTER (WHERE ${propertyImages.isCover}), NULL)`,
    })
    .from(properties)
    .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
    .where(and(eq(properties.status, "publicado"), ne(properties.slug, slug)))
    .groupBy(properties.id)
    .orderBy(desc(properties.publishedAt))
    .limit(limit);
  return rows.map(mapRowToProperty);
}

export async function listTipos(): Promise<string[]> {
  const all = await findPublishedList();
  return Array.from(new Set(all.map((p) => p.tag)));
}

export async function listSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: properties.slug })
    .from(properties)
    .where(eq(properties.status, "publicado"));
  return rows.map((r) => r.slug);
}

export async function countPublished(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(properties)
    .where(eq(properties.status, "publicado"));
  return Number(result[0]?.count || 0);
}
