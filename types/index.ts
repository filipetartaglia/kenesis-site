/** Core domain types for the Kenesis platform */

export interface Property {
  id: number;
  slug: string;
  tag: string;
  title: string;
  location: string;
  price: string;
  note?: string;
  beds?: number;
  baths?: number;
  garage?: number;
  area?: string;
  desc: string;
  img: string;
  gallery: string[];
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
