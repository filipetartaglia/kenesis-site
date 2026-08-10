import { notFound, redirect } from "next/navigation";
import { PropertyDetail } from "@/components/site/property-detail";
import {
  findPublishedBySlug,
  findSimilar,
  findCurrentSlugByOldSlug,
  listSlugs,
} from "@/server/properties/repository";

// Header, Footer e o wrapper vêm de app/(site)/layout.tsx.

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ImovelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await findPublishedBySlug(slug);

  if (!property) {
    // Antes de 404, verifica se é um slug antigo que foi alterado
    const currentSlug = await findCurrentSlugByOldSlug(slug);
    if (currentSlug) {
      redirect(`/imoveis/${currentSlug}`);
    }
    return notFound();
  }

  const similar = await findSimilar(property.slug, 3);
  return <PropertyDetail property={property} similar={similar} />;
}
