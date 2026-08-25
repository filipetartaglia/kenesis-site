"use server";

import { db } from "@/db/client";
import { properties, propertyImages, propertySlugHistory } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --------------- Tipos do formulário ---------------

export type PropertyFormState = {
  error?: string;
  success?: boolean;
};

type PropertyFormData = {
  title: string;
  slug: string;
  description: string;
  propertyType: "casa" | "apartamento" | "terreno" | "empreendimento" | "cobertura" | "comercial";
  segment?: "medio_padrao" | "alto_padrao" | null;
  purpose: "venda" | "locacao";
  status: "rascunho" | "publicado" | "reservado" | "vendido" | "arquivado";
  priceCents?: number | null;
  priceLabel?: string | null;
  priceVisible: boolean;
  condoFeeCents?: number | null;
  iptuCents?: number | null;
  areaTotalM2?: string | null;
  areaBuiltM2?: string | null;
  areasOptions?: string[] | null;
  bedrooms?: number | null;
  suites?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zip?: string | null;
  addressStreet?: string | null;
  isFeatured: boolean;
  featuredOrder?: number | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  addressVisible: boolean;
  features?: string[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

// --------------- Helpers ---------------

function parseCurrency(value: string | null | undefined): number | null {
  if (!value) return null;
  // Remove R$, pontos, espaços e troca vírgula por ponto
  const cleaned = value.replace(/[R$\s.]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  return Math.round(num * 100); // converter para centavos
}

function parseIntOrNull(value: string | null | undefined): number | null {
  if (!value) return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
}

function parseDecimalOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num.toString();
}

function extractFormData(formData: FormData): PropertyFormData {
  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    propertyType: formData.get("propertyType") as PropertyFormData["propertyType"],
    segment: (formData.get("segment") as PropertyFormData["segment"]) || null,
    purpose: (formData.get("purpose") as PropertyFormData["purpose"]) || "venda",
    status: (formData.get("status") as PropertyFormData["status"]) || "rascunho",
    priceCents: parseCurrency(formData.get("priceCents") as string),
    priceLabel: (formData.get("priceLabel") as string) || null,
    priceVisible: formData.get("priceVisible") === "on",
    condoFeeCents: parseCurrency(formData.get("condoFeeCents") as string),
    iptuCents: parseCurrency(formData.get("iptuCents") as string),
    areaTotalM2: parseDecimalOrNull(formData.get("areaTotalM2") as string),
    areaBuiltM2: parseDecimalOrNull(formData.get("areaBuiltM2") as string),
    areasOptions: (() => {
      try {
        const raw = JSON.parse((formData.get("areasOptions") as string) || "[]");
        return Array.isArray(raw) && raw.length > 0 ? raw : null;
      } catch { return null; }
    })(),
    bedrooms: parseIntOrNull(formData.get("bedrooms") as string),
    suites: parseIntOrNull(formData.get("suites") as string),
    bathrooms: parseIntOrNull(formData.get("bathrooms") as string),
    parkingSpaces: parseIntOrNull(formData.get("parkingSpaces") as string),
    neighborhood: (formData.get("neighborhood") as string) || null,
    city: (formData.get("city") as string) || "Niterói",
    state: (formData.get("state") as string) || "RJ",
    zip: (formData.get("zip") as string) || null,
    addressStreet: (formData.get("addressStreet") as string) || null,
    addressNumber: (formData.get("addressNumber") as string) || null,
    addressComplement: (formData.get("addressComplement") as string) || null,
    addressVisible: formData.get("addressVisible") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    featuredOrder: parseIntOrNull(formData.get("featuredOrder") as string),
    features: (() => {
      try {
        const raw = JSON.parse((formData.get("features") as string) || "[]");
        return Array.isArray(raw) && raw.length > 0 ? raw : null;
      } catch { return null; }
    })(),
    metaTitle: (formData.get("metaTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };
}

// --------------- Actions ---------------

export async function createProperty(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("properties.create");

  const data = extractFormData(formData);

  if (!data.title || !data.slug || !data.propertyType) {
    return { error: "Título, slug e tipo do imóvel são obrigatórios." };
  }

  try {
    // Verificar slug duplicado
    const existing = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.slug, data.slug))
      .limit(1);

    if (existing.length > 0) {
      return { error: `O slug "${data.slug}" já está em uso. Escolha outro.` };
    }

    const [created] = await db
      .insert(properties)
      .values({
        ...data,
        publishedAt: data.status === "publicado" ? new Date() : null,
      })
      .returning({ id: properties.id, slug: properties.slug });

    // Salvar imagens que vieram no formulário (paths separados por vírgula no campo hidden)
    const imagePaths = (formData.get("imagePaths") as string)?.split(",").filter(Boolean) || [];
    const coverPath = formData.get("coverPath") as string;

    if (imagePaths.length > 0) {
      await db.insert(propertyImages).values(
        imagePaths.map((path, i) => ({
          propertyId: created.id,
          path,
          sortOrder: i,
          isCover: path === coverPath,
        }))
      );
    }

    revalidatePath("/", "layout");
  } catch (e: any) {
    console.error("Erro ao criar imóvel:", e);
    return { error: e.message || "Erro interno ao criar o imóvel." };
  }

  redirect("/admin/imoveis");
}

export async function updateProperty(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const id = formData.get("id") as string;
  if (!id) return { error: "ID do imóvel não informado." };

  const data = extractFormData(formData);

  const { requirePermission } = await import("@/server/auth");
  await requirePermission("properties.update");

  if (!data.title || !data.slug || !data.propertyType) {
    return { error: "Título, slug e tipo do imóvel são obrigatórios." };
  }

  try {
    // Verificar slug duplicado (excluindo o imóvel atual)
    const existing = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.slug, data.slug))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== id) {
      return { error: `O slug "${data.slug}" já está em uso por outro imóvel.` };
    }

    // Buscar status e slug anterior
    const [current] = await db
      .select({ status: properties.status, publishedAt: properties.publishedAt, slug: properties.slug })
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    // Salvar slug antigo no histórico se mudou (301 redirect)
    if (current && current.slug !== data.slug) {
      await db.insert(propertySlugHistory)
        .values({ propertyId: id, slug: current.slug })
        .onConflictDoNothing();
    }

    let publishedAt = current?.publishedAt ?? null;
    if (data.status === "publicado" && current?.status !== "publicado") {
      publishedAt = new Date();
    }

    await db
      .update(properties)
      .set({
        ...data,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id));

    // Atualizar imagens: apagar as existentes e reinserir
    const imagePaths = (formData.get("imagePaths") as string)?.split(",").filter(Boolean) || [];
    const coverPath = formData.get("coverPath") as string;

    await db.delete(propertyImages).where(eq(propertyImages.propertyId, id));

    if (imagePaths.length > 0) {
      await db.insert(propertyImages).values(
        imagePaths.map((path, i) => ({
          propertyId: id,
          path,
          sortOrder: i,
          isCover: path === coverPath,
        }))
      );
    }

    revalidatePath("/", "layout");
  } catch (e: any) {
    console.error("Erro ao atualizar imóvel:", e);
    return { error: e.message || "Erro interno ao atualizar o imóvel." };
  }

  redirect("/admin/imoveis");
}

export async function deleteProperty(id: string): Promise<{ error?: string }> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("properties.delete");

  try {
    await db.delete(properties).where(eq(properties.id, id));

    revalidatePath("/", "layout");

    return {};
  } catch (e: any) {
    console.error("Erro ao excluir imóvel:", e);
    return { error: e.message || "Erro interno ao excluir o imóvel." };
  }
}

// --------------- Query para o admin ---------------

export type AdminProperty = {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  neighborhood: string | null;
  city: string;
  priceCents: number | null;
  priceVisible: boolean;
  status: string;
  isFeatured: boolean;
  coverImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type AdminFilters = {
  search?: string;
  status?: string;
  tipo?: string;
};

export async function findAllForAdmin(filters?: AdminFilters): Promise<AdminProperty[]> {
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(properties.status, filters.status as any));
  }
  if (filters?.tipo) {
    conditions.push(eq(properties.propertyType, filters.tipo as any));
  }
  if (filters?.search) {
    conditions.push(sql`(${properties.title} ILIKE ${'%' + filters.search + '%'} OR ${properties.slug} ILIKE ${'%' + filters.search + '%'})`);
  }

  const rows = await db
    .select({
      id: properties.id,
      title: properties.title,
      slug: properties.slug,
      propertyType: properties.propertyType,
      neighborhood: properties.neighborhood,
      city: properties.city,
      priceCents: properties.priceCents,
      priceVisible: properties.priceVisible,
      status: properties.status,
      isFeatured: properties.isFeatured,
      coverImage: sql<string | null>`(
        SELECT ${propertyImages.path} FROM ${propertyImages}
        WHERE ${propertyImages.propertyId} = ${properties.id}
        ORDER BY ${propertyImages.isCover} DESC, ${propertyImages.sortOrder} ASC
        LIMIT 1
      )`,
      publishedAt: properties.publishedAt,
      createdAt: properties.createdAt,
    })
    .from(properties)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(properties.createdAt));

  return rows as AdminProperty[];
}

export async function togglePropertyStatus(
  id: string,
  newStatus: "publicado" | "arquivado"
): Promise<{ error?: string }> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("properties.publish");

  try {
    const updates: Record<string, any> = {
      status: newStatus,
      updatedAt: new Date(),
    };
    if (newStatus === "publicado") {
      // Set publishedAt only if not already set
      const [current] = await db
        .select({ publishedAt: properties.publishedAt })
        .from(properties)
        .where(eq(properties.id, id))
        .limit(1);
      if (!current?.publishedAt) {
        updates.publishedAt = new Date();
      }
    }

    await db.update(properties).set(updates).where(eq(properties.id, id));

    revalidatePath("/", "layout");
    return {};
  } catch (e: any) {
    return { error: e.message || "Erro ao alterar status." };
  }
}

export async function toggleFeatured(
  id: string,
  isFeatured: boolean
): Promise<{ error?: string }> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("properties.update");

  try {
    await db
      .update(properties)
      .set({ isFeatured, updatedAt: new Date() })
      .where(eq(properties.id, id));

    revalidatePath("/", "layout");
    return {};
  } catch (e: any) {
    return { error: e.message || "Erro ao alterar destaque." };
  }
}

// Para popular o formulário de edição
export type AdminPropertyFull = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  propertyType: string;
  segment: string | null;
  purpose: string;
  status: string;
  priceCents: number | null;
  priceLabel: string | null;
  priceVisible: boolean;
  condoFeeCents: number | null;
  iptuCents: number | null;
  areaTotalM2: string | null;
  areaBuiltM2: string | null;
  areasOptions: string[] | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zip: string | null;
  addressStreet: string | null;
  isFeatured: boolean;
  featuredOrder: number | null;
  addressNumber: string | null;
  addressComplement: string | null;
  addressVisible: boolean;
  features: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  images: { path: string; isCover: boolean; sortOrder: number }[];
};

export async function findOneForAdmin(id: string): Promise<AdminPropertyFull | null> {
  const [row] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);

  if (!row) return null;

  const imgs = await db
    .select({
      path: propertyImages.path,
      isCover: propertyImages.isCover,
      sortOrder: propertyImages.sortOrder,
    })
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, id))
    .orderBy(propertyImages.sortOrder);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    propertyType: row.propertyType,
    segment: row.segment,
    purpose: row.purpose,
    status: row.status,
    priceCents: row.priceCents,
    priceLabel: row.priceLabel ?? null,
    priceVisible: row.priceVisible,
    condoFeeCents: row.condoFeeCents,
    iptuCents: row.iptuCents,
    areaTotalM2: row.areaTotalM2,
    areaBuiltM2: row.areaBuiltM2,
    areasOptions: row.areasOptions ?? null,
    bedrooms: row.bedrooms,
    suites: row.suites,
    bathrooms: row.bathrooms,
    parkingSpaces: row.parkingSpaces,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    zip: row.zip,
    addressStreet: row.addressStreet,
    isFeatured: row.isFeatured,
    featuredOrder: row.featuredOrder,
    addressNumber: row.addressNumber,
    addressComplement: row.addressComplement,
    addressVisible: row.addressVisible,
    features: row.features,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    images: imgs,
  };
}
