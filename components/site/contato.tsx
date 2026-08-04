import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { siteConfig } from "@/lib/config";

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
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="border-white/30 bg-white/10 text-white"
          />
          <InteractiveHoverButton
            text="Enviar e-mail"
            href={siteConfig.links.email}
            className="border-white/30 bg-white/10 text-white"
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-24 flex max-w-4xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-[13px] text-white/60 sm:flex-row">
        <span className="font-display text-base tracking-widest text-white">{siteConfig.name.toUpperCase()}</span>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a href={siteConfig.links.phone} className="flex items-center gap-1.5">
            <Phone size={14} /> {siteConfig.phoneFormatted}
          </a>
          <a href={siteConfig.links.email} className="flex items-center gap-1.5">
            <Mail size={14} /> {siteConfig.email}
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {siteConfig.addressShort}
          </span>
          <a href={siteConfig.social.instagram.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
            <Instagram size={16} /> {siteConfig.social.instagram.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
