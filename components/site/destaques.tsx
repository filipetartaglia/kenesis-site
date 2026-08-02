"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/site/property-card";
import { Reveal } from "@/components/site/reveal";
import { properties } from "@/lib/data";
import { cn } from "@/lib/utils";

const FEATURED = properties.slice(0, 6);

export function Destaques() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section id="destaques" className="bg-kenesis-green py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-lime">
            Propriedades
          </span>
          <h2 className="font-display mt-5 text-4xl text-white lg:text-5xl">
            Destaques da semana
          </h2>
        </Reveal>
      </div>

      {/* Wrapper com setas laterais posicionadas ao centro */}
      <div className="relative mt-12">

        {/* Seta ESQUERDA — fica ao lado dos cards */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Anterior"
          className={cn(
            "absolute left-2 top-1/2 z-20 -translate-y-1/2 lg:left-4",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "border border-white/20 bg-kenesis-greenDark/80 text-white backdrop-blur-sm",
            "transition-all duration-200 shadow-xl",
            canScrollLeft
              ? "opacity-100 hover:bg-kenesis-lime hover:text-kenesis-greenDark hover:border-kenesis-lime cursor-pointer"
              : "opacity-0 pointer-events-none"
          )}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Seta DIREITA */}
        <button
          onClick={() => scroll("right")}
          disabled={atEnd}
          aria-label="Próximo"
          className={cn(
            "absolute right-2 top-1/2 z-20 -translate-y-1/2 lg:right-4",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "border border-white/20 bg-kenesis-greenDark/80 text-white backdrop-blur-sm",
            "transition-all duration-200 shadow-xl",
            !atEnd
              ? "opacity-100 hover:bg-kenesis-lime hover:text-kenesis-greenDark hover:border-kenesis-lime cursor-pointer"
              : "opacity-0 pointer-events-none"
          )}
        >
          <ChevronRight size={22} />
        </button>

        {/* Scroll horizontal */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-2 lg:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {FEATURED.map((p, i) => (
            <div key={p.id} className="w-[300px] flex-none snap-center sm:w-[320px]">
              <PropertyCard p={p} delay={i * 80} />
            </div>
          ))}

          {/* Card "Ver todos" — aparece naturalmente no final */}
          <div className="w-[260px] flex-none self-stretch snap-center sm:w-[280px]">
            <Link
              href="/imoveis"
              className={cn(
                "group flex h-full min-h-[340px] flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed transition-all duration-500",
                "border-white/20 bg-white/5 hover:border-kenesis-lime hover:bg-white/10",
                atEnd && "border-kenesis-lime/70 bg-white/8 shadow-[0_0_40px_rgba(161,186,31,0.2)]"
              )}
            >
              <div className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-500",
                "border-white/20 text-white/60 group-hover:border-kenesis-lime group-hover:text-kenesis-lime",
                atEnd && "border-kenesis-lime text-kenesis-lime"
              )}>
                <ArrowRight size={26} />
              </div>
              <div className="text-center">
                <p className={cn(
                  "font-display text-lg font-medium transition-colors",
                  "text-white/70 group-hover:text-white",
                  atEnd && "text-white"
                )}>
                  Ver todos os imóveis
                </p>
                <p className="mt-1 text-sm text-white/40">
                  {properties.length} propriedades
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Gradiente lateral direito */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 h-full w-20 transition-opacity duration-500",
            "bg-gradient-to-l from-kenesis-green to-transparent",
            atEnd ? "opacity-0" : "opacity-100"
          )}
        />
        {/* Gradiente lateral esquerdo */}
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 h-full w-20 transition-opacity duration-500",
            "bg-gradient-to-r from-kenesis-green to-transparent",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </section>
  );
}
