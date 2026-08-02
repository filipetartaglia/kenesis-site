import { Reveal } from "@/components/site/reveal";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export function Depoimentos() {
  return (
    <section
      id="depoimentos"
      data-nav="Depoimentos"
      className="py-28 lg:py-36"
    >
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">
            Depoimentos
          </span>
          <h2 className="font-display mt-5 max-w-xl text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
            O que nossos clientes têm a dizer.
          </h2>
        </Reveal>
      </div>

      {/* Stagger carousel — sem overflow:hidden para não cortar ao rolar */}
      <div className="relative mt-14">
        <StaggerTestimonials />
      </div>
    </section>
  );
}
