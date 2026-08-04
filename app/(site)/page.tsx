import { Hero } from "@/components/site/hero";
import { Sobre } from "@/components/site/sobre";
import { Categorias } from "@/components/site/categorias";
import { Destaques } from "@/components/site/destaques";
import { Servicos } from "@/components/site/servicos";
import { Equipe } from "@/components/site/equipe";
import { Depoimentos } from "@/components/site/depoimentos";
import { Faq } from "@/components/site/faq";
import { countPublished, findFeatured } from "@/server/properties/repository";
import { findPublicTeam } from "@/server/users/repository";

// Header, Footer e o wrapper vêm de app/(site)/layout.tsx.
//
// A página é quem fala com a camada de dados e entrega pronto aos componentes.
// É o único lugar do app onde server/ pode ser importado.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Sobre />
      <Categorias />
      <Destaques properties={findFeatured(6)} total={countPublished()} />
      <Servicos />
      <Equipe members={findPublicTeam()} />
      <Depoimentos />
      <Faq />
    </>
  );
}
