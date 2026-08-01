import { Reveal } from "@/components/site/reveal";
import { equipe } from "@/lib/data";

export function Equipe() {
  return (
    <section id="equipe" data-nav="Equipe" className="bg-kenesis-greenDark px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-lime">Time</span>
          <h2 className="font-display mt-5 text-4xl text-white lg:text-5xl">Quem cuida do seu negócio.</h2>
        </Reveal>
        <div className="mt-14 grid gap-7 sm:grid-cols-3">
          {equipe.map((m, i) => (
            <Reveal key={m.name} delay={i * 120}>
              <div className="rounded-2xl bg-white/5 p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-kenesis-lime font-display text-2xl text-kenesis-greenDark">
                  {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <h3 className="font-display mt-5 text-lg text-white">{m.name}</h3>
                <p className="mt-1 text-[13px] text-white/60">{m.role}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/35">{m.location}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
