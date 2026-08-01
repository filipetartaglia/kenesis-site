"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { HOME_SECTIONS } from "@/lib/data";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Sobre");

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
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.nav || "")),
      { threshold: 0.4 }
    );
    HOME_SECTIONS.forEach((n) => {
      const el = document.getElementById(n.toLowerCase());
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [isHome]);

  const navItems = isHome ? ["Imóveis", ...HOME_SECTIONS] : ["Início", "Imóveis", "Contato"];
  const solid = scrolled || !isHome;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: solid ? "rgba(3,66,59,0.94)" : "transparent",
        backdropFilter: solid ? "blur(8px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="font-display text-xl tracking-[0.15em] text-white">
          KENESIS
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) =>
            item === "Imóveis" || item === "Início" ? (
              <Link
                key={item}
                href={item === "Imóveis" ? "/imoveis" : "/"}
                className="relative text-[13px] font-medium tracking-wide text-white opacity-80 hover:opacity-100"
              >
                {item}
              </Link>
            ) : (
              <a
                key={item}
                href={`/${item === "Contato" && !isHome ? "#contato" : `#${item.toLowerCase()}`}`}
                className="relative text-[13px] font-medium tracking-wide text-white transition-opacity"
                style={{ opacity: active === item ? 1 : 0.8 }}
              >
                {item}
                {isHome && active === item && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full bg-kenesis-lime" />
                )}
              </a>
            )
          )}
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

      {menuOpen && (
        <div className="flex flex-col gap-5 bg-kenesis-green px-6 pb-8 lg:hidden">
          {navItems.map((item) => (
            <a
              key={item}
              href={item === "Imóveis" ? "/imoveis" : item === "Início" ? "/" : `/#${item.toLowerCase()}`}
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
