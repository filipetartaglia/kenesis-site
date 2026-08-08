"use client";

import { FilterBadge } from "@/components/ui/filter-badge";
import { useRouter } from "next/navigation";

interface PropertyFiltersProps {
  tipos: string[];
  active: string;
}

export function PropertyFilters({ tipos, active }: PropertyFiltersProps) {
  const router = useRouter();

  const onChange = (tipo: string) => {
    if (tipo === "Todos") {
      router.push("/imoveis");
    } else {
      router.push(`/imoveis?tipo=${encodeURIComponent(tipo)}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tipos.map((t) => (
          <FilterBadge key={t} value={t} label="Tipo" active={active === t} onClick={() => onChange(t)} />
        ))}
      </div>

      {active !== "Todos" && (
        <div className="flex flex-wrap gap-2">
          <FilterBadge label="Tipo" value={active} onRemove={() => onChange("Todos")} />
        </div>
      )}
    </div>
  );
}
