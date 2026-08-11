import assert from "node:assert";
import { storageUrl } from "./storage";

// ponytail: self-check mínimo — roda com `npx tsx lib/supabase/storage.test.ts`
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
const base = "https://x.supabase.co/storage/v1/object/public";

assert.equal(storageUrl("properties", "althea/01.webp"), `${base}/properties/althea/01.webp`);
assert.equal(storageUrl("team", "/team/filipe.png"), "/team/filipe.png");     // path local, não prefixa
assert.equal(storageUrl("team", "https://cdn/x.png"), "https://cdn/x.png");   // URL completa
assert.equal(storageUrl("properties", null), null);

delete process.env.NEXT_PUBLIC_SUPABASE_URL;
assert.equal(storageUrl("properties", "a/1.webp"), "a/1.webp");               // sem env, devolve cru

console.log("ok");
