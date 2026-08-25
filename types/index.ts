/** Core domain types for the Kenesis platform */

export interface Property {
  id: string;
  slug: string;
  tag: string;
  title: string;
  location: string;
  price: string;
  priceLabel?: string | null;  // Texto livre de preço ex: "A partir de R$ 450.000"
  note?: string;
  beds?: number;
  baths?: number;
  garage?: number;
  area?: string;
  areas?: string[] | null;    // Múltiplas opções de área útil (empreendimentos)
  desc: string;
  img: string;
  gallery: string[];
  features?: string[] | null; // Comodidades e diferenciais
}

export interface TeamMember {
  name: string;
  role: string;
  location: string;
  bio?: string;
  photo?: string;
  whatsapp?: string;
  instagram?: string;
  initials?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  img: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Categoria {
  title: string;
  desc: string;
}

export interface Servico {
  title: string;
  desc: string;
}
