"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyFilters } from "@/components/site/property-filters";
import { Footer } from "@/components/site/footer";
import { properties } from "@/lib/data";

export default function ImoveisPage() {
  const tipos = ["Todos", ...Array.from(new Set(properties.map((p) => p.tag)))];
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? properties : properties.filter((p) => p.tag === filter);

  return (
    <>
      <Header />
      <div className="relative z-10 min-h-screen overflow-hidden rounded-b-[2rem] bg-white shadow-[0_30px_80px_rgba(2,35,31,0.35)]">
        <div className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-10">
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Portfólio completo</span>
          <h1 className="font-display mt-4 text-4xl text-kenesis-greenDark lg:text-5xl">Todos os imóveis</h1>

          <div className="mt-8">
            <PropertyFilters tipos={tipos} active={filter} onChange={setFilter} />
          </div>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-10 text-sm text-neutral-500">Nenhum imóvel encontrado para esse filtro.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
