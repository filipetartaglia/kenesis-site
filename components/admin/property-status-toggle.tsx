"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { togglePropertyStatus } from "@/server/properties/actions";

const STATUS_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
  reservado: "Reservado",
  vendido: "Vendido",
  arquivado: "Arquivado",
};

export function PropertyStatusToggle({ id, status }: { id: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isPublished = status === "publicado";
  const canToggle = status === "publicado" || status === "rascunho" || status === "arquivado";

  if (!canToggle) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
        {STATUS_LABELS[status] || status}
      </span>
    );
  }

  async function handleToggle() {
    setLoading(true);
    const newStatus = isPublished ? "arquivado" : "publicado";
    const result = await togglePropertyStatus(id, newStatus);
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
      title={isPublished ? "Clique para arquivar" : "Clique para publicar"}
    >
      {loading ? "..." : STATUS_LABELS[status] || status}
    </button>
  );
}
