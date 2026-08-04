import type { Property } from "@/types";

const gallery = (slug: string, count: number) =>
  Array.from(
    { length: count },
    (_, index) => `/imoveis/${slug}/${String(index + 1).padStart(2, "0")}.webp`
  );

const property = (
  values: Omit<Property, "img" | "gallery"> & { imageCount: number; coverIndex?: number }
): Property => {
  const images = gallery(values.slug, values.imageCount);
  const { imageCount: _imageCount, coverIndex = 1, ...details } = values;
  return { ...details, img: images[coverIndex - 1] || images[0], gallery: images };
};

export const properties: Property[] = [
  property({
    id: 1, slug: "mansao-jardim-uba", imageCount: 8, tag: "Alto padrão",
    title: "Mansão no Jardim Ubá I", location: "Jardim Ubá I, Niterói, RJ",
    price: "Consulte valores", beds: 5, baths: 6, garage: 6, area: "450 m²",
    desc: "Uma residência exclusiva em condomínio no Jardim Ubá I, com espaços generosos para receber, viver e aproveitar a natureza de Niterói.",
  }),
  property({
    id: 2, slug: "casa-andreia-jardim-uba", imageCount: 8, tag: "Casa",
    title: "Casa no Jardim Ubá I", location: "Jardim Ubá I, Niterói, RJ",
    price: "Consulte valores", area: "Residencial",
    desc: "Casa em condomínio, pensada para a rotina da família e para quem busca tranquilidade, segurança e uma localização especial.",
  }),
  property({
    id: 3, slug: "casa-3-suites-sao-francisco", imageCount: 7, tag: "Casa",
    title: "Casa com 3 suítes em São Francisco", location: "São Francisco, Niterói, RJ",
    price: "Consulte valores", beds: 3, area: "Residencial",
    desc: "Uma casa elegante em São Francisco, perto da orla, dos restaurantes e de toda a praticidade de um dos bairros mais desejados de Niterói.",
  }),
  property({
    id: 4, slug: "lotes-beverly-hills", imageCount: 5, tag: "Terreno",
    title: "Dois lotes em Beverly Hills", location: "Beverly Hills, Niterói, RJ",
    price: "Consulte valores", area: "405 m²",
    desc: "Dois lotes juntos em condomínio, uma oportunidade para desenvolver um projeto residencial com mais liberdade e privacidade.",
  }),
  property({
    id: 5, slug: "pau-brasil-sao-francisco", imageCount: 8, tag: "Empreendimento",
    title: "Residencial Pau Brasil", location: "São Francisco, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um empreendimento residencial em São Francisco, criado para conectar bem-estar, design e uma das localizações mais valorizadas de Niterói.",
  }),
  property({
    id: 6, slug: "uni-home-studio", imageCount: 8, tag: "Empreendimento",
    title: "Uni Home Studio", location: "Niterói, RJ",
    price: "Consulte condições", area: "Studios",
    desc: "Studios contemporâneos para morar ou investir, com soluções práticas para uma vida urbana mais leve.",
  }),
  property({
    id: 7, slug: "cury-orla-central", imageCount: 8, tag: "Empreendimento",
    title: "Orla Central", location: "Centro, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um novo endereço conectado ao ritmo de Niterói, com a conveniência do Centro e a proximidade da Baía de Guanabara.",
  }),
  property({
    id: 8, slug: "conviva-icarai", imageCount: 8, coverIndex: 2, tag: "Empreendimento",
    title: "Conviva Icaraí", location: "Icaraí, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Apartamentos com arquitetura contemporânea e áreas de convivência desenhadas para aproveitar o melhor de Icaraí.",
  }),
  property({
    id: 9, slug: "conviva-piratininga", imageCount: 8, tag: "Empreendimento",
    title: "Conviva Piratininga", location: "Piratininga, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um jeito novo de morar perto da praia, com conforto, lazer e a atmosfera única da Região Oceânica.",
  }),
  property({
    id: 10, slug: "conviva-camboinhas", imageCount: 8, tag: "Empreendimento",
    title: "Conviva Camboinhas", location: "Camboinhas, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Endereço especial em Camboinhas para quem valoriza paisagem, qualidade de vida e um projeto cuidadosamente concebido.",
  }),
  property({
    id: 11, slug: "life-inga", imageCount: 8, tag: "Empreendimento",
    title: "Life Ingá", location: "Ingá, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um empreendimento que combina mobilidade, vista e a energia de um dos bairros mais tradicionais de Niterói.",
  }),
  property({
    id: 12, slug: "life-camboinhas", imageCount: 8, tag: "Empreendimento",
    title: "Life Camboinhas", location: "Camboinhas, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um novo capítulo em Camboinhas, com ambientes voltados ao bem-estar e à conexão com o entorno.",
  }),
  property({
    id: 13, slug: "brise-camboinhas", imageCount: 8, coverIndex: 2, tag: "Empreendimento",
    title: "Brise by Conviva", location: "Camboinhas, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Brise traz leveza, arquitetura e espaços de lazer para uma experiência de morar junto ao melhor de Camboinhas.",
  }),
  property({
    id: 14, slug: "soma", imageCount: 8, tag: "Empreendimento",
    title: "Soma", location: "Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um empreendimento Proart que soma design, praticidade e espaços pensados para o dia a dia.",
  }),
  property({
    id: 15, slug: "jardim-dos-manacas", imageCount: 8, tag: "Empreendimento",
    title: "Jardim dos Manacás", location: "Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Arquitetura e paisagismo em equilíbrio para criar uma experiência residencial acolhedora e contemporânea.",
  }),
  property({
    id: 16, slug: "up-icarai", imageCount: 8, tag: "Empreendimento",
    title: "Up Icaraí", location: "Icaraí, Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um endereço em Icaraí para viver com mobilidade, conveniência e a sofisticação que o bairro inspira.",
  }),
  property({
    id: 17, slug: "sunset", imageCount: 8, tag: "Empreendimento",
    title: "Sunset", location: "Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Espaços contemporâneos e uma atmosfera acolhedora para um novo jeito de viver em Niterói.",
  }),
  property({
    id: 18, slug: "stage", imageCount: 6, tag: "Empreendimento",
    title: "Stage", location: "Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um projeto Proart com identidade marcante, áreas comuns sofisticadas e experiências que acompanham o seu ritmo.",
  }),
  property({
    id: 19, slug: "nirvana", imageCount: 8, tag: "Empreendimento",
    title: "Nirvana", location: "Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um residencial para desacelerar, aproveitar os espaços de lazer e viver com mais equilíbrio todos os dias.",
  }),
  property({
    id: 20, slug: "althea", imageCount: 1, tag: "Empreendimento",
    title: "Althea", location: "Niterói, RJ",
    price: "Consulte condições", area: "Lançamento",
    desc: "Um empreendimento Joama para quem busca um novo endereço em Niterói. Consulte a equipe Kenesis para receber o material completo e as condições vigentes.",
  }),
];
