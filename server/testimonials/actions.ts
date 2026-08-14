"use server";

import { db } from "@/db/client";
import { testimonials } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AdminTestimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  photoPath: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
};

export async function findAllTestimonialsForAdmin(): Promise<AdminTestimonial[]> {
  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));

  return rows;
}

export async function getTestimonialById(id: string): Promise<AdminTestimonial | null> {
  const [row] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);

  return row || null;
}

export type TestimonialFormState = {
  error?: string;
  success?: boolean;
};

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("testimonials.create");

  const authorName = formData.get("authorName") as string;
  const authorRole = formData.get("authorRole") as string | null;
  const quote = formData.get("quote") as string;
  const photoPath = formData.get("photoPath") as string | null;
  const isPublished = formData.get("isPublished") === "on";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!authorName || !quote) {
    return { error: "Nome e depoimento são obrigatórios." };
  }

  try {
    await db.insert(testimonials).values({
      authorName,
      authorRole: authorRole || null,
      quote,
      photoPath: photoPath || null,
      isPublished,
      sortOrder,
    });

    revalidatePath("/admin/depoimentos");
    revalidatePath("/");
  } catch (e: any) {
    return { error: e.message || "Erro ao criar depoimento." };
  }

  redirect("/admin/depoimentos");
}

export async function updateTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("testimonials.update");

  const id = formData.get("id") as string;
  const authorName = formData.get("authorName") as string;
  const authorRole = formData.get("authorRole") as string | null;
  const quote = formData.get("quote") as string;
  const photoPath = formData.get("photoPath") as string | null;
  const isPublished = formData.get("isPublished") === "on";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!id || !authorName || !quote) {
    return { error: "ID, nome e depoimento são obrigatórios." };
  }

  try {
    await db
      .update(testimonials)
      .set({
        authorName,
        authorRole: authorRole || null,
        quote,
        photoPath: photoPath || null,
        isPublished,
        sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id));

    revalidatePath("/admin/depoimentos");
    revalidatePath("/");
  } catch (e: any) {
    return { error: e.message || "Erro ao atualizar depoimento." };
  }

  redirect("/admin/depoimentos");
}

export async function deleteTestimonial(id: string): Promise<{ error?: string }> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("testimonials.delete");

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidatePath("/admin/depoimentos");
    revalidatePath("/");
    return {};
  } catch (e: any) {
    return { error: e.message || "Erro ao excluir depoimento." };
  }
}

export async function toggleTestimonialPublished(
  id: string,
  isPublished: boolean
): Promise<{ error?: string }> {
  const { requirePermission } = await import("@/server/auth");
  await requirePermission("testimonials.update");

  try {
    await db
      .update(testimonials)
      .set({ isPublished, updatedAt: new Date() })
      .where(eq(testimonials.id, id));
    revalidatePath("/admin/depoimentos");
    revalidatePath("/");
    return {};
  } catch (e: any) {
    return { error: e.message || "Erro ao atualizar status." };
  }
}
