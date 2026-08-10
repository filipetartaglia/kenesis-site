"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Select que atualiza a URL ao mudar de valor (auto-submit por query params).
 * Preserva os demais params existentes.
 */
export function FilterSelect({
  name,
  defaultValue,
  options,
  className,
}: {
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const val = e.target.value;
      if (val) {
        params.set(name, val);
      } else {
        params.delete(name);
      }
      router.push(`?${params.toString()}`);
    },
    [name, router, searchParams]
  );

  return (
    <select
      value={defaultValue}
      onChange={handleChange}
      className={className}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
