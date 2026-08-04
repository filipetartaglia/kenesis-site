# Kenesis — site (Next.js)

Next.js 14 (App Router) + TypeScript + Tailwind, com Postgres via Drizzle.
O site público e o painel administrativo são o mesmo app.

---

## Pré-requisitos

- **Node 20.6+** — os scripts usam `node --env-file`, que não existe antes disso
- **Docker Desktop** — o Postgres de desenvolvimento roda em container

---

## Primeira execução

```bash
npm install
cp .env.example .env.local     # PowerShell: Copy-Item .env.example .env.local
npm run db:up                  # sobe o Postgres (espere ficar healthy, ~5s)
npm run db:migrate             # cria as 6 tabelas e os 6 enums
npm run db:seed                # carrega a equipe
npm run dev
```

Abre em `http://localhost:3000`. O painel fica em `http://localhost:3000/admin/dashboard`.

Os valores do `.env.example` já batem com o `docker-compose.yml` — copiar o arquivo
é suficiente, não precisa editar nada para desenvolver.

> **O build precisa do banco de pé.** A home lê a equipe do Postgres, então
> `npm run build` falha com o container parado. Rode `npm run db:up` antes.

---

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção — **exige o banco no ar** |
| `npm run lint` | ESLint |
| `npm run db:up` | Sobe o Postgres em container |
| `npm run db:down` | Derruba o container, **preservando** os dados |
| `npm run db:generate` | Gera migration a partir de `db/schema.ts` |
| `npm run db:migrate` | Aplica as migrations pendentes |
| `npm run db:seed` | Carrega dados iniciais. Idempotente — pode rodar de novo |
| `npm run db:check` | Testa as regras do schema contra o banco real |
| `npm run db:studio` | Abre o Drizzle Studio para inspecionar os dados |

Para apagar tudo e recomeçar do zero:

```bash
docker compose down -v         # o -v remove o volume, junto com os dados
npm run db:up && npm run db:migrate && npm run db:seed
```

---

## O banco local

Roda na **porta 5433**, não na 5432. Não é capricho: a 5432 costuma estar
ocupada por outro Postgres na máquina, e o conflito só aparece quando os dois
sobem juntos — com uma mensagem que não ajuda em nada.

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Porta | **5433** |
| Banco | **`kenesis`** |
| Usuário / senha | `kenesis` / `kenesis` |
| Schema | `public` |

> **Cliente gráfico mostrando "nenhuma tabela"?** Você está no banco `postgres`,
> não no `kenesis`. Todo servidor Postgres nasce com um banco `postgres` de
> manutenção, e é para ele que pgAdmin, DBeaver e afins conectam por padrão.
> Troque o campo "Database" para `kenesis`. No DBeaver, marque também
> **"Mostrar todos os bancos de dados"** na aba PostgreSQL e reconecte.

Sem cliente nenhum:

```bash
docker exec kenesis-db psql -U kenesis -d kenesis -c "\dt"
```

---

## Variáveis de ambiente

| Arquivo | Uso | Vai para o git? |
|---|---|---|
| `.env.example` | Template. **Nunca** coloque senha real aqui | sim |
| `.env.local` | Desenvolvimento local | não |
| `.env.supabase.local` | Produção (Supabase) | não |

`DATABASE_URL` é o runtime; `DIRECT_URL` é para migrations e seed, e precisa de
uma conexão em modo sessão — o pooler em modo Transaction não executa DDL.
Local, as duas apontam para o mesmo lugar.

> O arquivo de produção **não** se chama `.env.production.local` de propósito:
> esse nome é convenção do Next, que o carrega sozinho em toda build de
> produção — e aí `npm run build` se conectaria ao Supabase sem ninguém pedir.

Rodar contra produção é sempre explícito, nunca por padrão:

```bash
ENV_FILE=.env.supabase.local npx drizzle-kit migrate
npx tsx --env-file=.env.supabase.local db/seed.ts
```

---

## Estrutura

```
app/
  (site)/                    site público — o (site) não aparece na URL
    layout.tsx               Header + wrapper + Footer, uma vez só
    page.tsx                 home
    imoveis/page.tsx         listagem
    imoveis/[slug]/page.tsx  detalhe do imóvel
  admin/                     painel — fora do layout do site
  api/health/route.ts
  layout.tsx  globals.css  robots.ts  sitemap.ts

server/                      camada de dados. NÃO importa "next/*" nem React
  properties/  data.ts · repository.ts
  users/       data.ts · repository.ts

db/
  schema.ts                  as 6 tabelas e os 6 enums
  client.ts                  conexão Drizzle
  seed.ts                    dados iniciais
  smoke.sql                  verificação das regras do schema
  migrations/

components/
  site/    seções do site público
  admin/   componentes do painel
  ui/      shadcn / 21st.dev — ver observação abaixo

lib/
  content/   conteúdo que fica em código: FAQ, categorias, serviços
  mock/      dados falsos do painel, ainda não conectados ao banco
  config.ts  nome, contatos e links da empresa
  utils.ts   helper cn()

types/index.ts               tipos de domínio
```

### Duas regras que sustentam a estrutura

1. **Componente nunca lê a fonte de dados.** Quem conversa com `server/` é a
   página; o componente recebe por prop. É o que permite montar um componente
   em outro contexto e testá-lo sem a fonte junto.
2. **`server/` não importa `next/*` nem React.** É o que permite testar sem
   subir o Next e o que mantém a migração para container viável.

Repositórios separam público de administrativo **pelo nome da função**
(`findPublicTeam` × `findAllForAdmin`), não por parâmetro. Um filtro que é
argumento é um argumento que alguém esquece de passar — e aí dado interno vaza
para a página pública.

---

## Sobre a pasta `components/ui`

É o caminho padrão do CLI do shadcn. Qualquer componente novo do 21st.dev/shadcn
pode ser instalado com `npx shadcn@latest add "<url>"` na raiz — ele cai direto
em `components/ui/`, sem precisar mover nada na mão.

---

## Onde trocar coisas

- **Equipe** → no painel, ou `server/users/data.ts` + `npm run db:seed`
- **Imóveis** → `server/properties/data.ts` (ainda em memória; migra para o banco)
- **FAQ, categorias, serviços** → `lib/content/`
- **Nome, contatos e redes** → `lib/config.ts`
- **Cores e fontes** → `tailwind.config.ts` (paleta `kenesis.*`) e `app/globals.css`
