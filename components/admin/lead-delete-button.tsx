"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteLead } from "@/server/leads/actions";
import { useRouter } from "next/navigation";

export function LeadDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.")) {
      startTransition(async () => {
        const { error } = await deleteLead(id);
        if (error) {
          alert(error);
        } else {
          router.refresh();
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
      title="Excluir lead"
    >
      <Trash2 size={16} />
    </button>
  );
}
