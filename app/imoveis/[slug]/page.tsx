import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { PropertyDetail } from "@/components/site/property-detail";
import { Footer } from "@/components/site/footer";
import { properties } from "@/lib/data";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default function ImovelPage({ params }: { params: { slug: string } }) {
  const property = properties.find((p) => p.slug === params.slug);
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
