import Link from "next/link";
import { Property } from "@/lib/data";
import { Reveal } from "@/components/site/reveal";

export function PropertyCard({ p, delay = 0 }: { p: Property; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link href={`/imoveis/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-kenesis-greenDark">
        <div className="relative h-56 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.img}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute left-3 top-3 rounded-full bg-kenesis-lime px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-kenesis-greenDark">
            {p.tag}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg text-white">{p.title}</h3>
          <p className="mt-1 text-[13px] text-white/60">{p.location}</p>
          <p className="mt-3 text-[15px] font-medium text-kenesis-lime">
            {p.price} {p.note && <span className="font-normal text-white/50">· {p.note}</span>}
          </p>
          <span className="mt-4 inline-block text-[13px] font-medium text-white underline">Ver imóvel →</span>
        </div>
      </Link>
    </Reveal>
  );
}
