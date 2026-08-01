import { PropertyCard } from "@/components/site/property-card";
import { Reveal } from "@/components/site/reveal";
import { properties } from "@/lib/data";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function Destaques() {
  return (
    <section className="bg-kenesis-green px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-lime">Propriedades</span>
            <h2 className="font-display mt-5 text-4xl text-white lg:text-5xl">Destaques da semana</h2>
          </div>
          <InteractiveHoverButton
            text="Ver todos os imóveis"
            href="/imoveis"
            className="border-white/30 bg-white/10 text-white"
          />
        </Reveal>
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {properties.slice(0, 4).map((p, i) => (
            <PropertyCard key={p.id} p={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
