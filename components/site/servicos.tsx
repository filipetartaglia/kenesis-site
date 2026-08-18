import { Reveal } from "@/components/site/reveal";
import { servicos } from "@/lib/content/sections";
import { Search, FileText, CreditCard } from "lucide-react";

// Conteúdo estático, sem repositório — mesmo motivo de categorias.tsx.
const icons = [Search, FileText, CreditCard];

export function Servicos() {
  return (
    <section id="serviços" data-nav="Serviços" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <Reveal>
        <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">O que oferecemos</span>
        <h2 className="font-display mt-5 max-w-lg text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
          Suporte completo do interesse à chave na mão.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {servicos.map((s, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={s.title} delay={i * 120}>
              <div className="h-full rounded-2xl bg-kenesis-cream p-8">
                <Icon size={26} className="text-kenesis-green" />
                <h3 className="font-display mt-5 text-xl text-kenesis-greenDark">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{s.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
