import { sql, type SQL } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  check,
  customType,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Modelo de dados da Kenesis. Origem: docs/superpowers/specs (§7) + as 7 correções
// decididas na revisão de 04/08/2026 — cada uma está marcada com "correção N" abaixo.

/** Postgres não tem tipo tsvector no drizzle; declarado à mão. */
const tsvector = customType<{ data: string }>({
  dataType: () => "tsvector",
});

/** Toda tabela carrega as duas (correção 7). */
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

const primaryId = () => uuid("id").primaryKey().default(sql`gen_random_uuid()`);

// ---------------------------------------------------------------- enums

export const userRole = pgEnum("user_role", ["admin", "corretor"]);

export const propertyType = pgEnum("property_type", [
  "casa",
  "apartamento",
  "terreno",
  "empreendimento",
  "cobertura",
  "comercial",
]);

export const segment = pgEnum("segment", ["medio_padrao", "alto_padrao"]);

export const propertyStatus = pgEnum("property_status", [
  "rascunho",
  "publicado",
  "reservado",
  "vendido",
  "arquivado",
]);

export const listingPurpose = pgEnum("listing_purpose", ["venda", "locacao"]);

export const leadStatus = pgEnum("lead_status", [
  "novo",
  "em_atendimento",
  "convertido",
  "perdido",
]);

// ---------------------------------------------------------------- users

/**
 * Login e equipe pública na mesma tabela: são a mesma pessoa, e tabelas
 * separadas divergem no primeiro update esquecido.
 *
 * `role` é PERMISSÃO; o cargo exibido no site é `jobTitle`. Se os dois se
 * chamassem "role", alguém renderiza "admin" no card da home.
 */
export const users = pgTable("users", {
  id: primaryId(),
  email: text("email").notNull().unique(),

  // correção 1: nulável. Sem hash, a pessoa aparece na seção Equipe e não
  // consegue entrar — em vez de carregar uma senha descartável que ninguém revoga.
  passwordHash: text("password_hash"),

  name: text("name").notNull(),
  role: userRole("role").notNull(),

  jobTitle: text("job_title"),
  creci: text("creci"),
  whatsapp: text("whatsapp"),
  bio: text("bio"),
  photoPath: text("photo_path"),
  location: text("location"),

  isPublic: boolean("is_public").notNull().default(false),
  sortOrder: smallint("sort_order").notNull().default(0),

  // Desativa em vez de excluir: properties.created_by e leads.handled_by
  // precisam continuar apontando para alguém.
  isActive: boolean("is_active").notNull().default(true),

  mustChangePassword: boolean("must_change_password").notNull().default(false),
  failedLoginAttempts: smallint("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),

  ...timestamps,
});

// ---------------------------------------------------------------- user_permissions

export const userPermissions = pgTable(
  "user_permissions",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    permission: text("permission").notNull(),
  },
  (t) => [
    uniqueIndex("user_permissions_unique_idx").on(t.userId, t.permission),
  ]
);

// ---------------------------------------------------------------- properties

export const properties = pgTable(
  "properties",
  {
    id: primaryId(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),

    propertyType: propertyType("property_type").notNull(),
    // Padrão de acabamento é dimensão separada do tipo: uma casa pode ser alto padrão.
    segment: segment("segment"),
    purpose: listingPurpose("purpose").notNull().default("venda"),
    status: propertyStatus("status").notNull().default("rascunho"),
    description: text("description"),

    // correção 6: em `venda` é o preço; em `locacao`, o aluguel mensal.
    // Formatação sempre pela função que recebe `purpose` junto — nunca solta.
    priceCents: bigint("price_cents", { mode: "number" }),
    // Texto livre opcional: "A partir de R$ 450.000", "Consulte valores", etc.
    // Quando preenchido, substitui a formatação automática do priceCents.
    priceLabel: text("price_label"),
    // O valor é sempre gravado; isto controla apenas a exibição.
    priceVisible: boolean("price_visible").notNull().default(false),
    condoFeeCents: bigint("condo_fee_cents", { mode: "number" }),
    iptuCents: bigint("iptu_cents", { mode: "number" }),

    areaTotalM2: numeric("area_total_m2", { precision: 10, scale: 2 }),
    areaBuiltM2: numeric("area_built_m2", { precision: 10, scale: 2 }),
    // Opções múltiplas de área útil para empreendimentos (ex: ["45 m²", "67 m²", "89 m²"])
    areasOptions: text("areas_options").array(),
    bedrooms: smallint("bedrooms"),
    suites: smallint("suites"),
    bathrooms: smallint("bathrooms"),
    parkingSpaces: smallint("parking_spaces"),

    neighborhood: text("neighborhood"),
    city: text("city").notNull().default("Niterói"),
    state: char("state", { length: 2 }).notNull().default("RJ"),
    zip: text("zip"),
    addressStreet: text("address_street"),
    addressNumber: text("address_number"),
    addressComplement: text("address_complement"),
    // Endereço completo é guardado, mas oculto por padrão — padrão de mercado
    // por segurança do imóvel ocupado.
    addressVisible: boolean("address_visible").notNull().default(false),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),

    features: text("features").array(),
    developer: text("developer"),
    deliveryEstimate: date("delivery_estimate"),

    isFeatured: boolean("is_featured").notNull().default(false),
    featuredOrder: smallint("featured_order"),

    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),

    // correção 4: a configuração 'portuguese' precisa ser literal — a forma de um
    // argumento não é IMMUTABLE e o CREATE TABLE falha. E sem coalesce, um único
    // campo nulo zera o vetor inteiro em silêncio: o imóvel some da busca.
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL => sql`to_tsvector('portuguese',
        coalesce(${properties.title}, '') || ' ' ||
        coalesce(${properties.description}, '') || ' ' ||
        coalesce(${properties.neighborhood}, '') || ' ' ||
        coalesce(${properties.city}, ''))`
    ),

    // Sem onDelete de propósito: usuário se desativa (is_active), não se exclui.
    // O NO ACTION padrão é a rede — barra a exclusão física acidental de quem
    // tem autoria registrada.
    createdBy: uuid("created_by").references(() => users.id),
    publishedAt: timestamp("published_at", { withTimezone: true }),

    ...timestamps,
  },
  (t) => [
    // A query mais quente do site: listagem pública, mais recentes primeiro.
    index("properties_status_published_idx").on(t.status, t.publishedAt.desc()),
    // Alimentam /imoveis/bairro/* e /imoveis/tipo/*.
    index("properties_neighborhood_idx").on(t.neighborhood),
    index("properties_type_idx").on(t.propertyType),
    index("properties_search_idx").using("gin", t.searchVector),
    index("properties_features_idx").using("gin", t.features),
  ]
);

// ---------------------------------------------------------------- property_images

export const propertyImages = pgTable(
  "property_images",
  {
    id: primaryId(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),

    // Caminho no storage, nunca URL: trocar de provedor vira troca de env var,
    // não UPDATE em massa.
    path: text("path").notNull(),
    alt: text("alt"),
    sortOrder: smallint("sort_order").notNull().default(0),
    isCover: boolean("is_cover").notNull().default(false),

    ...timestamps,
  },
  (t) => [
    index("property_images_property_order_idx").on(t.propertyId, t.sortOrder),
    // correção 2: sem isto, um imóvel pode terminar com zero capas (og:image vazio)
    // ou com cinco — e a capa passa a ser a que o banco devolver primeiro.
    uniqueIndex("property_images_one_cover_idx")
      .on(t.propertyId)
      .where(sql`${t.isCover}`),
  ]
);

// ---------------------------------------------------------------- property_slug_history

/**
 * Slug alterado → a URL antiga responde 301. Sem isto, todo link já enviado por
 * WhatsApp vira 404 e o ranking acumulado zera.
 *
 * correção 3: a unicidade aqui é separada da de `properties.slug`. Quem gera o
 * slug precisa consultar as DUAS tabelas — senão um imóvel novo pode receber um
 * slug que já é passado de outro, e a mesma URL passa a ter dois donos.
 */
export const propertySlugHistory = pgTable("property_slug_history", {
  id: primaryId(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  createdAt: timestamps.createdAt,
});

// ---------------------------------------------------------------- testimonials

/** Única tabela sem chave estrangeira: o depoimento não aponta para imóvel nem corretor. */
export const testimonials = pgTable("testimonials", {
  id: primaryId(),
  quote: text("quote").notNull(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  photoPath: text("photo_path"),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: smallint("sort_order").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------- leads

export const leads = pgTable(
  "leads",
  {
    id: primaryId(),
    name: text("name").notNull(),

    // correção 5: nenhum dos dois é obrigatório sozinho — quem chega pelo celular
    // quer deixar o WhatsApp e sair. Qual campo o formulário exige é decisão da
    // Kenesis e muda sem migration; o banco só recusa o lead sem contato nenhum.
    phone: text("phone"),
    email: text("email"),

    message: text("message"),

    // set null, não cascade: excluir um imóvel não pode apagar quem demonstrou
    // interesse nele. O lead vira contato geral — que é o que property_id nulo
    // já significa. Sem esta cláusula o padrão é NO ACTION, e aí nenhum imóvel
    // com lead pode ser excluído: o painel quebraria justamente nos que deram certo.
    propertyId: uuid("property_id").references(() => properties.id, {
      onDelete: "set null",
    }),
    status: leadStatus("status").notNull().default("novo"),

    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    referrer: text("referrer"),
    landingPage: text("landing_page"),

    // SHA-256 com salt (LGPD). Existe para o throttle anti-spam, não para identificar.
    ipHash: text("ip_hash"),

    handledBy: uuid("handled_by").references(() => users.id),
    handledAt: timestamp("handled_at", { withTimezone: true }),

    ...timestamps,
  },
  (t) => [
    check(
      "leads_contato_check",
      sql`${t.phone} is not null or ${t.email} is not null`
    ),
    index("leads_status_created_idx").on(t.status, t.createdAt.desc()),
    // É o que torna o throttle uma query barata em vez de varredura.
    index("leads_ip_created_idx").on(t.ipHash, t.createdAt),
  ]
);
