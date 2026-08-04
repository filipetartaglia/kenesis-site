/**
 * Barrel re-export para manter compatibilidade com imports existentes.
 * Novos componentes devem importar dos repositórios ou de lib/content/*.
 *
 * @deprecated Use os repositórios em lib/repositories/ ou os módulos em lib/content/.
 */

export type { Property, TeamMember, Testimonial, FAQ, Categoria, Servico } from "@/types";

export { properties } from "@/lib/content/properties";
export { equipe } from "@/lib/content/team";
export { testimonials } from "@/lib/content/testimonials";
export { faqs } from "@/lib/content/faq";
export { categorias, servicos } from "@/lib/content/sections";

import { siteConfig } from "@/lib/config";
export const HOME_SECTIONS = siteConfig.homeSections;
