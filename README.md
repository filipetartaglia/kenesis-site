# Kenesis — site (Next.js)

Projeto real em Next.js 14 (App Router) + TypeScript + Tailwind, estruturado no padrão shadcn/ui.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Estrutura

```
app/
  page.tsx                 → Home (todas as seções)
  imoveis/page.tsx         → Listagem com filtros
  imoveis/[slug]/page.tsx  → Página de um imóvel
  layout.tsx, globals.css
components/
  ui/                      → componentes de baixo nível (padrão shadcn)
    interactive-hover-button.tsx
    filter-badge.tsx
  site/                    → seções e componentes específicos do site
    header.tsx, hero.tsx, sobre.tsx, categorias.tsx, destaques.tsx,
    servicos.tsx, equipe.tsx, depoimentos.tsx, faq.tsx, contato.tsx,
    property-card.tsx, property-detail.tsx, property-filters.tsx,
    expand-map.tsx, reveal.tsx
lib/
  data.ts                  → dados mockados (imóveis, depoimentos, time, faq)
  utils.ts                 → helper `cn()` usado pelos componentes ui/
```

## Sobre a pasta `components/ui`

Esse é o caminho padrão que o CLI do shadcn (`npx shadcn@latest add ...`) espera
por padrão. Como o projeto já segue essa estrutura, qualquer componente novo do
21st.dev/shadcn pode ser instalado direto rodando o comando `npx shadcn@latest add "<url>"`
na raiz do projeto — ele vai cair certinho em `components/ui/`, sem precisar mover nada
na mão. Foi por isso que `interactive-hover-button.tsx` e `filter-badge.tsx` já
foram colocados lá, exatamente como o CLI faria.

## Onde trocar coisas

- **Imóveis, time, depoimentos, FAQ, números da seção Sobre** → tudo em `lib/data.ts`.
- **Cores/fontes** → `tailwind.config.ts` (paleta `kenesis.*`) e variáveis CSS em `app/globals.css`.
- **WhatsApp/e-mail** → `components/site/header.tsx` e `components/site/contato.tsx`.
- **Fotos de imóveis e da equipe** são placeholders do site atual — troque os links em `lib/data.ts` quando tiver os arquivos finais.
