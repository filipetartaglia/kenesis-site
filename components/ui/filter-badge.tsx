"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Linear-style filter badge.
 * Two modes:
 *  - selectable chip (active/inactive) when `onClick` is passed and no `onRemove`
 *  - removable applied-filter pill when `onRemove` is passed (shows label: value + x)
 */
function FilterBadge({ label, value, onRemove, active, onClick, className }: FilterBadgeProps) {
  if (onRemove) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-[12px] font-medium text-foreground",
          className
        )}
      >
        <span className="text-muted-foreground">{label}:</span>
        {value}
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label={`Remover filtro ${label}`}
        >
          <X size={12} />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted",
        className
      )}
    >
      {value}
    </button>
  );
}

export { FilterBadge };
