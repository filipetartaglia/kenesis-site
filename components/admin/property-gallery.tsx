"use client";

import { Upload, X, Star } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type ImageItem = {
  path: string;  // caminho no storage (salvo no banco)
  url: string;   // URL completa para exibir
  isCover: boolean;
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

  const handleUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    const folder = slug || "temp";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Erro no upload");
          continue;
        }

        setImages((prev) => [
          ...prev,
          {
            path: data.path,
            url: data.url,
            isCover: prev.length === 0, // primeira imagem vira capa automaticamente
          },
        ]);
      } catch (e) {
        alert("Falha ao enviar a imagem. Tente novamente.");
      }
    }

    setUploading(false);
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
      // Se removeu a capa e ainda tem imagens, a primeira vira capa
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

  // Campos hidden para o formulário
  const coverImage = images.find((img) => img.isCover);

  return (
    <div className="space-y-4">
      {/* Hidden inputs para o form */}
      <input type="hidden" name="imagePaths" value={images.map((i) => i.path).join(",")} />
      <input type="hidden" name="coverPath" value={coverImage?.path || ""} />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Galeria de Imagens</h3>
        <span className="text-xs text-gray-500">{images.length} imagens</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="group flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-kenesis-green hover:bg-kenesis-cream disabled:opacity-50"
        >
          <Upload className="h-6 w-6 text-gray-400 group-hover:text-kenesis-green" />
          <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-kenesis-green">
            {uploading ? "Enviando..." : "Fazer upload"}
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
        Clique em &quot;Fazer upload&quot; para adicionar imagens. Use a ⭐ para definir a capa. Formatos: WEBP, JPG, PNG ou AVIF (máx. 10MB).
      </p>
    </div>
  );
}
