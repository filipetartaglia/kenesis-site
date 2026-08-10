"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleTestimonialPublished } from "@/server/testimonials/actions";

export function TestimonialStatusToggle({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    const result = await toggleTestimonialPublished(id, !isPublished);
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        isPublished
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
          : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
      }`}
      title={isPublished ? "Clique para despublicar" : "Clique para publicar"}
    >
      {loading ? "..." : isPublished ? "Publicado" : "Oculto"}
    </button>
  );
}
