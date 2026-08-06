import { Reveal } from "@/components/site/reveal";
import { categorias } from "@/lib/content/sections";
import { Home, Landmark, Building2 } from "lucide-react";

// Importa lib/content direto, sem repositório: categorias não vão para o banco
// (spec D3), então nunca existirá outra implementação para trocar. Repositório
// aqui seria uma camada que só repassa uma constante.
const icons = [Home, Landmark, Building2];

export function Categorias() {
  return (
    <section id="categorias" data-nav="Categorias" className="bg-kenesis-cream px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Categorias</span>
          <h2 className="font-display mt-5 max-w-lg text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
            Encontre o imóvel certo para você.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {categorias.map((c, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={c.title} delay={i * 120}>
                <div className="h-full rounded-2xl bg-white p-8 shadow-sm">
                  <Icon size={26} className="text-kenesis-green" />
                  <h3 className="font-display mt-5 text-xl text-kenesis-greenDark">{c.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{c.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
