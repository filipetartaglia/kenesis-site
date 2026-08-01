import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function Contato() {
  return (
    <section id="contato" data-nav="Contato" className="relative overflow-hidden bg-kenesis-greenDark px-6 py-28 lg:px-10 lg:py-36">
      <Reveal className="mx-auto max-w-4xl text-center">
        <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-lime">Fale conosco</span>
        <h2 className="font-display mt-5 text-4xl leading-tight text-white lg:text-6xl">
          Vamos encontrar o seu próximo endereço.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <InteractiveHoverButton
            text="Falar no WhatsApp"
            href="https://wa.me/5521976248282"
            target="_blank"
            rel="noreferrer"
            className="border-white/30 bg-white/10 text-white"
          />
          <InteractiveHoverButton
            text="Enviar e-mail"
            href="mailto:kenesisimoveis@gmail.com"
            className="border-white/30 bg-white/10 text-white"
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-24 flex max-w-4xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-[13px] text-white/60 sm:flex-row">
        <span className="font-display text-base tracking-widest text-white">KENESIS</span>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a href="tel:+5521976248282" className="flex items-center gap-1.5">
            <Phone size={14} /> (21) 97624-8282
          </a>
          <a href="mailto:kenesisimoveis@gmail.com" className="flex items-center gap-1.5">
            <Mail size={14} /> kenesisimoveis@gmail.com
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> Niterói, RJ
          </span>
          <a href="https://www.instagram.com/kenesis.imoveis/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
            <Instagram size={16} /> @kenesis.imoveis
          </a>
        </div>
      </div>
    </section>
  );
}
