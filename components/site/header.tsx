"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { HOME_SECTIONS } from "@/lib/data";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { cn } from "@/lib/utils";

const TAB_IDS = ["Imóveis", ...HOME_SECTIONS];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Sobre");

  // Slide-tab hover state
  const [hovered, setHovered] = useState<string | null>(null);
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.nav || "")
        ),
      { threshold: 0.4 }
    );
    HOME_SECTIONS.forEach((n) => {
      const el = document.getElementById(n.toLowerCase());
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [isHome]);

  // Update sliding indicator position
  useEffect(() => {
    const key = hovered ?? (isHome ? active : null);
    if (!key) {
      setIndicator((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const el = tabRefs.current[key];
    if (!el) return;
    const parent = el.closest("nav");
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - parentRect.left,
      width: rect.width,
      opacity: 1,
    });
  }, [hovered, active, isHome]);

  const navItems = isHome
    ? ["Imóveis", ...HOME_SECTIONS]
    : ["Início", "Imóveis", "Contato"];

  const solid = scrolled || !isHome;

  const getHref = (item: string) => {
    if (item === "Imóveis") return "/imoveis";
    if (item === "Início") return "/";
    if (!isHome && item === "Contato") return "/#contato";
    return `#${item.toLowerCase()}`;
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: solid ? "rgba(3,66,59,0.94)" : "transparent",
        backdropFilter: solid ? "blur(8px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Kenesis" className="h-9 w-9" />
          <span className="font-display text-xl tracking-[0.15em] text-white">KENESIS</span>
        </Link>

        {/* Desktop nav — slide tabs */}
        <nav
          className="relative hidden items-center lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Sliding highlight */}
          <motion.div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10"
            animate={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ height: "calc(100% - 4px)" }}
          />

          <div className="flex items-center gap-1 px-1">
            {navItems.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                ref={(el) => {
                  tabRefs.current[item] = el;
                }}
                onMouseEnter={() => setHovered(item)}
                className={cn(
                  "relative z-10 rounded-full px-4 py-2 text-[13px] font-medium tracking-wide text-white transition-opacity",
                  isHome && active === item ? "opacity-100" : "opacity-70 hover:opacity-100"
                )}
              >
                {item}
                {/* Active underline */}
                {isHome && active === item && (
                  <span className="absolute -bottom-1 left-1/2 h-[2px] w-3 -translate-x-1/2 rounded-full bg-kenesis-lime" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hidden lg:block">
          <InteractiveHoverButton
            text="Falar com especialista"
            href="https://wa.me/5521976248282"
            target="_blank"
            rel="noreferrer"
            className="border-white/30 bg-white/10 text-white"
          />
        </div>

        {/* Mobile hamburger */}
        <button className="text-white lg:hidden" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? (
            <X size={22} />
          ) : (
            <div className="space-y-1.5">
              <span className="block h-[1.5px] w-6 bg-current" />
              <span className="block h-[1.5px] w-6 bg-current" />
            </div>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-5 bg-kenesis-green px-6 pb-8 lg:hidden">
          {navItems.map((item) => (
            <a
              key={item}
              href={getHref(item)}
              className="text-sm text-white"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <InteractiveHoverButton
            text="Falar com especialista"
            href="https://wa.me/5521976248282"
            target="_blank"
            rel="noreferrer"
            className="w-fit border-white/30 bg-white/10 text-white"
          />
        </div>
      )}
    </header>
  );
}
