"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-kenesis-greenDark text-white">
      <style>{`
        @keyframes kenesisFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kfade { animation: kenesisFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .kd1 { animation-delay: 0.08s; }
        .kd2 { animation-delay: 0.22s; }
        .kd3 { animation-delay: 0.38s; }
        .kd4 { animation-delay: 0.52s; }
      `}</style>

      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/imagens/site/Imagem-principal-site.jpeg')",
        }}
      />
      {/* Overlay gradient — darker at top/bottom, slightly translucent in middle */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-kenesis-greenDark via-kenesis-greenDark/60 to-kenesis-greenDark" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div className="kfade kd1 mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kenesis-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-kenesis-lime" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Kenesis Imobiliária · Niterói &amp; Região
          </span>
        </div>

        {/* Main headline */}
        <h1 className="kfade kd2 font-display max-w-4xl text-5xl leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem]">
          O imóvel certo{" "}
          <span className="bg-gradient-to-br from-kenesis-lime via-[#c5db4a] to-white bg-clip-text text-transparent">
            para o seu momento.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="kfade kd3 mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          Casas, apartamentos, terrenos e empreendimentos em Niterói e região —
          com assessoria completa do primeiro contato até a entrega das chaves.
        </p>

        {/* CTAs */}
        <div className="kfade kd4 mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/imoveis"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-kenesis-lime px-9 py-4 text-sm font-bold text-kenesis-greenDark transition-all hover:scale-[1.03] hover:bg-[#c5db4a] active:scale-[0.98]"
          >
            Ver imóveis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-9 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com especialista
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex animate-bounce flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] uppercase tracking-widest text-white">Explore</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
