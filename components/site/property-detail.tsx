"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Bed, Bath, Car, Maximize2 } from "lucide-react";
import { Property, properties } from "@/lib/data";
import { ExpandMap } from "@/components/site/expand-map";
import { PropertyCard } from "@/components/site/property-card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function PropertyDetail({ property }: { property: Property }) {
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);
  const others = properties.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 lg:px-10">
      <Link href="/imoveis" className="flex items-center gap-1.5 text-[13px] font-medium text-kenesis-green">
        <ChevronLeft size={16} /> Voltar para imóveis
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.gallery[active]} alt={property.title} className="h-[420px] w-full object-cover" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {property.gallery.map((g, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="overflow-hidden rounded-xl"
            style={{ outline: active === i ? "2px solid #A1BA1F" : "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g} alt="" className="h-24 w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="rounded-full bg-kenesis-cream px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-kenesis-green">
            {property.tag}
          </span>
          <h1 className="font-display mt-4 text-3xl text-kenesis-greenDark lg:text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
            <MapPin size={15} />
            {property.location}
          </p>
          <p className="font-display mt-4 text-3xl text-kenesis-green">{property.price}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              property.beds && [Bed, `${property.beds} quartos`],
              property.baths && [Bath, `${property.baths} banheiros`],
              property.garage && [Car, `${property.garage} vagas`],
              property.area && [Maximize2, property.area],
            ].filter(Boolean).map(([Icon, label]: any) => (
              <div key={label} className="rounded-xl bg-kenesis-cream p-4 text-center">
                <Icon size={20} className="mx-auto text-kenesis-green" />
                <div className="mt-2 text-[12px] font-medium text-neutral-600">{label}</div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-neutral-600">{property.desc}</p>

          <div className="mt-8">
            <ExpandMap label={property.location} />
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-kenesis-cream p-7">
          <h3 className="font-display text-xl text-kenesis-greenDark">Tenho interesse</h3>
          <p className="mt-1 text-[13px] text-neutral-600">Preencha e um corretor entra em contato.</p>
          {sent ? (
            <div className="mt-6 rounded-xl bg-white p-5 text-sm text-kenesis-green">
              Recebido! Em breve alguém da equipe fala com você.
            </div>
          ) : (
            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                required
                placeholder="Nome"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <input
                required
                placeholder="Telefone / WhatsApp"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <input
                required
                type="email"
                placeholder="E-mail"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <textarea
                rows={3}
                placeholder="Mensagem (opcional)"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <InteractiveHoverButton type="submit" text="Enviar interesse" className="w-full bg-kenesis-lime" />
            </form>
          )}
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-20">
          <h3 className="font-display text-2xl text-kenesis-greenDark">Imóveis semelhantes</h3>
          <div className="mt-8 grid gap-7 sm:grid-cols-3">
            {others.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
