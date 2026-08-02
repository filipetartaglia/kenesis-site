"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: rgba(255,255,255,0.06);
  --pill-bg-2: rgba(255,255,255,0.02);
  --pill-shadow: rgba(2,35,31,0.55);
  --pill-highlight: rgba(255,255,255,0.12);
  --pill-inset-shadow: rgba(2,35,31,0.45);
  --pill-border: rgba(255,255,255,0.12);
  --pill-bg-1-hover: rgba(161,186,31,0.18);
  --pill-bg-2-hover: rgba(255,255,255,0.04);
  --pill-border-hover: rgba(161,186,31,0.45);
  --pill-shadow-hover: rgba(2,35,31,0.7);
  --pill-highlight-hover: rgba(255,255,255,0.2);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(161,186,31,0.22) 0%,
    rgba(3,66,59,0.35) 42%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: #fff;
}

.footer-giant-bg-text {
  font-family: var(--font-display), serif;
  font-size: 22vw;
  line-height: 0.75;
  font-weight: 450;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.42) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 24px rgba(161,186,31,0.18));
}
`;

type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Alto padrão em Niterói</span>
    <span className="text-kenesis-lime/70">✦</span>
    <span>Atendimento próximo</span>
    <span className="text-kenesis-lime/70">✦</span>
    <span>Negociação segura</span>
    <span className="text-kenesis-lime/70">✦</span>
    <span>Casas · Apartamentos · Terrenos</span>
    <span className="text-kenesis-lime/70">✦</span>
    <span>Lançamentos exclusivos</span>
    <span className="text-kenesis-lime/70">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: giantTextRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="contato" data-nav="Contato" aria-label="Contato">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div ref={wrapperRef}>
        <footer className="cinematic-footer-wrapper relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-kenesis-greenDark text-white">
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          <div
            ref={giantTextRef}
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[4vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
          >
            KENESIS
          </div>

          <div className="absolute left-0 top-12 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-white/10 bg-kenesis-greenDark/70 py-4 shadow-2xl backdrop-blur-md">
            <div className="animate-footer-scroll-marquee flex w-max text-xs font-bold uppercase tracking-[0.3em] text-white/45 md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-kenesis-lime">
              Kenesis Imobiliária · Niterói e região
            </p>
            <h2
              ref={headingRef}
              className="footer-text-glow mb-10 text-center font-display text-4xl tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Pronto para encontrar
              <br />
              o seu próximo imóvel?
            </h2>

            <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
              <div className="flex w-full flex-wrap justify-center gap-4">
                <MagneticButton
                  as="a"
                  href="https://wa.me/5521976248282"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-white md:text-base"
                >
                  Falar com a Kenesis
                  <ArrowUpRight className="h-5 w-5 text-kenesis-lime transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </MagneticButton>

                <MagneticButton
                  as={Link}
                  href="/imoveis"
                  className="footer-glass-pill flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-white md:text-base"
                >
                  Ver todos os imóveis
                </MagneticButton>
              </div>

              <div className="mt-2 flex w-full flex-wrap justify-center gap-3 md:gap-5">
                <MagneticButton
                  as={Link}
                  href="/#sobre"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-white/65 hover:text-white md:text-sm"
                >
                  Sobre nós
                </MagneticButton>
                <MagneticButton
                  as={Link}
                  href="/#serviços"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-white/65 hover:text-white md:text-sm"
                >
                  Serviços
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://www.instagram.com/kenesis.imoveis/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-white/65 hover:text-white md:text-sm"
                >
                  Instagram
                </MagneticButton>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/55 sm:text-sm">
                <a href="tel:+5521976248282" className="inline-flex items-center gap-2 hover:text-kenesis-lime">
                  <Phone size={14} /> (21) 97624-8282
                </a>
                <a href="mailto:kenesisimoveis@gmail.com" className="inline-flex items-center gap-2 hover:text-kenesis-lime">
                  <Mail size={14} /> kenesisimoveis@gmail.com
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} /> Niterói, Rio de Janeiro
                </span>
                <a
                  href="https://www.instagram.com/kenesis.imoveis/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-kenesis-lime"
                >
                  <Instagram size={14} /> @kenesis.imoveis
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
            <div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-white/45 md:order-1 md:text-xs">
              © {new Date().getFullYear()} Kenesis Imobiliária. Todos os direitos reservados.
            </div>

            <div className="footer-glass-pill order-1 flex cursor-default items-center gap-2 rounded-full border-white/10 px-6 py-3 md:order-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/55 md:text-xs">
                Alto padrão em
              </span>
              <span className="font-display text-sm tracking-wide text-kenesis-lime md:text-base">Niterói</span>
            </div>

            <MagneticButton
              as="button"
              type="button"
              onClick={scrollToTop}
              aria-label="Voltar ao início"
              className="footer-glass-pill order-3 flex h-12 w-12 items-center justify-center rounded-full text-white/60 hover:text-white"
            >
              <svg className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </section>
  );
}
