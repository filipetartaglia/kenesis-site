import type { Categoria, Servico } from "@/types";

export const categorias: Categoria[] = [
  { title: "Imóveis prontos", desc: "Casas e apartamentos de médio e alto padrão prontos para morar." },
  { title: "Terrenos", desc: "Terrenos para construir com mais liberdade, privacidade e localização privilegiada." },
  { title: "Empreendimentos", desc: "Lançamentos para morar ou investir em Niterói e região." },
];

export const servicos: Servico[] = [
  { title: "Assessoria Imobiliária", desc: "Atendimento personalizado para encontrar o imóvel certo para o seu momento — do médio ao alto padrão, com suporte em cada etapa da negociação." },
  { title: "Suporte Cartorial", desc: "Auxiliamos em toda a documentação: escritura, registro de imóvel, processos cartoriais e jurídicos para uma compra ou venda tranquila e segura." },
  { title: "Crédito e Financiamento", desc: "Orientação financeira para avaliar as melhores condições de financiamento e tornar a conquista do seu imóvel mais acessível." },
];
