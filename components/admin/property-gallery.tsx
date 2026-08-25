"use client";

import { Upload, X, Star, CheckCircle2, Loader2, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type ImageItem = {
  path: string;
  url: string;
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

let cachedWatermark: HTMLImageElement | null = null;
async function getWatermark(): Promise<HTMLImageElement> {
  if (cachedWatermark) return cachedWatermark;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { cachedWatermark = img; resolve(img); };
    img.onerror = reject;
    img.src = "/logo-watermark.png?nocache=" + Math.floor(Date.now() / 60000);
  });
}

function normalizeMime(type: string): string {
  if (type === "image/jpg") return "image/jpeg";
  if (!type || type === "application/octet-stream") return "image/jpeg";
  return type;
}

async function applyWatermark(file: File): Promise<Blob> {
  const watermark = await getWatermark().catch(() => null);
  const mimeType = normalizeMime(file.type);

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); resolve(file); return; }

      ctx.drawImage(img, 0, 0);

      if (watermark) {
        try {
          ctx.globalAlpha = 0.45;
          const wmWidth = canvas.width * 0.3;
          const wmHeight = (watermark.naturalHeight / watermark.naturalWidth) * wmWidth;
          const wmX = (canvas.width - wmWidth) / 2;
          const wmY = (canvas.height - wmHeight) / 2;
          ctx.drawImage(watermark, wmX, wmY, wmWidth, wmHeight);
          ctx.globalAlpha = 1;
        } catch {
          ctx.globalAlpha = 1;
        }
      }

      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => { resolve(blob ?? file); },
        mimeType === "image/webp" ? "image/webp" : "image/jpeg",
        0.92
      );
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

  // Drag-and-drop state
  const dragIndex = useRef<number | null>(null);

  const handleUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    const folder = slug || "temp";
    const queue: UploadingItem[] = Array.from(files).map((f) => ({ name: f.name, progress: "uploading" as const }));
    setUploadQueue(queue);

    await Promise.all(
      Array.from(files).map(async (file, i) => {
        try {
          const watermarked = await applyWatermark(file);
          const form = new FormData();
          form.append("file", watermarked, file.name);
          form.append("folder", folder);

          const res = await fetch("/api/upload", { method: "POST", body: form });
          const data = await res.json();

          if (!res.ok) {
            setUploadQueue((prev) => { const next = [...prev]; next[i] = { ...next[i], progress: "error" }; return next; });
            return;
          }

          setImages((prev) => [
            ...prev,
            { path: data.path, url: data.url, isCover: prev.length === 0 && i === 0 },
          ]);
          setUploadQueue((prev) => { const next = [...prev]; next[i] = { ...next[i], progress: "done" }; return next; });
        } catch {
          setUploadQueue((prev) => { const next = [...prev]; next[i] = { ...next[i], progress: "error" }; return next; });
        }
      })
    );

    setUploading(false);
    setTimeout(() => setUploadQueue([]), 2000);
  }, [slug]);

  const handleRemove = useCallback(async (index: number) => {
    const img = images[index];
    if (!isLocalPath(img.path)) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: img.path }),
        });
      } catch (e) { console.error("Falha ao deletar do storage:", e); }
    }
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (img.isCover && next.length > 0) next[0] = { ...next[0], isCover: true };
      return next;
    });
  }, [images]);

  const handleSetCover = useCallback((index: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isCover: i === index })));
  }, []);

  // Move image left/right
  const moveImage = useCallback((from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  // Drag handlers
  const handleDragStart = (index: number) => { dragIndex.current = index; };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    moveImage(dragIndex.current, index);
    dragIndex.current = index;
  };
  const handleDragEnd = () => { dragIndex.current = null; };

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

      {/* Upload progress */}
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
            <div className="h-full rounded-full bg-kenesis-lime transition-all duration-300" style={{ width: `${(doneCount / uploadQueue.length) * 100}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {uploadQueue.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11px] shadow-sm">
                {item.progress === "uploading" && <Loader2 size={12} className="animate-spin text-kenesis-green" />}
                {item.progress === "done" && <CheckCircle2 size={12} className="text-kenesis-lime" />}
                {item.progress === "error" && <X size={12} className="text-red-400" />}
                <span className="max-w-[100px] truncate text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
            {uploading ? "Enviando..." : "Adicionar fotos"}
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
              e.target.value = "";
            }
          }}
        />

        {/* Image cards — draggable to reorder */}
        {images.map((img, i) => (
          <div
            key={img.path}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className="group relative h-32 overflow-hidden rounded-xl bg-gray-100 cursor-grab active:cursor-grabbing"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Drag handle */}
            <div className="absolute left-2 top-2 opacity-0 transition-all group-hover:opacity-100">
              <div className="rounded-full bg-white/20 p-1 text-white backdrop-blur-md">
                <GripVertical size={12} />
              </div>
            </div>

            {/* Order arrows */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-all group-hover:opacity-100">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(i, i - 1)}
                  className="rounded-full bg-white/25 p-1 text-white backdrop-blur-md transition-all hover:bg-kenesis-green"
                  title="Mover para esquerda"
                >
                  <ChevronLeft size={12} />
                </button>
              )}
              {i < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(i, i + 1)}
                  className="rounded-full bg-white/25 p-1 text-white backdrop-blur-md transition-all hover:bg-kenesis-green"
                  title="Mover para direita"
                >
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            {/* Action buttons */}
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

            {/* Cover badge */}
            {img.isCover && (
              <span className="absolute bottom-2 left-2 rounded-md bg-kenesis-lime px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                Capa
              </span>
            )}

            {/* Order badge */}
            <span className="absolute left-2 bottom-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white/80 group-hover:opacity-0 transition-opacity">
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Arraste as fotos para reordenar, ou use as setas ◀▶. ⭐ define a capa. Formatos: WEBP, JPG, PNG ou AVIF (máx. 10MB).
      </p>
    </div>
  );
}
