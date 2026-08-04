# Área administrativa da Kenesis — design

**Data:** 2026-08-02
**Estado:** aprovado para planejamento
**Escopo deste documento:** especificação. Nenhuma implementação.

---

## 1. Contexto

O site da Kenesis está no ar em Next.js 14 (App Router) + TypeScript + Tailwind. Todo o conteúdo é estático: 20 imóveis, 3 membros de equipe, 2 depoimentos, 8 FAQs, categorias e serviços vivem como constantes em `lib/data.ts`, e 147 fotos (17 MB) estão versionadas em `public/imoveis/<slug>/NN.webp`.

O objetivo é uma área administrativa que permita cadastrar e gerir imóveis, usuários (corretores) e depoimentos, mantendo o projeto como um monolito Next.js.

**A parte visual está definida e não é alterada por esta spec.** Todo o trabalho descrito é de estrutura de dados, fronteira servidor/cliente e backend.

### Diagnóstico do código atual

Levantamento feito sobre o repositório em 2026-08-02:

| Achado | Evidência |
|---|---|
| 10 arquivos importam de `lib/data.ts` | `categorias`, `destaques`, `equipe`, `faq`, `header`, `servicos`, `property-card`, `property-detail`, `app/imoveis/page.tsx`, `app/imoveis/[slug]/page.tsx` |
| Telefone hardcoded em 8 lugares, e-mail em 5 | `header.tsx` (2x), `contato.tsx` (2x), `motion-footer.tsx` (2x), `glassmorphism-trust-hero.tsx`, `lib/data.ts` (3x) |
| `/imoveis` é `"use client"` e embarca o acervo no bundle | `app/imoveis/page.tsx:1` e `:8` |
| Página de imóvel embarca o acervo inteiro para calcular "semelhantes" | `property-detail.tsx:6` e `:15` |
| Header/Footer + wrapper repetidos nas 3 páginas | `app/page.tsx`, `app/imoveis/page.tsx`, `app/imoveis/[slug]/page.tsx` |
| `<img>` cru com `eslint-disable`, sem `srcset` | `property-card.tsx:11`, `property-detail.tsx:24` e `:33` |
| Sem `sitemap.ts` e sem `robots.ts` | `app/` contém apenas `globals.css`, `imoveis/`, `layout.tsx`, `page.tsx` |
| **Formulário "Tenho interesse" descarta o lead** | `property-detail.tsx:82` — `onSubmit` faz `e.preventDefault(); setSent(true)` e os inputs não têm `name` |
| GSAP usado num único arquivo | `motion-footer.tsx` — ~70 KB gzipped carregados em toda página |
| `Reveal` entrega conteúdo com `opacity: 0` até o JS rodar, sem `prefers-reduced-motion` | `reveal.tsx:36` |

O formulário que descarta lead é **bug em produção**, não backlog: o site diz "Recebido! Em breve alguém da equipe fala com você" e joga nome, telefone, e-mail e mensagem fora.

### Problemas do modelo de dados atual

```
tag:      "Alto padrão" | "Casa" | "Terreno" | "Empreendimento"
          → mistura padrão de acabamento com tipo de imóvel; são dimensões
            distintas, não alternativas excludentes
area:     "450 m²" | "Residencial" | "Lançamento" | "Studios"
          → às vezes metragem, às vezes rótulo de marketing
price:    "Consulte valores" em 20 de 20 imóveis
          → o valor real não existe em lugar nenhum do sistema
location: "Jardim Ubá I, Niterói, RJ"
          → string única, impossível filtrar por bairro
```

---

## 2. Escopo

### Incluído

- Painel administrativo: imóveis, usuários/equipe, depoimentos, leads
- Autenticação própria com dois papéis (`admin`, `corretor`)
- Banco Postgres, storage de imagens, upload pelo painel
- Captura real de leads com atribuição de campanha (UTM)
- Reestruturação do site público em camadas, com filtro na URL
- SEO por imóvel: slug, metadata, JSON-LD, sitemap, redirect 301

### Excluído (nomeado, não esquecido)

E-mail transacional de notificação de lead · analytics/pixel e consentimento LGPD · UI de busca textual · UI de filtros avançados · mapa com pins · API REST · fluxo de locação · feed XML para portais (VivaReal/ZAP/OLX).

> O feed XML para portais é o destino natural seguinte. Ele exige campos tipados — tipo, quartos, área numérica, preço, coordenadas. É exatamente o schema desta spec. Tipar os campos agora é o que torna o feed possível depois; com os campos-texto atuais, seria inviável.

---

## 3. Decisões

| # | Decisão | Justificativa |
|---|---|---|
| D1 | Monolito Next.js portátil | Um app: site + `/admin` + Server Actions. "Sem lambdas" foi esclarecido como **sem código de fornecedor** — nada de Supabase Edge Functions nem APIs proprietárias da Vercel. Route Handlers rodando como serverless na Vercel são aceitáveis porque o mesmo código roda com `next start` num container |
| D2 | Papéis `admin` e `corretor`, sem posse de imóvel | O imóvel pertence à imobiliária. `created_by` registra autoria para auditoria e para viabilizar posse no futuro sem migração |
| D3 | Admin gerencia imóveis, usuários/equipe e depoimentos | FAQ, categorias e serviços (16 registros que mudam ~2x/ano) seguem em código. Cada CRUD custa tela, formulário e manutenção |
| D4 | `users` = login **e** equipe pública | São a mesma pessoa. Tabelas separadas divergem no primeiro update esquecido |
| D5 | Schema tipado completo, UI de filtro depois | Colunas nascem tipadas; `/imoveis` mantém o filtro de tipo atual. `ALTER TABLE` em tabela vazia é barato; em produção, não |
| D6 | `latitude`/`longitude` desde já | Mapa é futuro certo. Geocodificar 200 imóveis depois é pior que duas colunas agora |
| D7 | Fotos no Supabase Storage; banco guarda **caminho**, não URL | Trocar de storage vira troca de env var, não `UPDATE` em massa |
| D8 | Leads em tabela + inbox no painel | Notificação por e-mail fica para a fase seguinte |
| D9 | Auth.js v5 + tabela `users` própria (bcrypt) | ~5 usuários internos, sem cadastro público — a vantagem do Supabase Auth (reset por e-mail) não se aplica. Mantém uma tabela só e `pg_dump` como caminho de migração |
| D10 | Arquitetura em camadas finas | `server/` não importa `next/*`; componentes não falam com o banco |
| D11 | Drizzle ORM sobre conexão Postgres direta | SQL de verdade, portátil para qualquer Postgres. `supabase-js` fala PostgREST e não teria como ser trocado |
| D12 | Slug muda para `tipo-quartos-bairro-cidade` | Ninguém pesquisa "mansao-jardim-uba". URLs atuais preservadas via 301 |
| D13 | GSAP **não** é removido nesta fase | Registrado como dívida |
| D14 | Sem ponto focal de imagem | CSS (`object-cover` + `aspect-ratio`) resolve o alinhamento sem tocar no arquivo original |
| D15 | `purpose` (`venda`/`locacao`) incluído desde já | Adicionar depois muda URL, filtro e semântica do preço |
| D16 | Endereço completo armazenado, oculto por padrão | Padrão de mercado por segurança do imóvel ocupado |
| D17 | Script de migração só para as fotos | Os campos que faltam exigem digitação humana de qualquer forma |

---

## 4. Arquitetura

```
app/
  (site)/                    layout com Header/Footer e o wrapper compartilhado
    page.tsx                 home
    imoveis/page.tsx         listagem (Server Component)
    imoveis/[slug]/page.tsx  detalhe + generateMetadata + JSON-LD
    imoveis/bairro/[bairro]/page.tsx   páginas de segmento indexáveis
    imoveis/tipo/[tipo]/page.tsx
  (admin)/
    login/  imoveis/  usuarios/  depoimentos/  leads/
  api/auth/[...nextauth]/
  sitemap.ts   robots.ts

server/                      Node puro. NÃO importa "next/*" nem React
  properties/repository.ts
  users/repository.ts
  leads/repository.ts
  testimonials/repository.ts
  auth/guards.ts

db/
  schema.ts       tabelas Drizzle
  client.ts       conexão (pooler | direta, por env)
  migrations/

lib/
  validation/     schemas Zod, compartilhados formulário ↔ servidor
  storage.ts      signed upload URL + montagem de URL pública
  content.ts      faq, categorias, servicos, HOME_SECTIONS
  config.ts       contatos, vindos de env
  utils.ts        cn()

components/
  site/    ui/    admin/
```

### Regras invioláveis

1. Componente nunca acessa o banco
2. `server/` nunca importa `next/*` ou React — é o que torna a migração real e permite testar sem subir o Next
3. Toda Server Action começa por um guard de autorização
4. Repositório separa por audiência no **nome da função**, não por parâmetro

`components/ui/*` permanece intacto: são componentes shadcn/21st.dev sem estado, e o README documenta a pasta como alvo do CLI do shadcn.

### Camadas

Começa com **um `repository.ts` por domínio**. `service.ts` é extraído quando surgir a primeira regra de negócio real (publicação de imóvel, transição de status de lead). Duas camadas onde uma resolve é cerimônia copiada por hábito.

### Server Actions, não REST

Server Actions são recurso do Next core, não da Vercel — rodam igual em container. Route Handler existe apenas para `/api/auth/[...nextauth]`. API REST entra quando existir um segundo consumidor.

---

## 5. Reestruturação do site público

| # | Hoje | Alvo | Motivo |
|---|---|---|---|
| 1 | `/imoveis` é `"use client"` e importa os 20 imóveis | Server Component + filtro em `searchParams` | Acervo inteiro no bundle; com 200 imóveis, inviável. Filtro na URL dá link compartilhável e página indexável |
| 2 | `property-detail` importa `properties` para "semelhantes" | Semelhantes vêm do servidor; client só na galeria e no formulário | Mesmo problema, em cada página de imóvel |
| 3 | `destaques.tsx` é `"use client"` e importa `properties` | Recebe imóveis por prop | Idem, na home |
| 4 | Header/Footer repetidos nas 3 páginas | `app/(site)/layout.tsx` | Triplicação literal |
| 5 | `<img>` com `eslint-disable` | `next/image` com `sizes` + `remotePatterns` do Storage | Sem `srcset`, o celular baixa imagem de desktop. LCP é ranqueamento |
| 6 | Alturas fixas (`h-56`, `h-[420px]`, `h-24`) | `aspect-[4/3]`, `aspect-[16/9]`, `aspect-square` | Reserva espaço antes do carregamento e elimina salto de layout (CLS) |
| 7 | Contatos em 8 e 5 lugares | `lib/config.ts` lendo env | Trocar o WhatsApp hoje é caça ao tesouro |
| 8 | `lib/data.ts` com 6 coleções | Tipos ← schema Drizzle · `lib/content.ts` (estático) · banco (imóveis, equipe, depoimentos) | Separa conteúdo estático de dado gerenciado |
| 9 | `generateStaticParams` sobre array em memória | Render dinâmico + `revalidateTag("properties")` | Rápido como estático, atualiza em segundos ao publicar, sem rebuild |

---

## 6. SEO e aquisição

### Por imóvel

| Item | Especificação |
|---|---|
| Slug | `tipo-quartos-bairro-cidade` → `casa-5-quartos-jardim-uba-niteroi`. Gerado do cadastro, editável |
| Histórico de slug | Tabela `property_slug_history`. Slug alterado → URL antiga responde **301**. Sem isso, todo link já enviado por WhatsApp vira 404 e o ranking acumulado zera |
| `generateMetadata` | `title`, `description` a partir dos campos tipados, `canonical`, `og:image` = foto de capa |
| JSON-LD | `RealEstateListing` por imóvel · `RealEstateAgent` na home · `BreadcrumbList` · `FAQPage` nas 8 perguntas existentes |
| `sitemap.ts` / `robots.ts` | Convenções nativas do Next, geradas do banco |

### Páginas de segmento

Rotas reais e indexáveis para recortes com acervo — `/imoveis/bairro/icarai`, `/imoveis/tipo/casas` — cada uma com `<h1>`, texto e metadata próprios, geradas para bairros/tipos com **pelo menos 3 imóveis**.

> **Por que o prefixo estático.** `/imoveis/casas-em-niteroi` colidiria com `/imoveis/[slug]`: são dois segmentos dinâmicos no mesmo nível, e o Next resolveria tudo pelo `[slug]`, fazendo a página de segmento cair no `notFound()` de imóvel. `bairro/` e `tipo/` desambiguam sem custo de SEO — a palavra-chave continua na URL.

Combinações livres de filtro (`?tipo=casa&quartos=3`) recebem `noindex`: são infinitas e, indexadas, viram conteúdo raso que penaliza o site inteiro.

Começar por **bairro** e **tipo**. Cruzamentos só quando houver acervo — 20 imóveis não sustentam dezenas de páginas.

### Campanhas

`leads` grava `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer` e `landing_page`. É o que responde "esse lead veio do Instagram ou do Google?".

Botão de compartilhar e link `wa.me` com mensagem pré-preenchida (`Olá, tenho interesse no <título> — <url>`).

Pixel e analytics ficam fora: exigem consentimento LGPD e banner de cookies, que é projeto próprio. UTMs dão atribuição sem cookie de terceiro.

### Busca

Coluna `tsvector` gerada + índice GIN entram no schema agora. UI depois.

---

## 7. Modelo de dados

Postgres. PK `uuid` (`gen_random_uuid()`). Toda data em `timestamptz`.

### Enums

```
user_role        admin | corretor
property_type    casa | apartamento | terreno | empreendimento | cobertura | comercial
segment          medio_padrao | alto_padrao
property_status  rascunho | publicado | reservado | vendido | arquivado
listing_purpose  venda | locacao
lead_status      novo | em_atendimento | convertido | perdido
```

### `users` — login e equipe pública

```
id                       uuid pk
email                    text unique not null
password_hash            text not null            -- bcrypt cost 12
name                     text not null
role                     user_role not null       -- PERMISSÃO
job_title                text                     -- CARGO, exibição
creci                    text
whatsapp                 text
bio                      text
photo_path               text
location                 text
is_public                boolean default false    -- aparece na seção Equipe
sort_order               smallint default 0
is_active                boolean default true
must_change_password     boolean default false
failed_login_attempts    smallint default 0
locked_until             timestamptz
created_at / updated_at  timestamptz
```

**Armadilha de nomenclatura:** no `data.ts` atual, `equipe[].role` é cargo ("CEO & Estratégia"); aqui `role` é permissão. Por isso `role` = permissão e `job_title` = cargo. Se ambos se chamarem `role`, alguém renderiza "admin" no card da home.

`is_active` em vez de exclusão: `created_by` em imóveis e `handled_by` em leads precisam continuar apontando para alguém.

### `properties`

```
id                uuid pk
slug              text unique not null
title             text not null
property_type     property_type not null
segment           segment
purpose           listing_purpose not null default 'venda'
status            property_status not null default 'rascunho'
description       text

price_cents       bigint
price_visible     boolean default false
condo_fee_cents   bigint
iptu_cents        bigint

area_total_m2     numeric(10,2)
area_built_m2     numeric(10,2)
bedrooms          smallint
suites            smallint
bathrooms         smallint
parking_spaces    smallint

neighborhood      text            -- indexado; alimenta páginas de segmento
city              text default 'Niterói'
state             char(2) default 'RJ'
zip               text
address_street    text
address_number    text
address_complement text
address_visible   boolean default false
latitude          numeric(10,7)
longitude         numeric(10,7)

features          text[]          -- ['piscina','churrasqueira'] — índice GIN
developer         text
delivery_estimate date

is_featured       boolean default false
featured_order    smallint

meta_title        text
meta_description  text
search_vector     tsvector generated
                  -- de title, description, neighborhood e city
                  -- configuração 'portuguese'. índice GIN

created_by        uuid → users(id)
published_at      timestamptz
created_at / updated_at
```

Todos os campos opcionais são de fato opcionais no formulário.

**Três decisões embutidas:**

- **`price_cents` + `price_visible`** — o valor real é sempre gravado; `price_visible` controla apenas a exibição. Hoje os 20 imóveis dizem "Consulte valores" e o número não existe em lugar nenhum. É o dado mais valioso de uma imobiliária.
- **`features` como `text[]`** — array nativo do Postgres, filtra com `&&` e índice GIN. Economiza uma tabela e dois joins. Vira tabela quando amenidade precisar de ícone e descrição próprios.
- **`segment` separado de `property_type`** — desfaz a confusão do `tag`, onde "Alto padrão" e "Casa" eram excludentes. Uma casa pode ser as duas coisas.

### `property_images`

```
id           uuid pk
property_id  uuid → properties(id) on delete cascade
path         text not null    -- "imoveis/<slug>/<uuid>.webp" — caminho, nunca URL
alt          text
sort_order   smallint
is_cover     boolean default false
```

### `property_slug_history`

```
id           uuid pk
property_id  uuid → properties(id) on delete cascade
slug         text unique not null
created_at   timestamptz
```

### `testimonials`

```
id            uuid pk
quote         text not null
author_name   text not null
author_role   text
photo_path    text
is_published  boolean default false
sort_order    smallint
created_at    timestamptz
```

### `leads`

```
id            uuid pk
name          text not null
phone         text not null
email         text not null
message       text
property_id   uuid → properties(id)     -- null = contato geral
status        lead_status default 'novo'
utm_source / utm_medium / utm_campaign / utm_content / utm_term   text
referrer      text
landing_page  text
ip_hash       text                      -- SHA-256 com salt (LGPD), para throttle
handled_by    uuid → users(id)
handled_at    timestamptz
created_at    timestamptz
```

### Segurança: por que o nome da função importa

O acesso é Drizzle por conexão direta ao Postgres, não `supabase-js` com chave anônima. **RLS não protege nada** — toda autorização vive em `server/`. Uma única query pública sem `status = 'publicado'` vaza rascunho e imóvel vendido para o site.

```
server/properties/repository.ts
  findPublishedBySlug()   ← site. filtro embutido, não é parâmetro
  findPublishedList()
  findAllForAdmin()       ← só sob sessão autenticada
```

O filtro não pode ser um argumento que alguém esquece de passar.

---

## 8. Camada de servidor e painel

### Fluxo de escrita

```
formulário (client)
  → Server Action
      1. Zod .parse()                ← revalida no servidor, sempre
      2. requireAdmin() / requireSession()
      3. repository.*()
      4. revalidateTag("properties")
  → resultado tipado
```

Schemas Zod em `lib/validation/`, os mesmos no formulário e na action. Cliente valida para dar feedback; servidor valida porque o cliente é do usuário.

### Autorização

```
server/auth/guards.ts
  requireSession()  → sessão válida, senão redirect /admin/login
  requireAdmin()    → role === 'admin', senão 403
```

`middleware.ts` protege `/admin/*` como primeira barreira, mas é conveniência de navegação. **A checagem que vale é a de dentro da action** — Server Action é endpoint HTTP e responde a quem souber invocá-la. Esconder o botão no menu não é autorização.

`corretor` gerencia imóveis, depoimentos e leads. `admin` faz isso mais usuários.

### Telas

| Rota | Conteúdo | Acesso |
|---|---|---|
| `/admin/login` | E-mail e senha | público |
| `/admin` | Contadores: publicados, rascunhos, leads novos | sessão |
| `/admin/imoveis` | Lista com busca, filtro por status/tipo, paginação | sessão |
| `/admin/imoveis/novo` · `/[id]` | Formulário em blocos: dados, valores, localização, características, fotos, SEO | sessão |
| `/admin/depoimentos` | CRUD + publicar/despublicar | sessão |
| `/admin/leads` | Inbox, status, marcar atendido | sessão |
| `/admin/usuarios` | CRUD, redefinir senha, ativar/desativar | **admin** |

Paginação desde a primeira versão.

### Upload de fotos

O caminho direto (arquivo passando pela Server Action) esbarra no limite de **4,5 MB de body por request na Vercel**, e foto de celular passa disso.

```
1. client redimensiona no canvas → WebP, lado maior ≤ 2000px
2. Server Action gera signed upload URL para "imoveis/<slug>/<uuid>.webp"
3. client faz PUT direto no Storage — o arquivo não passa pelo Next
4. Server Action grava a linha em property_images
```

O redimensionamento no cliente são ~30 linhas de canvas, sem dependência nova, e derruba uma foto de 5 MB para ~200 KB antes de sair do navegador. Economiza banda, o 1 GB do free tier e o tempo de upload no 4G do corretor em visita.

Validação adicional: **rejeitar imagem abaixo de ~1000px** no lado maior. Foto pequena esticada num hero fica borrada, e CSS não recupera resolução inexistente.

`lib/storage.ts` concentra duas funções: gerar a signed URL e montar a URL pública a partir do `path` + env var.

### Anti-spam no formulário de lead

Único endpoint gravável exposto sem autenticação:

- **honeypot** — campo oculto; se vier preenchido, descarta silenciosamente
- **tempo mínimo** entre carregar e enviar
- **throttle por `ip_hash`** — rejeita a partir do 6º envio em 10 minutos

Os três usam apenas o banco existente. Rate limiter dedicado é mais um serviço na POC para um problema que uma query resolve.

### Revalidação

Publicar imóvel dispara `revalidateTag("properties")` e `revalidatePath("/imoveis/[slug]", "page")`.

---

## 9. Autenticação

### Estrutura imposta pelo runtime

```
auth.config.ts   → só Edge-safe: páginas e callbacks. NÃO importa bcrypt nem o banco
auth.ts          → NextAuth(authConfig) + Credentials + bcrypt + repositório. Node
middleware.ts    → importa auth.config.ts
```

O middleware roda em Edge runtime, onde bcrypt e o driver Postgres não existem. Configuração num arquivo só quebra no build — e não aparece em desenvolvimento.

**Sessão em JWT.** Não é preferência: o Credentials provider do Auth.js só suporta estratégia `jwt`. Efeito colateral positivo: dispensa adapter e as tabelas `sessions`/`accounts`.

### A consequência do JWT

Token assinado vale até expirar — desativar um corretor não derruba a sessão dele.

`requireSession()` busca o usuário no banco a cada request do painel e confere `is_active` e `role` atuais, em vez de confiar no token. Uma query por PK indexada, irrelevante no volume de um painel interno. Desativação passa a ser imediata, e promoção de papel também vale sem novo login. O JWT carrega apenas o `id`.

### Senhas

- bcrypt cost 12
- Mínimo 12 caracteres, validado por Zod no servidor
- Busca o usuário **por e-mail**, depois `bcrypt.compare()`

> A documentação oficial do Auth.js exemplifica `getUserFromDb(email, pwHash)` — buscar pelo hash. Com bcrypt o salt é aleatório e o hash nunca bate. Registrado aqui porque é fácil copiar sem perceber.

- Erro de login sempre genérico ("e-mail ou senha inválidos"). Mensagem específica entrega quais contas existem.

### Força bruta

5 tentativas erradas → `locked_until` por 15 min. Zera no login correto.

### Primeiro admin

`npm run seed:admin`, lendo `ADMIN_EMAIL` e `ADMIN_PASSWORD` do ambiente, **recusando-se a rodar se já existir qualquer usuário**.

Rota `/admin/setup` de bootstrap foi descartada: é um endpoint que cria administrador, exposto na internet. Se a checagem falhar, é tomada de conta do sistema.

### Recuperação de senha

Admin redefine pela tela de usuários; `must_change_password` força a troca no primeiro login, e `requireSession()` redireciona para a troca enquanto estiver `true`. Sem fluxo por e-mail nesta fase.

---

## 10. Migração do conteúdo atual

### Ordem

```
1. schema + migrations
2. npm run seed:admin
3. cadastro manual de 2-3 imóveis com fotos    ← valida o painel
4. resto: script de fotos + digitação
5. cutover: remove lib/data.ts (imóveis/equipe/depoimentos) e public/imoveis/
```

O passo 3 não é só teste: cadastrar um imóvel completo à mão revela se o formulário é usável — quantos campos, em que ordem, o que trava. Script de migração nunca reclama do formulário.

### O que o script faz

Executado uma vez, sem interface: lê `properties` do `lib/data.ts`, cria as linhas, sobe as fotos de `public/imoveis/<slug>/` para o Storage, grava `property_images` e **registra o slug atual em `property_slug_history`** apontando para o novo.

O registro do slug antigo é obrigatório **também no cadastro manual**: as 20 URLs de hoje estão indexadas e já circularam por WhatsApp. Sem o histórico, viram 404.

### O que o script não resolve

| Campo | Situação | Quem resolve |
|---|---|---|
| `property_type` | 16 de 20 marcados "Empreendimento", que é fase de venda e não tipo | Humano, imóvel a imóvel |
| `segment` | Apenas 1 marcado "Alto padrão" | Humano |
| `price_cents` | 20 de 20 dizem "Consulte valores" | Kenesis |
| `bedrooms`, `bathrooms`, `parking_spaces` | Presentes em 3 de 20 | Kenesis |
| `area_total_m2` | Só 2 têm metragem real; os demais trazem "Lançamento", "Residencial", "Studios" | Kenesis |
| `latitude`/`longitude` | Não existem | Kenesis ou geocodificação |

**Decisão (D17):** construir apenas a parte de fotos do script. Os campos faltantes exigem digitação humana de qualquer forma, e com 20 imóveis o cadastro manual sai mais rápido que escrever e depurar o script completo. O ganho real do script são as 147 fotos.

### Equipe e depoimentos

Os 3 membros viram linhas em `users` com `is_public = true` — cada um precisa de e-mail e senha, mesmo sem usar o painel. Quem não operar o sistema entra com `is_active = false`: aparece na home, não faz login.

**Premissa a confirmar:** os dois sócios-CEO como `admin` e Vinicius Rodrigues como `corretor`, os três ativos.

Os 2 depoimentos são digitados no painel.

### Cutover

`lib/data.ts` perde `properties`, `equipe` e `testimonials`; mantém `faqs`, `categorias`, `servicos` e `HOME_SECTIONS`, e vira `lib/content.ts`. `public/imoveis/` (17 MB) e `public/team/` (1,1 MB) saem do repositório **somente após** as fotos estarem no Storage e o site apontando para lá.

---

## 11. Deploy, ambientes e portabilidade

### Serviços

App na Vercel. Postgres e Storage no Supabase. E-mail transacional fora desta fase.

### Variáveis de ambiente

```
DATABASE_URL                 # pooler :6543 — runtime
DIRECT_URL                   # direto :5432 — migrations e seed
AUTH_SECRET
AUTH_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY    # só servidor. NUNCA com prefixo NEXT_PUBLIC_
NEXT_PUBLIC_STORAGE_BASE_URL
NEXT_PUBLIC_SITE_URL         # canonical, sitemap, og:url
CONTACT_WHATSAPP / CONTACT_EMAIL
```

Duas URLs de banco não é redundância: **`drizzle-kit` não roda migration pelo pooler** em modo Transaction — DDL precisa de sessão. Runtime usa o pooler, migration usa a direta.

`prepare: false` no cliente `postgres-js` é **obrigatório** com o pooler em modo Transaction. Sem ele, a falha é intermitente.

### O que amarra no Supabase — e só isso

```
1. DATABASE_URL                    → qualquer Postgres. pg_dump/restore
2. NEXT_PUBLIC_STORAGE_BASE_URL    → prefixo de URL. Uma variável
3. lib/storage.ts                  → signed upload URL. Um arquivo
```

`server/`, `db/schema.ts` e as Server Actions não sabem que o Supabase existe.

Migrar para container: `Dockerfile` com `next start` e `DATABASE_URL` na conexão direta (sem pooler, sem `prepare: false`). O código não muda.

### Riscos do free tier

1. **O plano Hobby da Vercel é para uso não comercial.** O site de uma imobiliária que capta lead é uso comercial. Confirmar nos termos vigentes antes de contar com ele em produção; provavelmente exigirá o Pro (~US$ 20/mês). Se custo zero for inegociável, o **Netlify** permite uso comercial no free tier e roda Next.js; o Render também, com hibernação.
2. **Projeto Supabase gratuito é pausado após ~7 dias sem atividade.** Em site de baixo tráfego, é a causa mais provável de "o site caiu sozinho".
3. **Cota de otimização de imagem da Vercel no free tier.** Com 147 fotos e `next/image`, é possível estourar. Saída: servir do Storage sem otimização da Vercel — o canvas já entrega WebP redimensionado, então a perda é pequena.

### Backup

O free tier do Supabase não garante backup restaurável no nível que um acervo de imóveis e uma base de leads merecem. `pg_dump` agendado via GitHub Actions (cron, gratuito), gravando o dump como artifact ou em bucket. ~15 linhas de workflow.

---

## 12. Erros, testes e acessibilidade

### Erros

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; fieldErrors?: Record<string, string[]>; message?: string }
```

Erro de validação volta para o campo. Erro inesperado é logado no servidor com contexto e devolve mensagem genérica — stack trace no navegador entrega estrutura interna. `error.tsx` e `not-found.tsx` em cada route group.

**Falha ao gravar lead tem tratamento próprio:** se o banco cair, o formulário não pode dizer "Recebido!" — que é exatamente o defeito do código atual. Ou grava, ou mostra o erro com o WhatsApp como alternativa.

### Testes (Vitest)

| Alvo | Motivo |
|---|---|
| Geração de slug + unicidade | Alimenta URL e SEO; colisão silenciosa é perda de página |
| Resolução de slug antigo → 301 | O 404 aqui é invisível para quem publica |
| `price_cents` ↔ exibição e `price_visible` | Dinheiro |
| Schemas Zod | Fronteira de confiança |
| `findPublished*` nunca devolve rascunho | Sem RLS, é a única barreira contra vazar rascunho e imóvel vendido |

Sem E2E nesta fase. Sem teste de componente visual — o layout está validado e não muda.

### Acessibilidade

`<label>` real em todo campo — os inputs atuais usam apenas `placeholder`, que desaparece ao digitar e não é lido de forma consistente por leitores de tela. `alt` vindo do banco. Foco visível. `prefers-reduced-motion` respeitado no `Reveal`.

---

## 13. Dívidas registradas

| Dívida | Custo conhecido | Quando resolver |
|---|---|---|
| GSAP em `motion-footer.tsx` | ~70 KB gzipped em toda página, por uma animação | Quando houver orçamento de performance; `framer-motion` já está no projeto |
| Sem reset de senha por e-mail | Admin conhece a senha temporária de todos | Quando entrar e-mail transacional |
| Rate limit em memória/banco | Não é distribuído | Quando houver mais de uma instância |
| Sem variante dedicada de `og:image` | Recorte da rede social sobre a foto de capa | Quando a distribuição por link estiver medida |
| Filtros e busca sem UI | Schema pronto, interface ausente | Quando o acervo crescer |

---

## 14. Riscos

| Risco | Mitigação |
|---|---|
| Query pública sem filtro de status vaza rascunho | Separação por nome de função + teste dedicado |
| Slug alterado quebra links já distribuídos | `property_slug_history` + 301 |
| Termos da Vercel Hobby incompatíveis com uso comercial | Verificar antes do go-live; Netlify como alternativa |
| Supabase gratuito pausa por inatividade | Monitorar; considerar plano pago no go-live |
| Acervo migrado sem preço, área e tipo | Migração é trabalho de conteúdo da Kenesis, não do código — planejar o preenchimento |
| bcrypt no middleware quebra o build | Split `auth.config.ts` / `auth.ts` desde o início |
