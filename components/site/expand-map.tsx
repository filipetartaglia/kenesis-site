"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

export function ExpandMap({ label = "Niterói, Rio de Janeiro" }: { label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-kenesis-green/15">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-kenesis-cream px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-kenesis-greenDark">
          <MapPin size={16} className="text-kenesis-green" />
          {label}
        </span>
        <ChevronDown
          size={18}
          className="text-kenesis-green transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        style={{ maxHeight: open ? 320 : 0 }}
        className="transition-[max-height] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
      >
        <iframe
          title="mapa"
          src={`https://www.google.com/maps?q=${encodeURIComponent(label)}&output=embed`}
          className="h-[320px] w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
