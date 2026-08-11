import { db } from "@/db/client";
import { testimonials } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { storageUrl } from "@/lib/supabase/storage";

export async function findPublishedTestimonials() {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));

  return rows;
}

export function getTestimonialImageUrl(path: string | null) {
  return storageUrl("testimonials", path);
}
