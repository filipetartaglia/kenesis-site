import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Sobre } from "@/components/site/sobre";
import { Categorias } from "@/components/site/categorias";
import { Destaques } from "@/components/site/destaques";
import { Servicos } from "@/components/site/servicos";
import { Equipe } from "@/components/site/equipe";
import { Depoimentos } from "@/components/site/depoimentos";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { countPublished, findFeatured } from "@/server/properties/repository";
import { findPublicTeam } from "@/server/users/repository";

// A página é quem fala com a camada de dados e entrega pronto aos componentes.
// É o único lugar do app onde server/ pode ser importado.
export default function HomePage() {
  return (
    <>
      <Header />
      <div className="relative z-10 overflow-hidden rounded-b-[2rem] bg-white shadow-[0_30px_80px_rgba(2,35,31,0.35)]">
        <Hero />
        <Sobre />
        <Categorias />
        <Destaques properties={findFeatured(6)} total={countPublished()} />
        <Servicos />
        <Equipe members={findPublicTeam()} />
        <Depoimentos />
        <Faq />
      </div>
      <Footer />
    </>
  );
}
