/**
 * Configurações centralizadas da Kenesis Imobiliária.
 * Todos os componentes devem consumir este arquivo em vez de valores hardcoded.
 */

export const siteConfig = {
  /** Nome da empresa */
  name: "Kenesis",
  nameFull: "Kenesis Imobiliária",

  /** Descrição padrão para SEO */
  description:
    "Imóveis de médio e alto padrão em Niterói, Rio de Janeiro e região. Casas, apartamentos, terrenos e empreendimentos.",

  /** Contato */
  phone: "+5521976248282",
  phoneFormatted: "(21) 97624-8282",
  email: "kenesisimoveis@gmail.com",
  whatsapp: "5521976248282",

  /** Localização */
  address: "Niterói, Rio de Janeiro",
  addressShort: "Niterói, RJ",

  /** Redes sociais */
  social: {
    instagram: {
      url: "https://www.instagram.com/kenesis.imoveis/",
      handle: "@kenesis.imoveis",
    },
  },

  /** Links externos */
  links: {
    whatsapp: "https://wa.me/5521976248282",
    phone: "tel:+5521976248282",
    email: "mailto:kenesisimoveis@gmail.com",
  },

  /** Seções de navegação da home */
  homeSections: ["Sobre", "Categorias", "Serviços", "Equipe", "Depoimentos", "FAQ", "Contato"],
} as const;
