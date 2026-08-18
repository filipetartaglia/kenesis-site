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

      {/* ── Background: full-bleed photo, left side slightly darker ─────── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imagens/site/Imagem-principal-site.jpeg')" }}
      />
      {/* Thin dark veil — left stronger, right nearly transparent so photo breathes */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, rgba(2,35,31,0.72) 0%, rgba(2,35,31,0.38) 55%, rgba(2,35,31,0.12) 100%)",
        }}
      />
      {/* Subtle top/bottom fade to blend with the header & footer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,35,31,0.55) 0%, transparent 20%, transparent 80%, rgba(2,35,31,0.65) 100%)",
        }}
      />

      {/* ── Content — left-aligned, Boma-style ───────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col justify-center px-8 pb-24 pt-36 sm:px-12 lg:px-20 xl:px-28">
        {/* Overline */}
        <p className="kfade kd1 mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-kenesis-lime/80">
          Niterói &amp; Região
        </p>

        {/* Main headline — Fraunces display, large and left-aligned */}
        <h1 className="kfade kd2 font-display max-w-2xl text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.93] tracking-tight">
          O imóvel certo
          <br />
          <span className="text-kenesis-lime">para o seu</span>
          <br />
          momento.
        </h1>

        {/* Subtitle */}
        <p className="kfade kd3 mt-7 max-w-md text-[15px] leading-relaxed text-white/60">
          Casas, apartamentos, terrenos e empreendimentos —
          com assessoria completa do primeiro contato até a entrega das chaves.
        </p>

        {/* CTAs */}
        <div className="kfade kd4 mt-10 flex flex-wrap gap-4">
          <Link
            href="/imoveis"
            className="group inline-flex items-center gap-2.5 rounded-full bg-kenesis-lime px-8 py-4 text-[13px] font-bold text-kenesis-greenDark transition-all hover:scale-[1.03] hover:bg-[#b8d01f] active:scale-[0.98]"
          >
            Ver imóveis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/8 px-8 py-4 text-[13px] font-bold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/12"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com especialista
          </a>
        </div>

        {/* Location tag — Boma-style bottom-left pill */}
        <div className="mt-16 flex items-center gap-2.5">
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
