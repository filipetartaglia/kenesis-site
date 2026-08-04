import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

/**
 * Layout do site público.
 *
 * Header, Footer e o wrapper branco de cantos arredondados estavam copiados
 * literalmente nas três páginas. Aqui existem uma vez só: as páginas passam a
 * devolver apenas o próprio conteúdo.
 *
 * O route group `(site)` não aparece na URL — /imoveis continua sendo /imoveis.
 * Ele existe para separar o que tem Header/Footer do que não tem: `app/admin/*`
 * fica fora deste layout e não herda nada daqui.
 *
 * O `min-h-screen` vinha em duas das três cópias. Unificar é no-op visual: a
 * home é muito mais alta que a viewport, então a altura mínima nunca atua lá.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="relative z-10 min-h-screen overflow-hidden rounded-b-[2rem] bg-white shadow-[0_30px_80px_rgba(2,35,31,0.35)]">
        {children}
      </div>
      <Footer />
    </>
  );
}
