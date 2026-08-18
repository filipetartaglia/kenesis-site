import { Reveal } from "@/components/site/reveal";
import { countPublished } from "@/server/properties/repository";

export async function Sobre() {
  const total = await countPublished();

  const stats = [
    [`${total}+`, "imóveis catalogados"],
    ["2 mil+", "clientes atendidos"],
    ["100%", "compromisso com o resultado"],
    ["Niterói", "& região — nossa casa"],
  ];

  return (
    <section id="sobre" data-nav="Sobre" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Sobre nós</span>
          <h2 className="font-display mt-5 text-4xl leading-tight text-kenesis-greenDark lg:text-5xl">
            Mais que uma imobiliária — somos sua assessoria imobiliária completa.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-neutral-600">
            A Kenesis cuida de tudo: da busca ao imóvel ideal até a assinatura do contrato.
            Somos especialistas em assessoria imobiliária — incluindo suporte cartorial,
            documentação e todas as etapas burocráticas para que você tenha segurança
            e tranquilidade em cada detalhe da negociação.
          </p>
          <div className="mt-10 space-y-6">
            <div className="border-l-2 border-kenesis-lime pl-5">
              <h3 className="font-display text-lg text-kenesis-greenDark">Atendimento que entende você</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Ouvimos o que você procura e apresentamos imóveis alinhados ao seu estilo de vida,
                necessidades e planos — do padrão médio ao alto padrão.
              </p>
            </div>
            <div className="border-l-2 border-kenesis-lime pl-5">
              <h3 className="font-display text-lg text-kenesis-greenDark">Assessoria cartorial e jurídica</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Auxiliamos em toda a parte documental, escritura, registro e processos
                cartoriais para que sua compra ou venda aconteça com total segurança.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150} className="grid grid-cols-2 gap-5 self-start">
          {stats.map(([num, label]) => (
            <div key={label} className="rounded-2xl bg-kenesis-cream p-7">
              <div className="font-display text-4xl text-kenesis-green">{num}</div>
              <div className="mt-2 text-[13px] leading-snug text-neutral-600">{label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
