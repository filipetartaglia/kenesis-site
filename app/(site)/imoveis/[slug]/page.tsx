import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { PropertyDetail } from "@/components/site/property-detail";
import { Footer } from "@/components/site/footer";
import {
  findPublishedBySlug,
  findSimilar,
  listSlugs,
} from "@/server/properties/repository";

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export default async function ImovelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = findPublishedBySlug(slug);
  if (!property) return notFound();

  return (
    <>
      <Header />
      <div className="relative z-10 min-h-screen overflow-hidden rounded-b-[2rem] bg-white shadow-[0_30px_80px_rgba(2,35,31,0.35)]">
        <PropertyDetail property={property} similar={findSimilar(property.slug, 3)} />
      </div>
      <Footer />
    </>
  );
}
