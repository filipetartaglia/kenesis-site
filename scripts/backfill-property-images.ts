// Backfill de property_images a partir do que já está no bucket `properties`.
// Os webp foram subidos direto pelo painel do Storage, sem passar pelo /api/upload,
// então nenhuma linha foi criada e o site renderiza os imóveis sem foto.
//
// Usa PostgREST + secret key: não depende da senha do Postgres.
//   npx tsx --env-file=.env.local scripts/backfill-property-images.ts [--apply]
// Sem --apply é dry-run.

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const BUCKET = "properties";
const IGNORAR = new Set(["teste"]);
const apply = process.argv.includes("--apply");

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${URL_BASE}${path}`, { ...init, headers });
  const body = await res.text();
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status} ${body}`);
  // PostgREST devolve 200 com corpo vazio em DELETE/POST sem Prefer: return=representation.
  return body ? JSON.parse(body) : null;
}

async function listar(prefix: string): Promise<string[]> {
  const rows: { name: string }[] = await api(`/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    body: JSON.stringify({ prefix, limit: 500, sortBy: { column: "name", order: "asc" } }),
  });
  // Entradas de pasta vêm sem extensão; só arquivos de imagem interessam.
  return rows.map((r) => r.name).filter((n) => /\.(webp|jpe?g|png|avif)$/i.test(n));
}

(async () => {
  const props: { id: string; slug: string }[] = await api("/rest/v1/properties?select=id,slug");
  const porSlug = new Map(props.map((p) => [p.slug, p.id]));

  const raiz: { name: string }[] = await api(`/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    body: JSON.stringify({ prefix: "", limit: 500 }),
  });

  const rows: { property_id: string; path: string; sort_order: number; is_cover: boolean }[] = [];
  const semImovel: string[] = [];

  for (const { name: pasta } of raiz) {
    if (IGNORAR.has(pasta)) continue;
    const id = porSlug.get(pasta);
    if (!id) {
      semImovel.push(pasta);
      continue;
    }
    const arquivos = await listar(`${pasta}/`);
    arquivos.forEach((arq, i) => {
      rows.push({ property_id: id, path: `${pasta}/${arq}`, sort_order: i, is_cover: i === 0 });
    });
  }

  console.log(`${rows.length} linhas em ${new Set(rows.map((r) => r.property_id)).size} imóveis.`);
  if (semImovel.length) console.log("pastas sem imóvel correspondente:", semImovel.join(", "));
  const semPasta = props.filter((p) => !rows.some((r) => r.property_id === p.id)).map((p) => p.slug);
  if (semPasta.length) console.log("imóveis sem pasta no bucket:", semPasta.join(", "));

  if (!apply) {
    console.log("dry-run. Use --apply para gravar.");
    return;
  }

  // Limpa o que existe antes de inserir: o índice único de capa (uma por imóvel)
  // rejeitaria a nova capa se a antiga continuasse lá. Também mata linhas órfãs.
  const alvos = Array.from(new Set(rows.map((r) => r.property_id)));
  // A linha órfã do althea cai junto: o althea está entre os alvos.
  await api(`/rest/v1/property_images?property_id=in.(${alvos.join(",")})`, { method: "DELETE" });

  for (let i = 0; i < rows.length; i += 50) {
    await api("/rest/v1/property_images", { method: "POST", body: JSON.stringify(rows.slice(i, i + 50)) });
  }
  console.log(`gravadas ${rows.length} linhas.`);
})();
