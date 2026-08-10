"use server";

import { db } from "@/db/client";
import { leads, properties } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CreateLeadInput = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  propertyId?: string;
};

export async function createLead(data: CreateLeadInput): Promise<{ error?: string }> {
  try {
    if (!data.phone && !data.email) {
      return { error: "Telefone ou e-mail é obrigatório." };
    }

    await db.insert(leads).values({
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      message: data.message || null,
      propertyId: data.propertyId || null,
    });

    // Revalidate admin dashboard and leads page
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return {};
  } catch (e: any) {
    console.error("Erro ao criar lead:", e);
    return { error: "Não foi possível enviar seu interesse. Tente novamente." };
  }
}

export type AdminFilters = {
  search?: string;
  status?: string;
};

export type AdminLead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
  propertyTitle: string | null;
  propertySlug: string | null;
};

export async function findAllLeadsForAdmin(filters?: AdminFilters): Promise<AdminLead[]> {
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(leads.status, filters.status as any));
  }
  if (filters?.search) {
    conditions.push(sql`(${leads.name} ILIKE ${'%' + filters.search + '%'} OR ${leads.email} ILIKE ${'%' + filters.search + '%'})`);
  }

  const rows = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      message: leads.message,
      status: leads.status,
      createdAt: leads.createdAt,
      propertyTitle: properties.title,
      propertySlug: properties.slug,
    })
    .from(leads)
    .leftJoin(properties, eq(leads.propertyId, properties.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(leads.createdAt));

  return rows as AdminLead[];
}

export async function updateLeadStatus(id: string, status: "novo" | "em_atendimento" | "convertido" | "perdido"): Promise<{ error?: string }> {
  try {
    await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id));
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return {};
  } catch (e: any) {
    return { error: e.message || "Erro ao atualizar status." };
  }
}
