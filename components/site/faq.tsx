"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { faqs } from "@/lib/data";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-kenesis-green/15 py-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="font-display text-lg pr-6 text-kenesis-greenDark">{q}</span>
        <ChevronDown
          size={18}
          className="flex-shrink-0 text-kenesis-green transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div style={{ maxHeight: open ? 200 : 0 }} className="overflow-hidden transition-[max-height] duration-400 ease-in-out">
        <p className="max-w-2xl pt-3 text-[14px] leading-relaxed text-neutral-600">{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" data-nav="FAQ" className="bg-kenesis-cream px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">
            <HelpCircle size={14} />
            Perguntas frequentes
          </span>
          <h2 className="font-display mt-5 text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">Dúvidas comuns.</h2>
        </Reveal>
        <div className="mt-10">
          {faqs.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
