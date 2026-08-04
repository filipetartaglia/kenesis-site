import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { PropertyDetail } from "@/components/site/property-detail";
import { Footer } from "@/components/site/footer";
import { getPropertyBySlug, getAllSlugs } from "@/lib/repositories/property.repository";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ImovelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return notFound();

  return (
    <>
      <Header />
      <div className="relative z-10 min-h-screen overflow-hidden rounded-b-[2rem] bg-white shadow-[0_30px_80px_rgba(2,35,31,0.35)]">
        <PropertyDetail property={property} />
      </div>
      <Footer />
    </>
  );
}
