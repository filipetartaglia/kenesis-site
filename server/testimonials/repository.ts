import { db } from "@/db/client";
import { testimonials } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export async function findPublishedTestimonials() {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));

  return rows;
}

export function getTestimonialImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return path;

  // Assuming we upload testimonial photos to a 'testimonials' bucket
  return `${supabaseUrl}/storage/v1/object/public/testimonials/${path}`;
}
