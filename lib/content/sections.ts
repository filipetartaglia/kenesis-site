import type { Categoria, Servico } from "@/types";

export const categorias: Categoria[] = [
  { title: "Imóveis prontos", desc: "Casas e apartamentos de médio e alto padrão prontos para morar." },
  { title: "Terrenos", desc: "Terrenos para construir com mais liberdade, privacidade e localização privilegiada." },
  { title: "Empreendimentos", desc: "Lançamentos para morar ou investir em Niterói e região." },
];

export const servicos: Servico[] = [
  { title: "Imóveis", desc: "Opções de médio e alto padrão para morar, investir ou começar um novo projeto." },
  { title: "Corretores", desc: "Atendimento próximo para entender seu momento, tirar dúvidas e organizar visitas." },
  { title: "Equipe financeira", desc: "Apoio para avaliar financiamento e encontrar a melhor condição para sua compra." },
];
