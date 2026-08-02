import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenesis Imobiliária | Alto padrão em Niterói",
  description:
    "Imóveis de médio e alto padrão em Niterói, Rio de Janeiro e região. Casas, apartamentos, terrenos e empreendimentos.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body id="topo">{children}</body>
    </html>
  );
}
