"use client";

import { X, Plus } from "lucide-react";
import { useState, useRef, useCallback } from "react";

type Props = {
  initialAreas?: string[] | null;
};

export function AreasInput({ initialAreas }: Props) {
  const [areas, setAreas] = useState<string[]>(initialAreas || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const addArea = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || areas.includes(trimmed)) return;
      setAreas((prev) => [...prev, trimmed]);
    },
    [areas]
  );

  const removeArea = useCallback((index: number) => {
    setAreas((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = inputRef.current;
      if (input) {
        addArea(input.value);
        input.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="areasOptions" value={JSON.stringify(areas)} />

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ex: 45 m², 67 m², 89 m²..."
          className="flex-1 rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={() => {
            const input = inputRef.current;
            if (input) {
              addArea(input.value);
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

      {areas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {areas.map((area, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-kenesis-cream px-3 py-1 text-sm font-medium text-kenesis-greenDark"
            >
              {area}
              <button
                type="button"
                onClick={() => removeArea(i)}
                className="rounded-full p-0.5 text-kenesis-green/60 hover:bg-kenesis-green/10 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Digite cada opção de área e pressione Enter. Ex: 45 m², 67 m², 89 m². Útil para empreendimentos com múltiplas unidades.
      </p>
    </div>
  );
}
