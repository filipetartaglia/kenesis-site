"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";

export function PropertyGallery() {
  const [images, setImages] = useState([
    "/imoveis/mansao-jardim-uba/01.webp",
    "/imoveis/mansao-jardim-uba/02.webp",
    "/imoveis/mansao-jardim-uba/03.webp",
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Galeria de Imagens</h3>
        <span className="text-xs text-gray-500">{images.length} imagens</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Upload Button */}
        <button type="button" className="group flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-kenesis-green hover:bg-kenesis-cream">
          <Upload className="h-6 w-6 text-gray-400 group-hover:text-kenesis-green" />
          <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-kenesis-green">Fazer upload</span>
        </button>

        {/* Existing Images */}
        {images.map((img, i) => (
          <div key={i} className="group relative h-32 overflow-hidden rounded-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <button type="button" className="absolute right-2 top-2 rounded-full bg-white/20 p-1.5 text-white opacity-0 backdrop-blur-md transition-all hover:bg-red-500 group-hover:opacity-100">
              <X size={14} />
            </button>

            {i === 0 && (
              <span className="absolute bottom-2 left-2 rounded-md bg-kenesis-lime px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                Capa
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Arraste e solte imagens ou clique em &quot;Fazer upload&quot;. Recomendado imagens em formato WEBP na proporção 16:9.
      </p>
    </div>
  );
}
