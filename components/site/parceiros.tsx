import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Reveal } from "@/components/site/reveal";

interface Parceiro {
  name: string;
  logo: string;
  width: number;
  height: number;
}

const PARCEIROS: Parceiro[] = [
  { name: "ProArt Engenharia", logo: "/parceiros/proart.svg", width: 180, height: 65 },
  { name: "Cury Construtora", logo: "/parceiros/cury.svg", width: 160, height: 60 },
  { name: "Conviva Engenharia", logo: "/parceiros/conviva.svg", width: 190, height: 70 },
  { name: "Althea", logo: "/parceiros/althea.svg", width: 150, height: 55 },
  { name: "Ofra", logo: "/parceiros/ofra.svg", width: 130, height: 55 },
];

function LogoCard({ name, logo, width, height }: Parceiro) {
  return (
    <div
      className="group flex h-20 w-48 sm:h-24 sm:w-56 flex-shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white px-6 sm:px-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-kenesis-green/25 hover:shadow-lg"
      title={name}
      aria-label={name}
    >
      <Image
        src={logo}
        alt={`Logo ${name}`}
        width={width}
        height={height}
        className="h-10 sm:h-12 w-auto object-contain opacity-75 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        loading="lazy"
      />
    </div>
  );
}

export function Parceiros() {
  return (
    <section id="parceiros" data-nav="Parceiros" className="overflow-hidden bg-kenesis-cream py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-kenesis-green">
            Parceiros
          </span>
          <h2 className="font-display mt-4 max-w-xl text-3xl sm:text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
            Empresas que confiam na Kenesis.
          </h2>
          <p className="mt-4 max-w-lg text-[14px] sm:text-[15px] leading-relaxed text-neutral-500">
            Trabalhamos em parceria com as principais construtoras da região para oferecer
            os melhores empreendimentos a nossos clientes.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 sm:mt-14">
        <InfiniteSlider
          gap={20}
          duration={35}
          durationOnHover={70}
          className="px-6"
        >
          {PARCEIROS.map((p) => (
            <LogoCard key={p.name} {...p} />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
