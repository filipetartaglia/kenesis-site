CREATE TYPE "public"."lead_status" AS ENUM('novo', 'em_atendimento', 'convertido', 'perdido');--> statement-breakpoint
CREATE TYPE "public"."listing_purpose" AS ENUM('venda', 'locacao');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('rascunho', 'publicado', 'reservado', 'vendido', 'arquivado');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('casa', 'apartamento', 'terreno', 'empreendimento', 'cobertura', 'comercial');--> statement-breakpoint
CREATE TYPE "public"."segment" AS ENUM('medio_padrao', 'alto_padrao');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'corretor');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"message" text,
	"property_id" uuid,
	"status" "lead_status" DEFAULT 'novo' NOT NULL,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"referrer" text,
	"landing_page" text,
	"ip_hash" text,
	"handled_by" uuid,
	"handled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_contato_check" CHECK ("leads"."phone" is not null or "leads"."email" is not null)
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"property_type" "property_type" NOT NULL,
	"segment" "segment",
	"purpose" "listing_purpose" DEFAULT 'venda' NOT NULL,
	"status" "property_status" DEFAULT 'rascunho' NOT NULL,
	"description" text,
	"price_cents" bigint,
	"price_visible" boolean DEFAULT false NOT NULL,
	"condo_fee_cents" bigint,
	"iptu_cents" bigint,
	"area_total_m2" numeric(10, 2),
	"area_built_m2" numeric(10, 2),
	"bedrooms" smallint,
	"suites" smallint,
	"bathrooms" smallint,
	"parking_spaces" smallint,
	"neighborhood" text,
	"city" text DEFAULT 'Niterói' NOT NULL,
	"state" char(2) DEFAULT 'RJ' NOT NULL,
	"zip" text,
	"address_street" text,
	"address_number" text,
	"address_complement" text,
	"address_visible" boolean DEFAULT false NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"features" text[],
	"developer" text,
	"delivery_estimate" date,
	"is_featured" boolean DEFAULT false NOT NULL,
	"featured_order" smallint,
	"meta_title" text,
	"meta_description" text,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('portuguese',
        coalesce("properties"."title", '') || ' ' ||
        coalesce("properties"."description", '') || ' ' ||
        coalesce("properties"."neighborhood", '') || ' ' ||
        coalesce("properties"."city", ''))) STORED,
	"created_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"path" text NOT NULL,
	"alt" text,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"is_cover" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_slug_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_slug_history_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote" text NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text,
	"photo_path" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"job_title" text,
	"creci" text,
	"whatsapp" text,
	"bio" text,
	"photo_path" text,
	"location" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"must_change_password" boolean DEFAULT false NOT NULL,
	"failed_login_attempts" smallint DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_handled_by_users_id_fk" FOREIGN KEY ("handled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_slug_history" ADD CONSTRAINT "property_slug_history_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leads_status_created_idx" ON "leads" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "leads_ip_created_idx" ON "leads" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "properties_status_published_idx" ON "properties" USING btree ("status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "properties_neighborhood_idx" ON "properties" USING btree ("neighborhood");--> statement-breakpoint
CREATE INDEX "properties_type_idx" ON "properties" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "properties_search_idx" ON "properties" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "properties_features_idx" ON "properties" USING gin ("features");--> statement-breakpoint
CREATE INDEX "property_images_property_order_idx" ON "property_images" USING btree ("property_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "property_images_one_cover_idx" ON "property_images" USING btree ("property_id") WHERE "property_images"."is_cover";