import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL não definida — copie .env.example para .env.local");
}

// prepare:false é obrigatório atrás de um pooler em modo Transaction (Supabase).
// Local, com conexão direta, é indiferente — deixar sempre desligado evita a
// falha intermitente que só apareceria em produção.
const connect = () => postgres(url, { prepare: false });

// Em dev o hot reload reavalia este módulo a cada save e abriria uma conexão nova
// por vez, até estourar o limite do Postgres. Em produção o módulo é avaliado uma vez.
const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof connect> };
const client = globalForDb.pg ?? connect();
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });
