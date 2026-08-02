"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  Landmark,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const HIGHLIGHTS = [
  { name: "Casas", icon: Home },
  { name: "Apartamentos", icon: Building2 },
  { name: "Terrenos", icon: Landmark },
  { name: "Lançamentos", icon: Sparkles },
  { name: "Niterói", icon: MapPin },
  { name: "Alto padrão", icon: ShieldCheck },
];

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
      <span className="font-display text-xl text-white sm:text-2xl">{value}</span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/50 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-kenesis-greenDark text-white">
      <style>{`
        @keyframes kenesisFadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kenesisMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .kenesis-hero-fade {
          animation: kenesisFadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .kenesis-hero-marquee {
          animation: kenesisMarquee 40s linear infinite;
        }
        .kenesis-d-100 { animation-delay: 0.1s; }
        .kenesis-d-200 { animation-delay: 0.2s; }
        .kenesis-d-300 { animation-delay: 0.3s; }
        .kenesis-d-400 { animation-delay: 0.4s; }
        .kenesis-d-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Full-bleed property background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/imagens/site/Imagem-principal-site.jpeg')",
          opacity: 0.45,
          maskImage: "linear-gradient(180deg, transparent, black 8%, black 72%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 8%, black 72%, transparent)",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-kenesis-greenDark/80 via-kenesis-greenDark/55 to-kenesis-greenDark" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 md:pb-20 md:pt-36 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left */}
          <div className="flex flex-col justify-center space-y-8 pt-4 lg:col-span-7 lg:pt-8">
            <div className="kenesis-hero-fade kenesis-d-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-kenesis-lime sm:text-xs">
                  Kenesis Imobiliária · Niterói &amp; Região
                </span>
              </div>
            </div>

            <h1 className="kenesis-hero-fade kenesis-d-200 font-display text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Entre no
              <br />
              <span className="bg-gradient-to-br from-white via-white to-kenesis-lime bg-clip-text text-transparent">
                alto padrão.
              </span>
            </h1>

            <p className="kenesis-hero-fade kenesis-d-300 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Imóveis de médio e alto padrão, terrenos e lançamentos para encontrar o endereço que combina com você.
            </p>

            <div className="kenesis-hero-fade kenesis-d-400 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/imoveis"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-kenesis-lime px-8 py-4 text-sm font-semibold text-kenesis-greenDark transition-all hover:scale-[1.02] hover:bg-[#b4ce2a] active:scale-[0.98]"
              >
                Ver imóveis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="https://wa.me/5521976248282"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com especialista
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6 lg:col-span-5 lg:mt-8">
            <div className="kenesis-hero-fade kenesis-d-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-kenesis-lime/10 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kenesis-lime/15 ring-1 ring-kenesis-lime/30">
                    <Home className="h-6 w-6 text-kenesis-lime" />
                  </div>
                  <div>
                    <div className="font-display text-3xl tracking-tight text-white">340+</div>
                    <div className="text-sm text-white/55">imóveis catalogados</div>
                  </div>
                </div>

                <div className="mb-8 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/55">Compromisso com o resultado</span>
                    <span className="font-medium text-kenesis-lime">100%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-kenesis-lime to-[#c5db4a]" />
                  </div>
                </div>

                <div className="mb-6 h-px w-full bg-white/10" />

                <div className="grid grid-cols-3 gap-2 text-center">
                  <StatItem value="180+" label="Ativos" />
                  <StatItem value="2 mil+" label="Clientes" />
                  <StatItem value="Niterói" label="Região" />
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-white/75">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kenesis-lime opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-kenesis-lime" />
                    </span>
                    ATENDIMENTO ATIVO
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-white/75">
                    <ShieldCheck className="h-3 w-3 text-kenesis-lime" />
                    MÉDIO E ALTO PADRÃO
                  </div>
                </div>
              </div>
            </div>

            <div className="kenesis-hero-fade kenesis-d-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-white/55">O que você encontra na Kenesis</h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
                }}
              >
                <div className="kenesis-hero-marquee flex gap-12 whitespace-nowrap px-4">
                  {[...HIGHLIGHTS, ...HIGHLIGHTS, ...HIGHLIGHTS].map((item, i) => (
                    <div
                      key={`${item.name}-${i}`}
                      className="flex cursor-default items-center gap-2 opacity-55 transition-all hover:scale-105 hover:opacity-100"
                    >
                      <item.icon className="h-5 w-5 text-kenesis-lime" />
                      <span className="text-lg font-semibold tracking-tight text-white">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
