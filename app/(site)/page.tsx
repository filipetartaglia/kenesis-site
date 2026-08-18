import { Hero } from "@/components/site/hero";
import { Sobre } from "@/components/site/sobre";
import { Categorias } from "@/components/site/categorias";
import { Destaques } from "@/components/site/destaques";
import { Servicos } from "@/components/site/servicos";
import { Parceiros } from "@/components/site/parceiros";
import { Equipe } from "@/components/site/equipe";
import { Depoimentos } from "@/components/site/depoimentos";
import { Faq } from "@/components/site/faq";
import { findFeatured, countPublished } from "@/server/properties/repository";
import { findPublicTeam } from "@/server/users/repository";

// Header, Footer e o wrapper vêm de app/(site)/layout.tsx.
//
// A página é quem fala com a camada de dados e entrega pronto aos componentes.
// É o único lugar do app onde server/ pode ser importado.

/**
 * A equipe agora vem do Postgres, então a home não pode mais ser congelada no
 * build: um membro editado no painel precisa aparecer sem novo deploy.
 *
 * ISR em vez de force-dynamic — a home continua servida como estática e
 * revalida em segundo plano a cada 5 min. Quando a publicação pelo painel
 * existir, isto vira revalidateTag() e a atualização passa a ser imediata
 * (spec §5, item 9).
 */
export const revalidate = 300;

export default async function HomePage() {
  const members = await findPublicTeam();
  const featured = await findFeatured(6);
  const total = await countPublished();

  return (
    <>
      <Hero />
      <Sobre />
      <Categorias />
      <Destaques properties={featured} total={total} />
      <Servicos />
      <Parceiros />
      <Equipe members={members} />
      <Depoimentos />
      <Faq />
    </>
  );
}
