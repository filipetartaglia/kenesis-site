"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTestimonial } from "@/server/testimonials/actions";

export function DeleteTestimonialButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir o depoimento de ${name}?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteTestimonial(id);
    
    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-500 disabled:opacity-50"
      title="Excluir"
    >
      <Trash2 size={16} />
    </button>
  );
}
