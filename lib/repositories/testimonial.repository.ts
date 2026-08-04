/**
 * Repository para depoimentos.
 * Nesta fase consome dados estáticos. Futuramente apontará para o banco de dados.
 */

import type { Testimonial } from "@/types";
import { testimonials } from "@/lib/content/testimonials";

export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}
