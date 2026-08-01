"use client";

import { FilterBadge } from "@/components/ui/filter-badge";

interface PropertyFiltersProps {
  tipos: string[];
  active: string;
  onChange: (tipo: string) => void;
}

export function PropertyFilters({ tipos, active, onChange }: PropertyFiltersProps) {
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
