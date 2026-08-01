import { Reveal } from "@/components/site/reveal";
import { testimonials } from "@/lib/data";

export function Depoimentos() {
  return (
    <section id="depoimentos" data-nav="Depoimentos" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <Reveal>
        <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Depoimentos</span>
        <h2 className="font-display mt-5 max-w-xl text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
          O que nossos clientes têm a dizer.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-7 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 120}>
            <div className="h-full rounded-2xl bg-kenesis-cream p-8">
              <p className="font-display text-xl leading-snug text-kenesis-greenDark">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-kenesis-greenDark">{t.name}</div>
                  <div className="text-[12px] text-neutral-500">{t.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
