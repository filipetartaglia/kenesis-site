"use client";

import { Upload, X, Star, CheckCircle2, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type ImageItem = {
  path: string;  // caminho no storage (salvo no banco)
  url: string;   // URL completa para exibir
  isCover: boolean;
};

type UploadingItem = {
  name: string;
  progress: "uploading" | "done" | "error";
};

type Props = {
  slug?: string;
  initialImages?: { path: string; isCover: boolean; sortOrder: number }[];
  supabaseUrl?: string;
};

function buildPublicUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/properties/${path}`;
}

function isLocalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/**
 * Aplica a marca d'água da Kenesis à imagem via Canvas antes de enviar.
 * Retorna um novo Blob com a logo centralizada e opaca.
 */
async function applyWatermark(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }

      // Desenha a imagem original
      ctx.drawImage(img, 0, 0);

      // Marca d'água: texto "KENESIS" centralizado
      const fontSize = Math.max(32, Math.round(canvas.width * 0.045));
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Sombra leve para legibilidade em fundos claros e escuros
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 8;

      // Texto com opacidade ~35% (visível mas não intrusivo)
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("KENESIS IMOBILIÁRIA", canvas.width / 2, canvas.height / 2);

      // Segunda passagem levemente deslocada (efeito de profundidade)
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#a1ba1f";
      ctx.fillText("KENESIS IMOBILIÁRIA", canvas.width / 2 + 2, canvas.height / 2 + 2);

      ctx.globalAlpha = 1;
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        resolve(blob ?? file);
      }, file.type || "image/jpeg", 0.92);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export function PropertyGallery({ slug, initialImages, supabaseUrl }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageItem[]>(() => {
    if (!initialImages || initialImages.length === 0) return [];
    return initialImages.map((img) => ({
      path: img.path,
      url: isLocalPath(img.path) ? img.path : buildPublicUrl(supabaseUrl || "", img.path),
      isCover: img.isCover,
    }));
  });
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadingItem[]>([]);

  const handleUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    const folder = slug || "temp";

    // Inicializa a fila de progresso
    const queue: UploadingItem[] = Array.from(files).map((f) => ({
      name: f.name,
      progress: "uploading",
    }));
    setUploadQueue(queue);

    // Envia todas as imagens em paralelo
    await Promise.all(
      Array.from(files).map(async (file, i) => {
        try {
          // Aplica marca d'água antes de enviar
          const watermarked = await applyWatermark(file);

          const form = new FormData();
          form.append("file", watermarked, file.name);
          form.append("folder", folder);

          const res = await fetch("/api/upload", { method: "POST", body: form });
          const data = await res.json();

          if (!res.ok) {
            setUploadQueue((prev) => {
              const next = [...prev];
              next[i] = { ...next[i], progress: "error" };
              return next;
            });
            return;
          }

          setImages((prev) => [
            ...prev,
            {
              path: data.path,
              url: data.url,
              isCover: prev.length === 0 && i === 0,
            },
          ]);
          setUploadQueue((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], progress: "done" };
            return next;
          });
        } catch {
          setUploadQueue((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], progress: "error" };
            return next;
          });
        }
      })
    );

    setUploading(false);
    // Limpa a fila após 2s
    setTimeout(() => setUploadQueue([]), 2000);
  }, [slug]);

  const handleRemove = useCallback(async (index: number) => {
    const img = images[index];

    // Se a imagem é do Supabase (não local), deleta do storage
    if (!isLocalPath(img.path)) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: img.path }),
        });
      } catch (e) {
        console.error("Falha ao deletar do storage:", e);
      }
    }

    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (img.isCover && next.length > 0) {
        next[0] = { ...next[0], isCover: true };
      }
      return next;
    });
  }, [images]);

  const handleSetCover = useCallback((index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isCover: i === index }))
    );
  }, []);

  const coverImage = images.find((img) => img.isCover);

  const doneCount = uploadQueue.filter((q) => q.progress === "done").length;
  const errorCount = uploadQueue.filter((q) => q.progress === "error").length;

  return (
    <div className="space-y-4">
      {/* Hidden inputs para o form */}
      <input type="hidden" name="imagePaths" value={images.map((i) => i.path).join(",")} />
      <input type="hidden" name="coverPath" value={coverImage?.path || ""} />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Galeria de Imagens</h3>
        <span className="text-xs text-gray-500">{images.length} imagens</span>
      </div>

      {/* Barra de progresso do upload em lote */}
      {uploadQueue.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-600">
            <span className="font-medium">
              {uploading
                ? `Enviando ${uploadQueue.length} imagem${uploadQueue.length > 1 ? "s" : ""}...`
                : `${doneCount} enviada${doneCount !== 1 ? "s" : ""}${errorCount > 0 ? `, ${errorCount} com erro` : ""}`}
            </span>
            <span className="text-gray-400">{doneCount}/{uploadQueue.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-kenesis-lime transition-all duration-300"
              style={{ width: `${(doneCount / uploadQueue.length) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {uploadQueue.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11px] shadow-sm"
              >
                {item.progress === "uploading" && (
                  <Loader2 size={12} className="animate-spin text-kenesis-green" />
                )}
                {item.progress === "done" && (
                  <CheckCircle2 size={12} className="text-kenesis-lime" />
                )}
                {item.progress === "error" && (
                  <X size={12} className="text-red-400" />
                )}
                <span className="max-w-[100px] truncate text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="group flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-kenesis-green hover:bg-kenesis-cream disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-kenesis-green" />
          ) : (
            <Upload className="h-6 w-6 text-gray-400 group-hover:text-kenesis-green" />
          )}
          <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-kenesis-green">
            {uploading ? "Enviando..." : "Selecionar fotos"}
          </span>
          <span className="mt-0.5 text-[10px] text-gray-400">
            Várias de uma vez
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/webp,image/jpeg,image/png,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUpload(e.target.files);
              e.target.value = ""; // Limpa para permitir re-upload do mesmo arquivo
            }
          }}
        />

        {/* Existing Images */}
        {images.map((img, i) => (
          <div key={img.path} className="group relative h-32 overflow-hidden rounded-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Botões de ação */}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
              {!img.isCover && (
                <button
                  type="button"
                  onClick={() => handleSetCover(i)}
                  className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md transition-all hover:bg-yellow-500"
                  title="Definir como capa"
                >
                  <Star size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md transition-all hover:bg-red-500"
                title="Remover imagem"
              >
                <X size={14} />
              </button>
            </div>

            {img.isCover && (
              <span className="absolute bottom-2 left-2 rounded-md bg-kenesis-lime px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                Capa
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Selecione todas as fotos de uma vez — elas serão enviadas em paralelo e receberão a
        marca d&apos;água da Kenesis automaticamente. Use a ⭐ para definir a capa. Formatos: WEBP, JPG, PNG ou AVIF (máx. 10MB cada).
      </p>
    </div>
  );
}
