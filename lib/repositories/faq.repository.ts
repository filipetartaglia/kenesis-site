/**
 * Repository para FAQ.
 * Nesta fase consome dados estáticos. Futuramente apontará para o banco de dados.
 */

import type { FAQ } from "@/types";
import { faqs } from "@/lib/content/faq";

export function getAllFaqs(): FAQ[] {
  return faqs;
}
