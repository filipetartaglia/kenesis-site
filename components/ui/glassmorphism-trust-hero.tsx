"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full overflow-hidden bg-kenesis-greenDark text-white">
      <style>{`
        @keyframes kenesisFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kfade { animation: kenesisFadeUp 1s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .kd1 { animation-delay: 0.05s; }
        .kd2 { animation-delay: 0.18s; }
        .kd3 { animation-delay: 0.34s; }
        .kd4 { animation-delay: 0.48s; }
      `}</style>

      {/* ── Background: full-bleed photo ─────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imagens/site/Imagem-principal-site.jpeg')" }}
      />
      {/* Green tint overlay — gives the signature Kenesis green feel over the photo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(2,35,31,0.82) 0%, rgba(3,66,59,0.60) 45%, rgba(3,66,59,0.30) 100%)",
        }}
      />
      {/* Subtle green color cast on the whole image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "rgba(3, 66, 59, 0.22)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Top/bottom fade to blend with header & next section */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,35,31,0.60) 0%, transparent 18%, transparent 75%, rgba(2,35,31,0.70) 100%)",
        }}
      />

      {/* ── Content — left-aligned, Boma-style ───────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 pb-20 pt-28 sm:px-12 sm:pt-36 lg:px-20 xl:px-28">
        {/* Overline */}
        <p className="kfade kd1 mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-kenesis-lime/80">
          Niterói &amp; Região
        </p>

        {/* Main headline — Fraunces display, large and left-aligned */}
        <h1 className="kfade kd2 font-display max-w-2xl text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] tracking-tight">
          O imóvel certo
          <br />
          <span className="text-kenesis-lime">para o seu</span>
          <br />
          momento.
        </h1>

        {/* Subtitle */}
        <p className="kfade kd3 mt-5 sm:mt-7 max-w-md text-[14px] sm:text-[15px] leading-relaxed text-white/60">
          Casas, apartamentos, terrenos e empreendimentos —
          com assessoria completa do primeiro contato até a entrega das chaves.
        </p>

        {/* CTAs */}
        <div className="kfade kd4 mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Link
            href="/imoveis"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-kenesis-lime px-8 py-4 text-[13px] font-bold text-kenesis-greenDark transition-all hover:scale-[1.03] hover:bg-[#b8d01f] active:scale-[0.98] sm:w-auto"
          >
            Ver imóveis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/8 px-8 py-4 text-[13px] font-bold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/12 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com especialista
          </a>
        </div>

        {/* Location tag — Boma-style bottom-left pill */}
        <div className="mt-12 sm:mt-16 flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 items-center justify-center">
            <span className="block h-2 w-2 rounded-full bg-white/50 ring-2 ring-white/20" />
          </span>
          <span className="text-[12px] font-medium text-white/55">
            Niterói, Rio de Janeiro
          </span>
        </div>
      </div>
    </section>
  );
}
