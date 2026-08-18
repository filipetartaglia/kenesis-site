"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface FilterState {
  tipo: string;
  quartos: string;
  banheiros: string;
  precoMin: string;
  precoMax: string;
}

interface PropertyFiltersProps {
  tipos: string[];
  active: string;
}

const QUARTOS_OPTIONS = ["1", "2", "3", "4", "5+"];
const BANHEIROS_OPTIONS = ["1", "2", "3", "4+"];
const PRECO_OPTIONS = [
  { label: "Até R$ 500 mil", min: "", max: "50000000" },
  { label: "R$ 500 mil – R$ 1 mi", min: "50000000", max: "100000000" },
  { label: "R$ 1 mi – R$ 2 mi", min: "100000000", max: "200000000" },
  { label: "R$ 2 mi – R$ 5 mi", min: "200000000", max: "500000000" },
  { label: "Acima de R$ 5 mi", min: "500000000", max: "" },
];

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "border-kenesis-green bg-kenesis-green text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-700 hover:border-kenesis-green hover:text-kenesis-green"
      }`}
    >
      {label}
    </button>
  );
}

export function PropertyFilters({ tipos, active }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getParam = (key: string) => searchParams.get(key) || "";

  const currentFilters: FilterState = useMemo(() => ({
    tipo: active,
    quartos: getParam("quartos"),
    banheiros: getParam("banheiros"),
    precoMin: getParam("precoMin"),
    precoMax: getParam("precoMax"),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [active, searchParams]);

  const buildUrl = useCallback(
    (updates: Partial<FilterState>) => {
      const next = { ...currentFilters, ...updates };
      const params = new URLSearchParams();
      if (next.tipo && next.tipo !== "Todos") params.set("tipo", next.tipo);
      if (next.quartos) params.set("quartos", next.quartos);
      if (next.banheiros) params.set("banheiros", next.banheiros);
      if (next.precoMin) params.set("precoMin", next.precoMin);
      if (next.precoMax) params.set("precoMax", next.precoMax);
      const qs = params.toString();
      return `/imoveis${qs ? `?${qs}` : ""}`;
    },
    [currentFilters]
  );

  const navigate = (updates: Partial<FilterState>) => {
    startTransition(() => {
      router.push(buildUrl(updates));
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push("/imoveis");
    });
  };

  const activeCount = [
    currentFilters.tipo !== "Todos" && currentFilters.tipo,
    currentFilters.quartos,
    currentFilters.banheiros,
    currentFilters.precoMin || currentFilters.precoMax,
  ].filter(Boolean).length;

  const currentPrecoLabel =
    PRECO_OPTIONS.find(
      (o) => o.min === currentFilters.precoMin && o.max === currentFilters.precoMax
    )?.label ?? "";

  return (
    <div className={`space-y-4 transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}>
      {/* Tipo */}
      <div className="flex flex-wrap gap-2">
        {tipos.map((t) => (
          <FilterPill
            key={t}
            label={t}
            active={active === t}
            onClick={() => navigate({ tipo: t })}
          />
        ))}
      </div>

      {/* Botão toggle filtros avançados */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-kenesis-green hover:text-kenesis-green"
        >
          <SlidersHorizontal size={15} />
          Filtros avançados
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-kenesis-green text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500"
          >
            <X size={14} />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Filtros avançados expandíveis */}
      {showAdvanced && (
        <div className="grid gap-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-5 sm:grid-cols-3">
          {/* Quartos */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Quartos
            </p>
            <div className="flex flex-wrap gap-2">
              {QUARTOS_OPTIONS.map((q) => (
                <FilterPill
                  key={q}
                  label={q}
                  active={currentFilters.quartos === q}
                  onClick={() =>
                    navigate({ quartos: currentFilters.quartos === q ? "" : q })
                  }
                />
              ))}
            </div>
          </div>

          {/* Banheiros */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Banheiros
            </p>
            <div className="flex flex-wrap gap-2">
              {BANHEIROS_OPTIONS.map((b) => (
                <FilterPill
                  key={b}
                  label={b}
                  active={currentFilters.banheiros === b}
                  onClick={() =>
                    navigate({ banheiros: currentFilters.banheiros === b ? "" : b })
                  }
                />
              ))}
            </div>
          </div>

          {/* Faixa de preço */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Faixa de preço
            </p>
            <div className="flex flex-col gap-1.5">
              {PRECO_OPTIONS.map((opt) => {
                const isActive =
                  currentFilters.precoMin === opt.min &&
                  currentFilters.precoMax === opt.max;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() =>
                      navigate({
                        precoMin: isActive ? "" : opt.min,
                        precoMax: isActive ? "" : opt.max,
                      })
                    }
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      isActive
                        ? "bg-kenesis-green text-white"
                        : "bg-white text-gray-600 hover:bg-kenesis-cream hover:text-kenesis-greenDark"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentFilters.tipo !== "Todos" && currentFilters.tipo && (
            <span className="flex items-center gap-1.5 rounded-full bg-kenesis-green/10 px-3 py-1 text-xs font-medium text-kenesis-greenDark">
              Tipo: {currentFilters.tipo}
              <button type="button" onClick={() => navigate({ tipo: "Todos" })}>
                <X size={12} />
              </button>
            </span>
          )}
          {currentFilters.quartos && (
            <span className="flex items-center gap-1.5 rounded-full bg-kenesis-green/10 px-3 py-1 text-xs font-medium text-kenesis-greenDark">
              {currentFilters.quartos} quarto{currentFilters.quartos !== "1" ? "s" : ""}
              <button type="button" onClick={() => navigate({ quartos: "" })}>
                <X size={12} />
              </button>
            </span>
          )}
          {currentFilters.banheiros && (
            <span className="flex items-center gap-1.5 rounded-full bg-kenesis-green/10 px-3 py-1 text-xs font-medium text-kenesis-greenDark">
              {currentFilters.banheiros} banheiro{currentFilters.banheiros !== "1" ? "s" : ""}
              <button type="button" onClick={() => navigate({ banheiros: "" })}>
                <X size={12} />
              </button>
            </span>
          )}
          {currentPrecoLabel && (
            <span className="flex items-center gap-1.5 rounded-full bg-kenesis-green/10 px-3 py-1 text-xs font-medium text-kenesis-greenDark">
              {currentPrecoLabel}
              <button type="button" onClick={() => navigate({ precoMin: "", precoMax: "" })}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
