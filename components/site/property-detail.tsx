"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Bed, Bath, Car, Maximize2 } from "lucide-react";
import type { Property } from "@/types";
import { ExpandMap } from "@/components/site/expand-map";
import { PropertyCard } from "@/components/site/property-card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { createLead } from "@/server/leads/actions";
import { siteConfig } from "@/lib/config";

// `similar` chega pronto do servidor. Calcular aqui obrigava a importar o
// acervo inteiro em toda página de imóvel — e como este componente é
// "use client", os 20 imóveis viajavam no bundle de cada uma delas.
export function PropertyDetail({ property, similar }: { property: Property; similar: Property[] }) {
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirectLoading, setIsDirectLoading] = useState(false);

  async function handleDirectWhatsApp() {
    setIsDirectLoading(true);
    // Salva um lead "anônimo" para registro
    await createLead({
      name: "Contato Direto (WhatsApp)",
      phone: "Não informado",
      propertyId: property.id,
    });
    setIsDirectLoading(false);
    
    const text = `Olá, tenho interesse no imóvel: ${property.title}.`;
    const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      propertyId: property.id,
    };

    const result = await createLead(data);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      const text = `Olá, meu nome é ${data.name}. Tenho interesse no imóvel: ${property.title}.`;
      const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank");
      setSent(true);
    }
  }

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
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
                  {error}
                </div>
              )}
              <input
                required
                name="name"
                placeholder="Nome"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <input
                required
                name="phone"
                placeholder="Telefone / WhatsApp"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <textarea
                name="message"
                rows={3}
                placeholder="Mensagem (opcional)"
                className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2"
              />
              <div className="flex flex-col gap-3 pt-2">
                <InteractiveHoverButton 
                  type="submit" 
                  text={isSubmitting ? "Processando..." : "Enviar e Chamar WhatsApp"} 
                  className="w-full bg-kenesis-lime text-kenesis-greenDark" 
                />
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 px-4 text-[11px] text-gray-400 uppercase tracking-wider font-semibold">ou</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button 
                  type="button" 
                  onClick={handleDirectWhatsApp}
                  disabled={isDirectLoading}
                  className="w-full rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#20ba59] disabled:opacity-50"
                >
                  {isDirectLoading ? "Abrindo..." : "Falar direto no WhatsApp"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-20">
          <h3 className="font-display text-2xl text-kenesis-greenDark">Imóveis semelhantes</h3>
          <div className="mt-8 grid gap-7 sm:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
