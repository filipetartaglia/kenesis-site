"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFeatured } from "@/server/properties/actions";

export function PropertyFeaturedToggle({ id, isFeatured }: { id: string; isFeatured: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    const result = await toggleFeatured(id, !isFeatured);
    if (result.error) {
      alert(result.error);
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`transition-colors disabled:opacity-50 ${
        isFeatured
          ? "text-yellow-400 hover:text-gray-400"
          : "text-gray-300 hover:text-yellow-400"
      }`}
      title={isFeatured ? "Remover destaque" : "Destacar"}
    >
      <Star size={16} className={isFeatured ? "fill-yellow-400" : ""} />
    </button>
  );
}
