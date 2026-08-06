import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/site/property-detail";
import {
  findPublishedBySlug,
  findSimilar,
  listSlugs,
} from "@/server/properties/repository";

// Header, Footer e o wrapper vêm de app/(site)/layout.tsx.

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export default async function ImovelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = findPublishedBySlug(slug);
  if (!property) return notFound();

  return <PropertyDetail property={property} similar={findSimilar(property.slug, 3)} />;
}
