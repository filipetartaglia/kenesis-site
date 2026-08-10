"use client";

import { X, Plus } from "lucide-react";
import { useState, useRef, useCallback } from "react";

type Props = {
  initialFeatures?: string[] | null;
};

export function FeaturesInput({ initialFeatures }: Props) {
  const [features, setFeatures] = useState<string[]>(initialFeatures || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFeature = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed || features.includes(trimmed)) return;
    setFeatures((prev) => [...prev, trimmed]);
  }, [features]);

  const removeFeature = useCallback((index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = inputRef.current;
      if (input) {
        addFeature(input.value);
        input.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="features" value={JSON.stringify(features)} />

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ex: Piscina, Churrasqueira, Vista mar..."
          className="flex-1 rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={() => {
            const input = inputRef.current;
            if (input) {
              addFeature(input.value);
              input.value = "";
              input.focus();
            }
          }}
          className="flex items-center gap-1.5 rounded-md bg-kenesis-cream px-3 py-2 text-sm font-medium text-kenesis-green transition-colors hover:bg-kenesis-green hover:text-white"
        >
          <Plus size={14} />
          Adicionar
        </button>
      </div>

      {features.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {features.map((feature, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-kenesis-cream px-3 py-1 text-sm font-medium text-kenesis-greenDark"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="rounded-full p-0.5 text-kenesis-green/60 hover:bg-kenesis-green/10 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Digite e pressione Enter ou clique em Adicionar. Ex: Piscina, Churrasqueira, Sauna, Vista mar.
      </p>
    </div>
  );
}
