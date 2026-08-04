"use client";

import { Reveal } from "@/components/site/reveal";
import { FaqMonochrome } from "@/components/ui/faq-monochrome";
// Conteúdo estático, sem repositório — mesmo motivo de categorias.tsx.
import { faqs } from "@/lib/content/faq";

export function Faq() {
  return (
    <section id="faq" data-nav="FAQ" className="bg-kenesis-cream px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">
            Perguntas frequentes
          </span>
          <h2 className="font-display mt-5 text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
            Dúvidas comuns.
          </h2>
        </Reveal>
        <div className="mt-12">
          <FaqMonochrome items={faqs} />
        </div>
      </div>
    </section>
  );
}
