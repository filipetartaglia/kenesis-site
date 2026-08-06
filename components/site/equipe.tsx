import { Reveal } from "@/components/site/reveal";
import { KineticTeam } from "@/components/ui/kinetic-team";
import type { TeamMember } from "@/types";

// Recebe por prop em vez de ler a fonte: equipe vira tabela no banco, e
// componente que busca o próprio dado não tem como ser montado em outro
// contexto nem testado sem a fonte junto (spec §4, regra 1).
export function Equipe({ members }: { members: TeamMember[] }) {
  return (
    <section id="equipe" data-nav="Equipe" className="bg-kenesis-greenDark px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-lime">Time</span>
          <h2 className="font-display mt-5 text-4xl text-white lg:text-5xl">
            Quem cuida do seu negócio.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-white/50">
            Passe o mouse sobre cada membro para conhecê-los melhor.
          </p>
        </Reveal>
        <KineticTeam members={members} />
      </div>
    </section>
  );
}
