# Fase 1 — Reestruturação da arquitetura do front

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar tarefa a tarefa. Os passos usam checkbox (`- [ ]`) para rastreamento.

**Spec de origem:** `docs/superpowers/specs/2026-08-02-area-administrativa-design.md` (seções 4, 5, 6 e 12).

**Goal:** Preparar o site público para receber banco e painel — separando dados de apresentação atrás de um repositório, tirando o acervo do bundle do cliente e eliminando a triplicação de layout — sem alterar um pixel e sem introduzir banco.

**Architecture:** As páginas viram Server Components e passam a ler imóveis por `server/properties/repository.ts`. Nesta fase o repositório lê um array em memória (`server/properties/data.ts`); quando o Postgres entrar, **só o corpo daquelas funções muda** — nenhum componente e nenhuma página são tocados de novo. Header/Footer/wrapper saem das três páginas e vão para um layout de route group `app/(site)/`. Contatos hardcoded em 8 arquivos passam a vir de `lib/config.ts` lendo env.

**Tech Stack:** Next.js 14.2.29 (App Router), React 18.3, TypeScript 5.4, Tailwind 3.4, Vitest (nova devDependency — única adição).

---

## Global Constraints

Valem para **todas** as tarefas. Nenhuma tarefa está completa se violar qualquer uma:

- **Zero mudança visual.** Qualquer diff que altere pixel renderizado é bug, com uma exceção declarada: `<label class="sr-only">` no formulário de interesse (invisível por definição). Alturas, paddings, cores, fontes, gaps e sombras existentes são intocáveis.
- **Nenhuma dependência nova de runtime.** Só `vitest` em `devDependencies`.
- **`server/` nunca importa `next/*` nem React.** Só TypeScript puro e `import type` de `lib/types.ts`. É o que permite testar sem subir o Next e o que torna a migração para container real.
- **Componente nunca lê a fonte de dados.** Nenhum arquivo em `components/` importa de `server/`. Dados chegam por prop, vindos de uma página.
- **`components/ui/*` permanece intacto.** São componentes shadcn/21st.dev e o CLI do shadcn sobrescreve essa pasta. Se um deles ficar sem uso, o arquivo fica onde está.
- **Sem banco, sem auth, sem Server Actions nesta fase.**
- **Alias:** `@/*` → raiz do projeto (`tsconfig.json`).
- **`strict: false`** no `tsconfig.json` — não mude nesta fase.
- **Textos em pt-BR.**
- Ao final de toda tarefa: `npm run build` passa e `npm run lint` não introduz aviso novo.

---

## Fora de escopo (nomeado, não esquecido)

Banco de dados e Drizzle · schema tipado de imóveis (`price_cents`, `bedrooms`, `property_type`…) · painel `/admin` · autenticação · tabela `leads` e Server Action de captura · JSON-LD · páginas de segmento (`/imoveis/bairro/*`, `/imoveis/tipo/*`) · mudança de slug e `property_slug_history` + 301 · remoção do GSAP · storage de imagens.

**Por que o schema tipado não entra aqui:** trocar `tag`/`area`/`price` (strings) pelos campos tipados exige preço, metragem, quartos e tipo que **não existem** em 20 de 20 imóveis (spec §10). É digitação humana da Kenesis, não código. Fazer agora bloquearia a fase inteira. A fase 1 mexe só em arquitetura; o `type Property` atual é preservado byte a byte.

---

## Estrutura de arquivos ao final da fase

```
app/
  layout.tsx                    root — metadataBase + noscript de acessibilidade
  robots.ts                     NOVO
  sitemap.ts                    NOVO
  globals.css                   + bloco prefers-reduced-motion
  (site)/
    layout.tsx                  NOVO — Header + wrapper + Footer (antes triplicado)
    page.tsx                    MOVIDO de app/page.tsx
    not-found.tsx               NOVO
    error.tsx                   NOVO
    imoveis/page.tsx            MOVIDO — vira Server Component, filtro em searchParams
    imoveis/[slug]/page.tsx     MOVIDO — + generateMetadata

server/properties/
  data.ts                       NOVO — os 20 imóveis (fonte temporária)
  repository.ts                 NOVO — a fronteira que o Postgres vai substituir
  repository.test.ts            NOVO

lib/
  types.ts                      NOVO — type Property
  content.ts                    NOVO — categorias, servicos, faqs, HOME_SECTIONS, equipe
  config.ts                     NOVO — contatos e URL do site, via env
  config.test.ts                NOVO
  interest-message.ts           NOVO — montagem da mensagem de WhatsApp (puro)
  interest-message.test.ts      NOVO
  data.ts                       DELETADO ao final da Task 2
  utils.ts                      intocado

components/site/
  property-gallery.tsx          NOVO — client, extraído de property-detail
  property-interest-form.tsx    NOVO — client, extraído de property-detail
  property-detail.tsx           deixa de ser client
  property-filters.tsx          deixa de ser client — vira links
  destaques.tsx                 recebe imóveis por prop
  property-card.tsx             next/image
  header.tsx / footer indireto  contatos via lib/config
  reveal.tsx                    + data-reveal
  contato.tsx                   DELETADO — código morto

vitest.config.ts                NOVO
.env.example                    NOVO
```

---

## Pendências para o dono do projeto (não bloqueiam nenhuma tarefa)

1. **Domínio de produção.** `NEXT_PUBLIC_SITE_URL` cai em `http://localhost:3000` por padrão. Canonical, `og:url` e `sitemap.xml` sairão errados em produção enquanto a variável não for definida no painel da Vercel. Não invente domínio no código.
2. Duas premissas da spec geral seguem abertas (papéis da equipe e plano de hospedagem). Ambas só importam a partir da fase de banco/auth.

---

## Task 1: Vitest + `lib/config.ts` (contatos e URL fora do código)

Contatos estão hardcoded em 8 lugares (WhatsApp) e 5 (e-mail). Esta tarefa cria a fonte única e o runner de teste que as tarefas seguintes usam.

**Files:**
- Create: `vitest.config.ts`
- Create: `.env.example`
- Create: `lib/config.ts`
- Create: `lib/config.test.ts`
- Modify: `package.json` (scripts + devDependency)
- Modify: `components/site/header.tsx:144`, `:179`
- Modify: `components/ui/motion-footer.tsx:292`, `:337`, `:340`, `:352`
- Modify: `components/ui/glassmorphism-trust-hero.tsx:107`

**Interfaces:**
- Consumes: nada.
- Produces: `CONTACT` (objeto com `whatsapp`, `whatsappHref`, `email`, `emailHref`, `phoneHref`, `phoneLabel`, `instagram`, `instagramHref`, `city`), `SITE` (`{ url: string }`), `whatsappLink(message: string): string`, `formatPhone(digits: string): string`.

> **Divergência consciente da spec §11.** A spec lista `CONTACT_WHATSAPP` / `CONTACT_EMAIL` sem prefixo. Header, footer e hero são Client Components, e variável sem `NEXT_PUBLIC_` não existe no navegador — ficariam `undefined` em produção. São dados públicos impressos na página, então o prefixo não vaza nada. Nomes adotados: `NEXT_PUBLIC_CONTACT_*`.
>
> Next só substitui `process.env.NEXT_PUBLIC_X` quando a expressão é **literal**. `process.env[nome]` não funciona. O código abaixo respeita isso.

- [ ] **Step 1: Instalar o Vitest**

```bash
npm install -D vitest@^2
```

- [ ] **Step 2: Criar `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
});
```

Sem `vite-tsconfig-paths`: um alias resolve, e é uma dependência a menos.

- [ ] **Step 3: Adicionar os scripts em `package.json`**

Dentro de `"scripts"`, ao lado de `"lint"`:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Escrever o teste que falha**

Criar `lib/config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CONTACT, SITE, formatPhone, whatsappLink } from "@/lib/config";

describe("formatPhone", () => {
  it("formata celular brasileiro com DDI", () => {
    expect(formatPhone("5521976248282")).toBe("(21) 97624-8282");
  });

  it("formata fixo de 8 dígitos", () => {
    expect(formatPhone("552126248282")).toBe("(21) 2624-8282");
  });

  it("devolve a entrada intacta quando não reconhece o formato", () => {
    expect(formatPhone("abc")).toBe("abc");
  });
});

describe("whatsappLink", () => {
  it("codifica quebra de linha e acento na querystring", () => {
    const link = whatsappLink("Olá\nsegunda linha");
    expect(link.startsWith(`https://wa.me/${CONTACT.whatsapp}?text=`)).toBe(true);
    expect(link).toContain("Ol%C3%A1");
    expect(link).toContain("%0A");
  });
});

describe("CONTACT", () => {
  it("monta os hrefs a partir do número", () => {
    expect(CONTACT.whatsappHref).toBe(`https://wa.me/${CONTACT.whatsapp}`);
    expect(CONTACT.phoneHref).toBe(`tel:+${CONTACT.whatsapp}`);
    expect(CONTACT.emailHref).toBe(`mailto:${CONTACT.email}`);
    expect(CONTACT.instagramHref).toBe(`https://www.instagram.com/${CONTACT.instagram}/`);
  });
});

describe("SITE.url", () => {
  it("nunca termina em barra — canonical e sitemap concatenam direto", () => {
    expect(SITE.url.endsWith("/")).toBe(false);
  });
});
```

- [ ] **Step 5: Rodar e confirmar que falha**

```bash
npm test
```
Esperado: FAIL — `Failed to resolve import "@/lib/config"`.

- [ ] **Step 6: Criar `lib/config.ts`**

```ts
// Fonte única de contato e URL do site.
// Os defaults são os valores que estavam hardcoded no código até a fase 1;
// em produção tudo vem de env (ver .env.example).

const WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "5521976248282";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "kenesisimoveis@gmail.com";
const INSTAGRAM = process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM || "kenesis.imoveis";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** "5521976248282" -> "(21) 97624-8282" */
export function formatPhone(digits: string): string {
  const match = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : digits;
}

export const CONTACT = {
  whatsapp: WHATSAPP,
  whatsappHref: `https://wa.me/${WHATSAPP}`,
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  phoneHref: `tel:+${WHATSAPP}`,
  phoneLabel: formatPhone(WHATSAPP),
  instagram: INSTAGRAM,
  instagramHref: `https://www.instagram.com/${INSTAGRAM}/`,
  city: "Niterói, RJ",
};

export const SITE = {
  url: SITE_URL.replace(/\/+$/, ""),
};

/** Link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message: string): string {
  return `${CONTACT.whatsappHref}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 7: Rodar e confirmar que passa**

```bash
npm test
```
Esperado: PASS, 6 testes.

- [ ] **Step 8: Criar `.env.example`**

```bash
# URL pública do site — usada em canonical, og:url e sitemap.xml.
# Em produção precisa ser o domínio real, com https e SEM barra final.
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Contatos exibidos no site. Só dígitos no WhatsApp, com DDI.
NEXT_PUBLIC_CONTACT_WHATSAPP=5521976248282
NEXT_PUBLIC_CONTACT_EMAIL=kenesisimoveis@gmail.com
NEXT_PUBLIC_CONTACT_INSTAGRAM=kenesis.imoveis
```

- [ ] **Step 9: Trocar os contatos hardcoded no header**

Em `components/site/header.tsx`, adicionar ao topo:

```ts
import { CONTACT } from "@/lib/config";
```

Trocar as duas ocorrências de `href="https://wa.me/5521976248282"` (linhas 144 e 179) por:

```tsx
href={CONTACT.whatsappHref}
```

- [ ] **Step 10: Trocar os contatos hardcoded no footer**

Em `components/ui/motion-footer.tsx`, adicionar `import { CONTACT } from "@/lib/config";` e substituir:

| Linha | De | Para |
|---|---|---|
| 292 | `href="https://wa.me/5521976248282"` | `href={CONTACT.whatsappHref}` |
| 337 | `href="tel:+5521976248282"` | `href={CONTACT.phoneHref}` |
| 337 | o texto `(21) 97624-8282` | `{CONTACT.phoneLabel}` |
| 340 | `href="mailto:kenesisimoveis@gmail.com"` | `href={CONTACT.emailHref}` |
| 340 | o texto `kenesisimoveis@gmail.com` | `{CONTACT.email}` |
| 352 | o texto `@kenesis.imoveis` | `@{CONTACT.instagram}` |

Localizar também o `href` do Instagram no mesmo bloco e trocá-lo por `href={CONTACT.instagramHref}`:

```bash
grep -n "instagram" components/ui/motion-footer.tsx
```

> `components/ui/motion-footer.tsx` é exceção declarada à regra "`components/ui/*` intacto": ele não é componente shadcn genérico, é o footer da Kenesis com dados da Kenesis dentro. O CLI do shadcn não tem o que sobrescrever aqui.

- [ ] **Step 11: Trocar o contato hardcoded no hero**

Em `components/ui/glassmorphism-trust-hero.tsx:107`, mesmo tratamento: importar `CONTACT` e usar `href={CONTACT.whatsappHref}`.

- [ ] **Step 12: Verificar que nenhum contato sobrou fora de `lib/`**

```bash
grep -rn "976248282\|kenesisimoveis@gmail\|kenesis.imoveis" app components
```
Esperado: **nenhuma linha**. `lib/data.ts` ainda terá o whatsapp da equipe (linhas 179/187/195) — isso é dado de pessoa, não contato institucional, e fica onde está.

- [ ] **Step 13: Build e commit**

```bash
npm run build && npm test
git add -A
git commit -m "feat(config): centraliza contatos e URL do site em lib/config + Vitest"
```

---

## Task 2: Quebrar `lib/data.ts` em tipo, conteúdo estático e dados de imóvel

Movimentação pura, sem mudança de comportamento. É o que separa "conteúdo que fica em código para sempre" (FAQ, categorias, serviços) de "dado que vai para o banco" (imóveis, equipe).

**Files:**
- Create: `lib/types.ts`
- Create: `lib/content.ts`
- Create: `server/properties/data.ts`
- Delete: `lib/data.ts`
- Modify: `components/site/categorias.tsx:3`, `equipe.tsx:3`, `faq.tsx:5`, `header.tsx:8`, `servicos.tsx:3`, `property-card.tsx:2`, `property-detail.tsx:6`, `destaques.tsx:8`, `app/imoveis/page.tsx:8`, `app/imoveis/[slug]/page.tsx:5`

**Interfaces:**
- Consumes: nada.
- Produces: `lib/types.ts` exporta `type Property`. `lib/content.ts` exporta `categorias`, `servicos`, `faqs`, `equipe`, `HOME_SECTIONS`. `server/properties/data.ts` exporta `properties: Property[]`.

- [ ] **Step 1: Confirmar que `testimonials` é código morto**

```bash
grep -rn "testimonials" app components lib
```
Esperado: só a declaração em `lib/data.ts:155`. Se aparecer algum import, **não delete** — mova para `lib/content.ts` junto com o resto. O `StaggerTestimonials` tem os depoimentos embutidos no próprio arquivo.

- [ ] **Step 2: Criar `lib/types.ts`**

Recortar o bloco de `lib/data.ts:1-16` **sem alterar nada**:

```ts
export type Property = {
  id: number;
  slug: string;
  tag: string;
  title: string;
  location: string;
  price: string;
  note?: string;
  beds?: number;
  baths?: number;
  garage?: number;
  area?: string;
  desc: string;
  img: string;
  gallery: string[];
};
```

- [ ] **Step 3: Criar `server/properties/data.ts`**

Mover os helpers `gallery` e `property` (`lib/data.ts:18-30`) e o array `properties` (`lib/data.ts:32-153`) inteiro, **sem editar nenhum imóvel**. O cabeçalho do arquivo:

```ts
import type { Property } from "@/lib/types";

// ponytail: fonte em memória, temporária. A fase de banco substitui este arquivo
// por uma tabela; só server/properties/repository.ts sabe que ele existe.

const gallery = (slug: string, count: number) =>
  Array.from(
    { length: count },
    (_, index) => `/imoveis/${slug}/${String(index + 1).padStart(2, "0")}.webp`
  );

const property = (
  values: Omit<Property, "img" | "gallery"> & { imageCount: number; coverIndex?: number }
): Property => {
  const images = gallery(values.slug, values.imageCount);
  const { imageCount: _imageCount, coverIndex = 1, ...details } = values;
  return { ...details, img: images[coverIndex - 1] || images[0], gallery: images };
};

export const properties: Property[] = [
  // ... os 20 imóveis, copiados de lib/data.ts sem alteração
];
```

- [ ] **Step 4: Criar `lib/content.ts`**

Mover `testimonials` (só se o Step 1 mostrou consumidor), `categorias`, `servicos`, `equipe`, `faqs` e `HOME_SECTIONS` — o conteúdo de `lib/data.ts:155-210`, sem editar.

Cabeçalho:

```ts
// Conteúdo estático: 16 registros que mudam ~2x por ano (spec D3).
// Não vai para o banco. `equipe` migra para a tabela `users` na fase de admin.
```

- [ ] **Step 5: Atualizar os 10 importadores**

| Arquivo | De | Para |
|---|---|---|
| `components/site/categorias.tsx:3` | `import { categorias } from "@/lib/data"` | `import { categorias } from "@/lib/content"` |
| `components/site/equipe.tsx:3` | `import { equipe } from "@/lib/data"` | `import { equipe } from "@/lib/content"` |
| `components/site/faq.tsx:5` | `import { faqs } from "@/lib/data"` | `import { faqs } from "@/lib/content"` |
| `components/site/servicos.tsx:3` | `import { servicos } from "@/lib/data"` | `import { servicos } from "@/lib/content"` |
| `components/site/header.tsx:8` | `import { HOME_SECTIONS } from "@/lib/data"` | `import { HOME_SECTIONS } from "@/lib/content"` |
| `components/site/property-card.tsx:2` | `import { Property } from "@/lib/data"` | `import type { Property } from "@/lib/types"` |
| `components/site/property-detail.tsx:6` | `import { Property, properties } from "@/lib/data"` | `import type { Property } from "@/lib/types"` + `import { properties } from "@/server/properties/data"` |
| `components/site/destaques.tsx:8` | `import { properties } from "@/lib/data"` | `import { properties } from "@/server/properties/data"` |
| `app/imoveis/page.tsx:8` | `import { properties } from "@/lib/data"` | `import { properties } from "@/server/properties/data"` |
| `app/imoveis/[slug]/page.tsx:5` | `import { properties } from "@/lib/data"` | `import { properties } from "@/server/properties/data"` |

> Os três últimos imports de `server/properties/data` violam a regra "componente não lê a fonte de dados". São **temporários e propositais**: mantêm o site funcionando entre a Task 2 e a Task 3. As Tasks 5, 6 e 7 removem os três. Nenhum sobrevive à fase.

- [ ] **Step 6: Deletar `lib/data.ts` e confirmar que ninguém referencia**

```bash
rm lib/data.ts
grep -rn "@/lib/data" app components lib server
```
Esperado: nenhuma linha.

- [ ] **Step 7: Verificar**

```bash
npm run build && npm test
```
Esperado: build PASS. Rodar `npm run dev` e abrir `http://localhost:3000` e `http://localhost:3000/imoveis` — devem estar idênticas a antes.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: separa lib/data.ts em types, content e server/properties/data"
```

---

## Task 3: `server/properties/repository.ts` — a fronteira que o Postgres vai substituir

O arquivo mais importante da fase. Toda leitura de imóvel passa a vir daqui. Na fase de banco, só os corpos destas funções mudam.

**Files:**
- Create: `server/properties/repository.ts`
- Create: `server/properties/repository.test.ts`

**Interfaces:**
- Consumes: `properties` de `@/server/properties/data`, `type Property` de `@/lib/types`.
- Produces:
  - `TODOS: "Todos"` — rótulo do filtro "sem filtro"
  - `findPublishedList(filter?: { tipo?: string }): Property[]`
  - `findPublishedBySlug(slug: string): Property | null`
  - `findFeatured(limit?: number): Property[]`
  - `findSimilar(slug: string, limit?: number): Property[]`
  - `listTipos(): string[]`
  - `listSlugs(): string[]`
  - `countPublished(): number`

> **Por que `findPublished*` e não `find*` com parâmetro** (spec §7): o filtro de publicação é embutido no nome, não é argumento. Hoje não há rascunho — todos os 20 são públicos — mas quando `status` existir, a assinatura já está certa e ninguém precisa lembrar de passar nada. Um argumento esquecido vaza rascunho e imóvel vendido para o site.

- [ ] **Step 1: Escrever o teste que falha**

Criar `server/properties/repository.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { properties } from "@/server/properties/data";
import {
  TODOS,
  countPublished,
  findFeatured,
  findPublishedBySlug,
  findPublishedList,
  findSimilar,
  listSlugs,
  listTipos,
} from "@/server/properties/repository";

describe("findPublishedList", () => {
  it("sem filtro devolve o acervo inteiro", () => {
    expect(findPublishedList()).toHaveLength(properties.length);
  });

  it('trata "Todos" como ausência de filtro', () => {
    expect(findPublishedList({ tipo: TODOS })).toHaveLength(properties.length);
  });

  it("filtra por tipo", () => {
    const resultado = findPublishedList({ tipo: "Casa" });
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((p) => p.tag === "Casa")).toBe(true);
  });

  it("tipo inexistente devolve lista vazia, não o acervo inteiro", () => {
    expect(findPublishedList({ tipo: "Iate" })).toEqual([]);
  });
});

describe("findPublishedBySlug", () => {
  it("acha pelo slug", () => {
    const p = findPublishedBySlug("mansao-jardim-uba");
    expect(p?.slug).toBe("mansao-jardim-uba");
  });

  it("devolve null quando não existe — a página depende disso para dar 404", () => {
    expect(findPublishedBySlug("nao-existe")).toBeNull();
  });
});

describe("findSimilar", () => {
  it("nunca inclui o próprio imóvel", () => {
    const similares = findSimilar("mansao-jardim-uba");
    expect(similares.some((p) => p.slug === "mansao-jardim-uba")).toBe(false);
  });

  it("respeita o limite", () => {
    expect(findSimilar("mansao-jardim-uba", 3)).toHaveLength(3);
  });
});

describe("findFeatured", () => {
  it("respeita o limite", () => {
    expect(findFeatured(6)).toHaveLength(6);
  });
});

describe("listTipos", () => {
  it("não repete tipo", () => {
    const tipos = listTipos();
    expect(new Set(tipos).size).toBe(tipos.length);
  });

  it('não inclui o rótulo "Todos" — quem monta a UI é que o adiciona', () => {
    expect(listTipos()).not.toContain(TODOS);
  });
});

describe("listSlugs / countPublished", () => {
  it("slugs são únicos — slug repetido quebra sitemap e rota", () => {
    const slugs = listSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("countPublished bate com listSlugs", () => {
    expect(countPublished()).toBe(listSlugs().length);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
npm test -- repository
```
Esperado: FAIL — `Failed to resolve import "@/server/properties/repository"`.

- [ ] **Step 3: Criar `server/properties/repository.ts`**

```ts
import type { Property } from "@/lib/types";
import { properties } from "./data";

// Node puro: nada de "next/*" nem React. É o que permite testar sem subir o Next
// e o que torna a migração para container real (spec §4, regra 2).
//
// ponytail: hoje lê um array em memória. Quando o Postgres entrar, só o corpo
// destas funções muda — nenhuma página e nenhum componente são tocados de novo.

/** Rótulo do estado "sem filtro" na UI. */
export const TODOS = "Todos";

/**
 * Imóveis visíveis no site.
 * O recorte de publicação está no NOME, não em parâmetro: quando existir
 * `status`, o filtro entra aqui dentro e nenhum chamador precisa saber.
 */
export function findPublishedList(filter?: { tipo?: string }): Property[] {
  const tipo = filter?.tipo;
  if (!tipo || tipo === TODOS) return properties;
  return properties.filter((p) => p.tag === tipo);
}

export function findPublishedBySlug(slug: string): Property | null {
  return properties.find((p) => p.slug === slug) ?? null;
}

export function findFeatured(limit = 6): Property[] {
  return properties.slice(0, limit);
}

/** Semelhantes do imóvel dado. Exclui o próprio. */
export function findSimilar(slug: string, limit = 3): Property[] {
  return properties.filter((p) => p.slug !== slug).slice(0, limit);
}

export function listTipos(): string[] {
  return Array.from(new Set(properties.map((p) => p.tag)));
}

export function listSlugs(): string[] {
  return properties.map((p) => p.slug);
}

export function countPublished(): number {
  return properties.length;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
npm test
```
Esperado: PASS, todos os testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(server): repositório de imóveis com o filtro de publicação no nome"
```

---

## Task 4: Route group `(site)` — Header, Footer e wrapper em um lugar só

Header, Footer e o `<div>` com `rounded-b-[2rem]` estão copiados nas três páginas.

**Files:**
- Create: `app/(site)/layout.tsx`
- Create: `app/(site)/not-found.tsx`
- Create: `app/(site)/error.tsx`
- Move: `app/page.tsx` → `app/(site)/page.tsx`
- Move: `app/imoveis/page.tsx` → `app/(site)/imoveis/page.tsx`
- Move: `app/imoveis/[slug]/page.tsx` → `app/(site)/imoveis/[slug]/page.tsx`

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces: layout compartilhado. As páginas passam a devolver **só o próprio conteúdo**, sem Header/Footer/wrapper.

> Route group `(site)` não aparece na URL: `app/(site)/imoveis/page.tsx` continua servindo `/imoveis`. Nenhuma URL muda nesta tarefa.

- [ ] **Step 1: Mover as três páginas preservando histórico**

```bash
mkdir -p "app/(site)/imoveis/[slug]"
git mv app/page.tsx "app/(site)/page.tsx"
git mv app/imoveis/page.tsx "app/(site)/imoveis/page.tsx"
git mv "app/imoveis/[slug]/page.tsx" "app/(site)/imoveis/[slug]/page.tsx"
rmdir "app/imoveis/[slug]" app/imoveis 2>/dev/null || true
```

`git mv` deixa os diretórios vazios para trás em alguns sistemas e os remove em outros — daí o `|| true`.

- [ ] **Step 2: Criar `app/(site)/layout.tsx`**

```tsx
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

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
```

> O wrapper da home não tinha `min-h-screen` e os outros dois tinham. Unificar em `min-h-screen` é no-op visual: a home é muito mais alta que a viewport. É a única diferença entre as três cópias.

- [ ] **Step 3: Enxugar `app/(site)/page.tsx`**

```tsx
import { Hero } from "@/components/site/hero";
import { Sobre } from "@/components/site/sobre";
import { Categorias } from "@/components/site/categorias";
import { Destaques } from "@/components/site/destaques";
import { Servicos } from "@/components/site/servicos";
import { Equipe } from "@/components/site/equipe";
import { Depoimentos } from "@/components/site/depoimentos";
import { Faq } from "@/components/site/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Sobre />
      <Categorias />
      <Destaques />
      <Servicos />
      <Equipe />
      <Depoimentos />
      <Faq />
    </>
  );
}
```

- [ ] **Step 4: Enxugar `app/(site)/imoveis/page.tsx`**

Remover os imports de `Header` e `Footer`, e trocar o `return` para começar direto no `<div className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-10">`. O `"use client"`, o `useState` e o filtro **ficam como estão** — a Task 5 cuida deles.

- [ ] **Step 5: Enxugar `app/(site)/imoveis/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/site/property-detail";
import { properties } from "@/server/properties/data";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default function ImovelPage({ params }: { params: { slug: string } }) {
  const property = properties.find((p) => p.slug === params.slug);
  if (!property) return notFound();

  return <PropertyDetail property={property} />;
}
```

- [ ] **Step 6: Criar `app/(site)/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-40 text-center lg:px-10">
      <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Erro 404</span>
      <h1 className="font-display mt-4 text-4xl text-kenesis-greenDark lg:text-5xl">Página não encontrada</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
        O endereço que você acessou não existe ou o imóvel saiu do ar.
      </p>
      <Link
        href="/imoveis"
        className="mt-8 inline-block rounded-full bg-kenesis-green px-6 py-3 text-[13px] font-medium text-white"
      >
        Ver todos os imóveis
      </Link>
    </div>
  );
}
```

- [ ] **Step 7: Criar `app/(site)/error.tsx`**

```tsx
"use client";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-40 text-center lg:px-10">
      <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Ops</span>
      <h1 className="font-display mt-4 text-4xl text-kenesis-greenDark lg:text-5xl">Algo saiu do lugar</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
        Tente novamente. Se continuar, fale com a gente pelo WhatsApp.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-kenesis-green px-6 py-3 text-[13px] font-medium text-white"
      >
        Tentar de novo
      </button>
    </div>
  );
}
```

`error.tsx` precisa ser Client Component — é exigência do Next, não escolha. A mensagem é genérica de propósito: stack trace no navegador entrega estrutura interna (spec §12).

- [ ] **Step 8: Verificar**

```bash
npm run build
npm run dev
```

Abrir e comparar com o estado anterior:
- `http://localhost:3000` — header, footer e cantos arredondados idênticos
- `http://localhost:3000/imoveis`
- `http://localhost:3000/imoveis/mansao-jardim-uba`
- `http://localhost:3000/imoveis/nao-existe` — página 404 nova, **com header e footer**

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor(app): route group (site) com layout compartilhado + 404 e error"
```

---

## Task 5: `/imoveis` como Server Component com filtro na URL

Hoje a página é `"use client"` e importa os 20 imóveis — o acervo inteiro vai no bundle JavaScript. Com 200 imóveis é inviável. O filtro vira `searchParams`: link compartilhável e página indexável.

**Files:**
- Modify: `app/(site)/imoveis/page.tsx`
- Rewrite: `components/site/property-filters.tsx`

**Interfaces:**
- Consumes: `findPublishedList`, `listTipos`, `TODOS` de `@/server/properties/repository`.
- Produces: `PropertyFilters({ tipos, active }: { tipos: string[]; active?: string })` — Server Component, sem `onChange`.

- [ ] **Step 1: Reescrever `components/site/property-filters.tsx`**

Sai o `"use client"` e sai o `FilterBadge` (que é `<button onClick>`; um `<button>` dentro de `<a>` é HTML inválido). As classes abaixo são **cópia literal** das que `FilterBadge` produzia — a renderização é a mesma.

```tsx
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TODOS } from "@/server/properties/repository";

const CHIP = "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors";

function hrefFor(tipo: string) {
  return tipo === TODOS ? "/imoveis" : `/imoveis?tipo=${encodeURIComponent(tipo)}`;
}

export function PropertyFilters({ tipos, active }: { tipos: string[]; active?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[TODOS, ...tipos].map((tipo) => {
          const isActive = tipo === TODOS ? !active : active === tipo;
          return (
            <Link
              key={tipo}
              href={hrefFor(tipo)}
              scroll={false}
              className={cn(
                CHIP,
                isActive
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              {tipo}
            </Link>
          );
        })}
      </div>

      {active && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-[12px] font-medium text-foreground">
            <span className="text-muted-foreground">Tipo:</span>
            {active}
            <Link
              href="/imoveis"
              scroll={false}
              aria-label="Remover filtro Tipo"
              className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
            >
              <X size={12} />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
```

`components/ui/filter-badge.tsx` fica sem uso. **Não delete** — é `components/ui/*` (Global Constraints).

- [ ] **Step 2: Reescrever `app/(site)/imoveis/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyFilters } from "@/components/site/property-filters";
import { TODOS, findPublishedList, listTipos } from "@/server/properties/repository";

export const metadata: Metadata = {
  title: "Todos os imóveis | Kenesis",
  description:
    "Casas, apartamentos, terrenos e empreendimentos de médio e alto padrão em Niterói e região.",
};

export default function ImoveisPage({ searchParams }: { searchParams: { tipo?: string } }) {
  const tipos = listTipos();
  const active = searchParams.tipo && tipos.includes(searchParams.tipo) ? searchParams.tipo : undefined;
  const filtered = findPublishedList({ tipo: active ?? TODOS });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-10">
      <span className="text-[12px] font-medium uppercase tracking-[0.3em] text-kenesis-green">Portfólio completo</span>
      <h1 className="font-display mt-4 text-4xl text-kenesis-greenDark lg:text-5xl">Todos os imóveis</h1>

      <div className="mt-8">
        <PropertyFilters tipos={tipos} active={active} />
      </div>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PropertyCard key={p.slug} p={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-neutral-500">Nenhum imóvel encontrado para esse filtro.</p>
      )}
    </div>
  );
}
```

Duas escolhas embutidas:
- `?tipo=` desconhecido é **ignorado** (cai em `undefined`), não devolve lista vazia. `?tipo=Iate` mostraria "nenhum imóvel encontrado" e viraria página indexável vazia; assim mostra o acervo.
- `key={p.slug}` no lugar de `key={p.id}`: `id` numérico some quando o banco entrar (UUID); `slug` sobrevive.

- [ ] **Step 3: Verificar que a página deixou de ser cliente**

```bash
npm run build
grep -rn "use client" "app/(site)/imoveis/page.tsx" components/site/property-filters.tsx
```
Esperado: **nenhuma linha** — nem a página nem os filtros são mais Client Components.

> Não faça ainda o `grep` no bundle: `destaques.tsx` e `property-detail.tsx` continuam importando o acervo como cliente até as Tasks 6 e 7. A verificação do bundle é o Step 5 da Task 7.

- [ ] **Step 4: Verificar o comportamento**

```bash
npm run dev
```
- `http://localhost:3000/imoveis` — todos os chips, "Todos" ativo, grid completo
- `http://localhost:3000/imoveis?tipo=Casa` — só casas, chip "Casa" ativo, pill "Tipo: Casa" com o X
- clicar no X volta para `/imoveis`
- `http://localhost:3000/imoveis?tipo=Iate` — acervo completo, "Todos" ativo
- botão Voltar do navegador funciona entre filtros (não funcionava antes — era estado local)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf(imoveis): listagem vira Server Component com filtro em searchParams"
```

---

## Task 6: Destaques recebe imóveis por prop

`destaques.tsx` é `"use client"` (precisa mesmo — tem scroll horizontal com estado) e importa o acervo. Resultado: os 20 imóveis viajam no bundle da home.

**Files:**
- Modify: `components/site/destaques.tsx:8`, `:11`, `:13`, `:98`, `:130`
- Modify: `app/(site)/page.tsx`

**Interfaces:**
- Consumes: `findFeatured`, `countPublished` de `@/server/properties/repository`; `type Property` de `@/lib/types`.
- Produces: `Destaques({ properties, total }: { properties: Property[]; total: number })`.

- [ ] **Step 1: Alterar a assinatura de `Destaques`**

Em `components/site/destaques.tsx`:

Trocar o import da linha 8 e apagar o `const FEATURED` da linha 11:

```tsx
import type { Property } from "@/lib/types";
```

Assinatura (linha 13):

```tsx
export function Destaques({ properties, total }: { properties: Property[]; total: number }) {
```

- [ ] **Step 2: Trocar os dois usos**

| Linha | De | Para |
|---|---|---|
| 98 | `{FEATURED.map((p, i) => (` | `{properties.map((p, i) => (` |
| 99 | `key={p.id}` | `key={p.slug}` |
| 130 | `{properties.length} propriedades` | `{total} propriedades` |

`total` é separado de `properties.length` de propósito: o card diz "Ver todos os imóveis — N propriedades", e N é o acervo inteiro, não os 6 do carrossel. Hoje funciona por acidente, porque `properties` era o array completo importado.

- [ ] **Step 3: Passar os dados na home**

Em `app/(site)/page.tsx`, adicionar o import e trocar `<Destaques />`:

```tsx
import { countPublished, findFeatured } from "@/server/properties/repository";
```

```tsx
      <Destaques properties={findFeatured(6)} total={countPublished()} />
```

- [ ] **Step 4: Verificar**

```bash
npm run build
grep -rn "server/properties" components/site/destaques.tsx
```
Esperado: **nenhuma linha** — o componente passou a receber tudo por prop.

`npm run dev` e conferir na home: carrossel com 6 cards, setas funcionando, gradientes laterais, card "Ver todos os imóveis" mostrando **20 propriedades**.

> O acervo só sai por completo dos chunks de cliente quando `property-detail.tsx` deixar de ser `"use client"` (Task 7). É lá que o `grep` no bundle passa a valer.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf(home): Destaques recebe imóveis por prop em vez de importar o acervo"
```

---

## Task 7: Quebrar `property-detail` — servidor compõe, cliente só onde precisa

`property-detail.tsx` é `"use client"` inteiro por causa de duas coisas: a galeria (`useState` do índice) e o formulário. E importa o acervo para calcular semelhantes — em toda página de imóvel.

**Files:**
- Create: `components/site/property-gallery.tsx`
- Create: `components/site/property-interest-form.tsx`
- Rewrite: `components/site/property-detail.tsx`
- Modify: `app/(site)/imoveis/[slug]/page.tsx`

**Interfaces:**
- Consumes: `findPublishedBySlug`, `findSimilar`, `listSlugs` de `@/server/properties/repository`; `type Property`.
- Produces:
  - `PropertyGallery({ images, title }: { images: string[]; title: string })` — client
  - `PropertyInterestForm({ propertyTitle, propertySlug }: { propertyTitle: string; propertySlug: string })` — client (comportamento na Task 9; aqui é só a extração)
  - `PropertyDetail({ property, similar }: { property: Property; similar: Property[] })` — server

- [ ] **Step 1: Criar `components/site/property-gallery.tsx`**

Recorte literal das linhas 22-38 do `property-detail.tsx` atual, com o `useState` que só ela usa:

```tsx
"use client";

import { useState } from "react";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={title} className="h-[420px] w-full object-cover" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {images.map((g, i) => (
          <button
            key={g}
            onClick={() => setActive(i)}
            className="overflow-hidden rounded-xl"
            style={{ outline: active === i ? "2px solid #A1BA1F" : "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g} alt="" className="h-24 w-full object-cover" />
          </button>
        ))}
      </div>
    </>
  );
}
```

Os `<img>` viram `next/image` na Task 8 — não antecipe.

- [ ] **Step 2: Criar `components/site/property-interest-form.tsx`**

Recorte literal das linhas 73-112, mantendo o comportamento atual **por enquanto** (a Task 9 conserta o descarte do lead):

```tsx
"use client";

import { useState } from "react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function PropertyInterestForm({
  propertyTitle,
  propertySlug,
}: {
  propertyTitle: string;
  propertySlug: string;
}) {
  const [sent, setSent] = useState(false);

  return (
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
  );
}
```

`propertyTitle` e `propertySlug` chegam sem uso ainda — a Task 9 os consome. É a única forma de não mexer duas vezes na assinatura.

- [ ] **Step 3: Reescrever `components/site/property-detail.tsx`**

Sem `"use client"`, sem `useState`, sem importar o acervo:

```tsx
import Link from "next/link";
import { ChevronLeft, MapPin, Bed, Bath, Car, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/types";
import { ExpandMap } from "@/components/site/expand-map";
import { PropertyCard } from "@/components/site/property-card";
import { PropertyGallery } from "@/components/site/property-gallery";
import { PropertyInterestForm } from "@/components/site/property-interest-form";

export function PropertyDetail({ property, similar }: { property: Property; similar: Property[] }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 lg:px-10">
      <Link href="/imoveis" className="flex items-center gap-1.5 text-[13px] font-medium text-kenesis-green">
        <ChevronLeft size={16} /> Voltar para imóveis
      </Link>

      <PropertyGallery images={property.gallery} title={property.title} />

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
            ]
              .filter(Boolean)
              .map(([Icon, label]: any) => (
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

        <PropertyInterestForm propertyTitle={property.title} propertySlug={property.slug} />
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
```

`ExpandMap` é Client Component e continua funcionando importado por um Server Component — é a direção permitida.

- [ ] **Step 4: Atualizar a página**

`app/(site)/imoveis/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/site/property-detail";
import { findPublishedBySlug, findSimilar, listSlugs } from "@/server/properties/repository";

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export default function ImovelPage({ params }: { params: { slug: string } }) {
  const property = findPublishedBySlug(params.slug);
  if (!property) return notFound();

  return <PropertyDetail property={property} similar={findSimilar(property.slug, 3)} />;
}
```

> `generateStaticParams` **fica** nesta fase. A spec §5 item 9 pede render dinâmico + `revalidateTag("properties")`, mas `revalidateTag` só faz sentido quando existe publicação pelo painel. Sem banco, gerar estático é mais rápido e não custa nada. A troca é da fase de banco.

- [ ] **Step 5: Verificar**

```bash
npm run build
grep -rl "casa-3-suites-sao-francisco" .next/static/chunks
```
Esperado: nenhum arquivo.

`npm run dev`, abrir `http://localhost:3000/imoveis/mansao-jardim-uba`:
- galeria troca a foto grande ao clicar na miniatura, com o contorno lima na ativa
- 4 cards de característica (quartos, banheiros, vagas, área)
- mapa expande
- 3 imóveis semelhantes, **nenhum deles a própria mansão**
- formulário ainda com o comportamento antigo (Task 9 conserta)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "perf(imovel): detalhe vira Server Component; galeria e formulário isolados no cliente"
```

---

## Task 8: `next/image` nas fotos de imóvel

Os `<img>` crus não têm `srcset`: o celular baixa a imagem de desktop. LCP entra no ranqueamento do Google.

**Files:**
- Modify: `components/site/property-card.tsx`
- Modify: `components/site/property-gallery.tsx`

**Interfaces:** nenhuma nova.

> **Divergência consciente da spec §5 item 6.** A spec pede trocar `h-56`, `h-[420px]` e `h-24` por `aspect-[4/3]`, `aspect-[16/9]` e `aspect-square`, citando CLS. **Altura fixa já reserva espaço** — não existe CLS para reservar aqui. Trocar mudaria a altura renderizada dos cards (224px → ~285px), o que viola "zero mudança visual". As alturas ficam. Mudar proporção é decisão de design da Kenesis, não de performance, e pode ser feita a qualquer momento sem tocar em arquitetura.
>
> O logo em `header.tsx:96` continua `<img>`: é SVG local, e o otimizador do Next não processa SVG sem `dangerouslyAllowSVG`. Ligar essa flag para um ícone de 36px não se paga.

- [ ] **Step 1: `property-card.tsx` com `next/image`**

O container já é `relative h-56 overflow-hidden` — `fill` precisa exatamente disso.

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { Reveal } from "@/components/site/reveal";

export function PropertyCard({ p, delay = 0 }: { p: Property; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link href={`/imoveis/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-kenesis-greenDark">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={p.img}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute left-3 top-3 z-10 rounded-full bg-kenesis-lime px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-kenesis-greenDark">
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
```

Dois detalhes: some o `eslint-disable`, e o badge do tipo ganha `z-10` — `next/image` com `fill` cria um filho posicionado que passaria por cima dele.

- [ ] **Step 2: `property-gallery.tsx` com `next/image`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="relative mt-6 h-[420px] overflow-hidden rounded-2xl">
        <Image
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="object-cover"
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {images.map((g, i) => (
          <button
            key={g}
            onClick={() => setActive(i)}
            className="relative h-24 overflow-hidden rounded-xl"
            style={{ outline: active === i ? "2px solid #A1BA1F" : "none" }}
          >
            <Image src={g} alt="" fill sizes="(max-width: 1024px) 33vw, 384px" className="object-cover" />
          </button>
        ))}
      </div>
    </>
  );
}
```

`priority` só na foto grande: é o LCP da página de imóvel. As miniaturas não.

`1152px` no `sizes` é `max-w-6xl` (72rem) — o container real da página de detalhe.

- [ ] **Step 3: Verificar**

```bash
npm run build && npm run lint
```
Esperado: sem `@next/next/no-img-element` nesses dois arquivos.

`npm run dev`, abrir `http://localhost:3000/imoveis` com DevTools → Network → Img:
- as URLs passam a ser `/_next/image?url=...&w=...`
- em viewport de celular (375px), a largura servida é menor que em desktop
- o badge de tipo continua **visível por cima** da foto no canto superior esquerdo
- na página de imóvel, foto grande e miniaturas com o mesmo tamanho de antes

> **Risco conhecido (spec §11).** `next/image` consome cota de otimização no free tier da Vercel, e são 147 fotos. Se estourar, a saída é `unoptimized` no `next/image` ou servir direto — as fotos já são WebP. Não trate antes de acontecer.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf(imagens): next/image com sizes no card e na galeria"
```

---

## Task 9: Parar de descartar o lead

Bug em produção: o formulário diz "Recebido! Em breve alguém da equipe fala com você" e joga nome, telefone, e-mail e mensagem fora. Os inputs sequer têm `name`.

A correção definitiva é tabela `leads` + Server Action, que exige banco — fase seguinte. **A correção interina desta fase entrega o lead de verdade**, abrindo o WhatsApp da imobiliária com a mensagem montada. Zero backend, zero dependência, e a mensagem pré-preenchida já está prevista na spec §6.

**Files:**
- Create: `lib/interest-message.ts`
- Create: `lib/interest-message.test.ts`
- Modify: `components/site/property-interest-form.tsx`

**Interfaces:**
- Consumes: `whatsappLink`, `SITE` de `@/lib/config`.
- Produces: `buildInterestMessage(input: InterestInput): string`, `type InterestInput = { title: string; url: string; nome: string; telefone: string; email: string; mensagem?: string }`.

- [ ] **Step 1: Escrever o teste que falha**

Criar `lib/interest-message.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildInterestMessage } from "@/lib/interest-message";

const base = {
  title: "Mansão no Jardim Ubá I",
  url: "https://exemplo.com/imoveis/mansao-jardim-uba",
  nome: "Ana",
  telefone: "21999998888",
  email: "ana@exemplo.com",
};

describe("buildInterestMessage", () => {
  it("inclui título, URL e os três campos obrigatórios", () => {
    const msg = buildInterestMessage(base);
    expect(msg).toContain("Mansão no Jardim Ubá I");
    expect(msg).toContain("https://exemplo.com/imoveis/mansao-jardim-uba");
    expect(msg).toContain("Nome: Ana");
    expect(msg).toContain("Telefone: 21999998888");
    expect(msg).toContain("E-mail: ana@exemplo.com");
  });

  it("omite a linha de mensagem quando ela não foi preenchida", () => {
    expect(buildInterestMessage(base)).not.toContain("Mensagem:");
  });

  it("omite a linha de mensagem quando ela é só espaço em branco", () => {
    expect(buildInterestMessage({ ...base, mensagem: "   " })).not.toContain("Mensagem:");
  });

  it("inclui a mensagem quando preenchida", () => {
    expect(buildInterestMessage({ ...base, mensagem: "Posso visitar sábado?" })).toContain(
      "Mensagem: Posso visitar sábado?"
    );
  });

  it("remove espaço em volta dos campos", () => {
    expect(buildInterestMessage({ ...base, nome: "  Ana  " })).toContain("Nome: Ana");
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
npm test -- interest-message
```
Esperado: FAIL — `Failed to resolve import "@/lib/interest-message"`.

- [ ] **Step 3: Criar `lib/interest-message.ts`**

```ts
export type InterestInput = {
  title: string;
  url: string;
  nome: string;
  telefone: string;
  email: string;
  mensagem?: string;
};

/**
 * Monta o texto enviado ao WhatsApp da imobiliária.
 * Puro de propósito: é a única parte testável do formulário.
 */
export function buildInterestMessage(input: InterestInput): string {
  const mensagem = input.mensagem?.trim();

  return [
    `Olá! Tenho interesse no imóvel ${input.title.trim()}.`,
    input.url,
    "",
    `Nome: ${input.nome.trim()}`,
    `Telefone: ${input.telefone.trim()}`,
    `E-mail: ${input.email.trim()}`,
    mensagem ? `Mensagem: ${mensagem}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
npm test
```
Esperado: PASS.

- [ ] **Step 5: Reescrever `components/site/property-interest-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { SITE, whatsappLink } from "@/lib/config";
import { buildInterestMessage } from "@/lib/interest-message";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const FIELD =
  "w-full rounded-lg border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/10 focus:ring-2";

export function PropertyInterestForm({
  propertyTitle,
  propertySlug,
}: {
  propertyTitle: string;
  propertySlug: string;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const message = buildInterestMessage({
      title: propertyTitle,
      url: `${SITE.url}/imoveis/${propertySlug}`,
      nome: String(data.get("nome") ?? ""),
      telefone: String(data.get("telefone") ?? ""),
      email: String(data.get("email") ?? ""),
      mensagem: String(data.get("mensagem") ?? ""),
    });

    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <div className="h-fit rounded-2xl bg-kenesis-cream p-7">
      <h3 className="font-display text-xl text-kenesis-greenDark">Tenho interesse</h3>
      <p className="mt-1 text-[13px] text-neutral-600">Preencha e um corretor entra em contato.</p>
      {sent ? (
        <div className="mt-6 rounded-xl bg-white p-5 text-sm text-kenesis-green">
          Abrimos o WhatsApp com a sua mensagem pronta — é só enviar.{" "}
          <button type="button" onClick={() => setSent(false)} className="underline">
            Não abriu? Preencher de novo
          </button>
        </div>
      ) : (
        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <label htmlFor="interesse-nome" className="sr-only">
            Nome
          </label>
          <input
            id="interesse-nome"
            name="nome"
            required
            autoComplete="name"
            placeholder="Nome"
            className={FIELD}
          />

          <label htmlFor="interesse-telefone" className="sr-only">
            Telefone ou WhatsApp
          </label>
          <input
            id="interesse-telefone"
            name="telefone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="Telefone / WhatsApp"
            className={FIELD}
          />

          <label htmlFor="interesse-email" className="sr-only">
            E-mail
          </label>
          <input
            id="interesse-email"
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder="E-mail"
            className={FIELD}
          />

          <label htmlFor="interesse-mensagem" className="sr-only">
            Mensagem (opcional)
          </label>
          <textarea
            id="interesse-mensagem"
            name="mensagem"
            rows={3}
            placeholder="Mensagem (opcional)"
            className={FIELD}
          />

          <InteractiveHoverButton type="submit" text="Enviar interesse" className="w-full bg-kenesis-lime" />
        </form>
      )}
    </div>
  );
}
```

Três correções num diff só:
- **`name` em todo campo** — sem isso o `FormData` volta vazio, e é o mesmo `name` que a Server Action vai ler na fase de banco.
- **`<label class="sr-only">`** — `placeholder` some ao digitar e não é lido de forma consistente por leitor de tela (spec §12). `sr-only` não muda um pixel.
- **A confirmação parou de mentir.** Antes prometia contato com um lead que tinha sido descartado. Agora descreve o que aconteceu de verdade e oferece saída se o popup foi bloqueado.

> ponytail: interino até existir a tabela `leads`. Quando a Server Action entrar, `handleSubmit` grava no banco e o WhatsApp vira o botão secundário. `buildInterestMessage` continua sendo usada — a mensagem pré-preenchida está na spec §6.

- [ ] **Step 6: Verificar**

```bash
npm run build && npm test
npm run dev
```

Em `http://localhost:3000/imoveis/mansao-jardim-uba`:
- preencher os quatro campos e enviar → abre `wa.me` em aba nova com título, URL e os dados no texto
- enviar sem a mensagem opcional → o texto não tem a linha "Mensagem:"
- o bloco de confirmação aparece e o link "Preencher de novo" volta ao formulário
- inspecionar: cada input tem `<label class="sr-only">` associado por `htmlFor`/`id`
- o formulário está visualmente idêntico

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix(lead): formulário de interesse para de descartar o contato e ganha labels"
```

---

## Task 10: `generateMetadata`, `sitemap.ts` e `robots.ts`

O site não tem nenhum dos três. Toda página de imóvel serve hoje o mesmo `<title>` do layout raiz.

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/(site)/imoveis/[slug]/page.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `SITE` de `@/lib/config`; `findPublishedBySlug`, `listSlugs` de `@/server/properties/repository`.
- Produces: nenhuma nova exportação para outras tarefas.

- [ ] **Step 1: `metadataBase` no layout raiz**

Em `app/layout.tsx`, importar `SITE` e adicionar duas chaves ao objeto `metadata` existente (não substitua as outras):

```ts
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Kenesis Imobiliária | Alto padrão em Niterói",
  description:
    "Imóveis de médio e alto padrão em Niterói, Rio de Janeiro e região. Casas, apartamentos, terrenos e empreendimentos.",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
};
```

`metadataBase` é o que faz `canonical: "/"` e `images: ["/imoveis/..."]` virarem URL absoluta. Sem ele o Next emite aviso no build e usa `localhost`.

- [ ] **Step 2: `generateMetadata` na página de imóvel**

Adicionar em `app/(site)/imoveis/[slug]/page.tsx`, acima de `generateStaticParams`:

```tsx
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const property = findPublishedBySlug(params.slug);
  if (!property) return { title: "Imóvel não encontrado | Kenesis" };

  const description = property.desc.length > 155 ? `${property.desc.slice(0, 155)}…` : property.desc;
  const path = `/imoveis/${property.slug}`;

  return {
    title: `${property.title} — ${property.location} | Kenesis`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Kenesis Imobiliária",
      title: property.title,
      description,
      url: path,
      images: [{ url: property.img, width: 1200, height: 630, alt: property.title }],
    },
  };
}
```

`property.img` é caminho relativo (`/imoveis/<slug>/01.webp`) e o `metadataBase` do Step 1 o torna absoluto. `width`/`height` são o que as redes sociais esperam declarado; o recorte real fica a cargo delas (dívida registrada na spec §13).

- [ ] **Step 3: Criar `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { listSlugs } from "@/server/properties/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/imoveis`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...listSlugs().map((slug) => ({
      url: `${SITE.url}/imoveis/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

- [ ] **Step 4: Criar `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

`sitemap.ts` e `robots.ts` ficam em `app/`, fora do route group — são rotas do site inteiro, não da seção pública.

> Nada recebe `noindex` nesta fase: `?tipo=` é um parâmetro com 4 valores possíveis, não combinação infinita. O `noindex` de filtros da spec §6 entra junto com os filtros avançados.

- [ ] **Step 5: Verificar**

```bash
npm run build && npm run dev
```

- `http://localhost:3000/sitemap.xml` — XML com 22 `<url>` (home + listagem + 20 imóveis)
- `http://localhost:3000/robots.txt` — `Allow: /` e a linha `Sitemap:`
- `view-source:http://localhost:3000/imoveis/mansao-jardim-uba` — `<title>` com o nome do imóvel, `<link rel="canonical">`, `og:title`, `og:image` com URL absoluta
- `http://localhost:3000/imoveis` — `<title>Todos os imóveis | Kenesis</title>`
- o build **não** emite aviso de `metadataBase`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(seo): metadata por imóvel, sitemap.xml e robots.txt"
```

---

## Task 11: `Reveal` acessível e legível sem JavaScript

`reveal.tsx:36` entrega todo o conteúdo com `opacity: 0` até o `IntersectionObserver` disparar, e ignora `prefers-reduced-motion`. Sem JS, a página fica em branco.

**Files:**
- Modify: `components/site/reveal.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:** a assinatura de `Reveal` não muda.

> Os dois problemas são resolvidos por CSS. Fazer no JS custaria estado extra, `matchMedia` e um flash de conteúdo entre o servidor e o primeiro efeito. Duas regras de CSS não têm nenhum desses.

- [ ] **Step 1: Marcar o elemento**

Em `components/site/reveal.tsx`, adicionar `data-reveal` ao `<div>` (linha 32-33). Nada mais muda no arquivo:

```tsx
    <div
      ref={ref}
      data-reveal
      className={className}
```

- [ ] **Step 2: Regra de `prefers-reduced-motion` em `app/globals.css`**

Ao final do arquivo:

```css
/* Quem pediu menos movimento no sistema vê o conteúdo direto, sem transição.
   Precisa de !important: o Reveal aplica opacity e transform inline. */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 3: Fallback sem JavaScript em `app/layout.tsx`**

O `return` inteiro passa a ser:

```tsx
  return (
    <html lang="pt-BR">
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body id="topo">{children}</body>
    </html>
  );
```

`<head>` explícito no root layout é suportado no App Router e convive com a Metadata API — o Next mescla as duas coisas. Não mova nada do objeto `metadata` para dentro dele.

- [ ] **Step 4: Verificar**

```bash
npm run build && npm run dev
```

- Normal: as seções continuam entrando com fade + subida ao rolar.
- DevTools → Rendering → **Emulate CSS prefers-reduced-motion: reduce** → recarregar: tudo visível de imediato, sem animação.
- DevTools → Settings → Debugger → **Disable JavaScript** → recarregar: o texto das seções aparece (o carrossel de destaques perde as setas, o que é esperado).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "a11y(reveal): respeita prefers-reduced-motion e não some sem JavaScript"
```

---

## Task 12: Limpeza de código morto e verificação final da fase

**Files:**
- Delete: `components/site/contato.tsx`

- [ ] **Step 1: Confirmar que `contato.tsx` é morto**

```bash
grep -rn "site/contato\|<Contato" app components
```
Esperado: nenhuma linha. O componente nunca foi importado; a seção `id="contato"` que o site realmente renderiza está em `components/ui/motion-footer.tsx:253`. Se aparecer qualquer import, **pare e não delete**.

- [ ] **Step 2: Deletar**

```bash
git rm components/site/contato.tsx
```

- [ ] **Step 3: Verificação final da fase inteira**

```bash
npm run build
npm run lint
npm test
```

Todos devem passar. Confirmações finais:

```bash
# nenhum componente importa dados do servidor
grep -rn "@/server/" components
```
Esperado: **nenhuma linha**.

```bash
# server/ não conhece o Next nem React
grep -rn "from \"next\|from \"react" server
```
Esperado: **nenhuma linha**.

```bash
# o acervo saiu do bundle do cliente
grep -rl "mansao-jardim-uba\|casa-3-suites-sao-francisco" .next/static/chunks
```
Esperado: **nenhum arquivo**.

```bash
# nenhum contato hardcoded fora de lib/
grep -rn "976248282\|kenesisimoveis@gmail" app components
```
Esperado: **nenhuma linha**.

- [ ] **Step 4: Conferência visual final**

`npm run dev` e percorrer, comparando com o site em produção:

| URL | O que confirmar |
|---|---|
| `/` | hero, sobre, categorias, destaques (6 cards + "20 propriedades"), serviços, equipe, depoimentos, FAQ, footer |
| `/imoveis` | 20 cards, chips de tipo |
| `/imoveis?tipo=Casa` | filtro aplicado, pill removível, botão Voltar funciona |
| `/imoveis/mansao-jardim-uba` | galeria, características, mapa, formulário, 3 semelhantes |
| `/imoveis/nao-existe` | 404 com header e footer |
| `/sitemap.xml` | 22 URLs |
| `/robots.txt` | `Allow: /` + linha `Sitemap:` |

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove components/site/contato.tsx (código morto)"
```

---

## Estado ao final da fase

O que a fase de banco encontra pronto:

- `server/properties/repository.ts` é o **único** lugar que lê imóveis. Trocar array por Drizzle é reescrever oito corpos de função.
- Nenhuma página ou componente importa dados diretamente — nenhum deles é tocado de novo na fase seguinte.
- Layout único em `app/(site)/layout.tsx`: `app/(admin)/` entra como irmão, sem colidir.
- `lib/config.ts` já lê env; `DATABASE_URL` e companhia entram no mesmo `.env.example`.
- Vitest rodando, com testes que travam as regressões que importam.
- Formulário de interesse com `name` em todo campo — os mesmos nomes que a Server Action vai ler.

O que continua pendente por dependência de banco, e **de propósito**: schema tipado de imóveis, tabela `leads` e captura real, `revalidateTag` no lugar de `generateStaticParams`, páginas de segmento por bairro e tipo, JSON-LD, mudança de slug com 301.
