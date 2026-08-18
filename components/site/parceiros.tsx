import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Reveal } from "@/components/site/reveal";

const PARCEIROS = [
  { name: "Proat", abbr: "PROAT" },
  { name: "Cury", abbr: "CURY" },
  { name: "Conviva", abbr: "CONVIVA" },
  { name: "Althea", abbr: "ALTHEA" },
  { name: "Ofra", abbr: "OFRA" },
];

function LogoCard({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div
      className="flex h-20 w-44 flex-shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-kenesis-green/30 hover:shadow-md"
      title={name}
    >
      <span className="font-display text-xl font-semibold tracking-tight text-kenesis-greenDark opacity-70 hover:opacity-100 transition-opacity">
        {abbr}
      </span>
    </div>
  );
}

export function Parceiros() {
  return (
    <section id="parceiros" data-nav="Parceiros" className="overflow-hidden bg-kenesis-cream py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">
            Parceiros
          </span>
          <h2 className="font-display mt-5 max-w-xl text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
            Empresas que confiam na Kenesis.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-neutral-500">
            Trabalhamos em parceria com as principais construtoras da região para oferecer
            os melhores empreendimentos a nossos clientes.
          </p>
        </Reveal>
      </div>

      <div className="mt-14">
        <InfiniteSlider
          gap={24}
          duration={30}
          durationOnHover={60}
          className="px-6"
        >
          {PARCEIROS.map((p) => (
            <LogoCard key={p.name} name={p.name} abbr={p.abbr} />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
