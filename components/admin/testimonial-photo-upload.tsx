"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

type Props = {
  initialPhotoPath?: string | null;
  supabaseUrl: string;
};

export function TestimonialPhotoUpload({ initialPhotoPath, supabaseUrl }: Props) {
  const [photoPath, setPhotoPath] = useState<string | null>(initialPhotoPath || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${supabaseUrl}/storage/v1/object/public/testimonials/${path}`;
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "testimonials");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao fazer upload");
      }

      setPhotoPath(data.path);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    setPhotoPath(null);
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="photoPath" value={photoPath || ""} />
      
      {photoPath ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getUrl(photoPath)} alt="Foto do autor" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100"
          >
            <X size={24} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-kenesis-green hover:bg-kenesis-cream hover:text-kenesis-green"
        >
          {isUploading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <Upload size={24} className="mb-2" />
              <span className="text-xs font-medium">Upload</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/webp, image/avif"
        className="hidden"
      />
    </div>
  );
}
