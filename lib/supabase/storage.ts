// URL pública de um arquivo no Storage.
// Paths que já são absolutos (/team/foo.png, servido de /public) ou URLs completas
// passam direto — sem isso o prefixo do bucket é concatenado por cima e a imagem quebra.
export function storageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
