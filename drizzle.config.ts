import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// O Next carrega .env.local sozinho; o drizzle-kit não.
// ENV_FILE permite apontar para outro ambiente sem tocar no .env.local —
// é o que evita rodar migration em produção achando que é local, e vice-versa.
config({ path: process.env.ENV_FILE || ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    // DDL exige sessão: em produção (Supabase) o pooler em modo Transaction não
    // roda migration, daí DIRECT_URL. Local, as duas apontam para o mesmo lugar.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});
