"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./confirm-dialog";
import { deleteProperty } from "@/server/properties/actions";

export function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProperty(id);
    if (result.error) {
      alert(result.error);
      setLoading(false);
      setOpen(false);
      return;
    }
    router.refresh();
    setOpen(false);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-400 hover:text-red-500"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>

      <ConfirmDialog
        isOpen={open}
        title="Excluir imóvel"
        description={`Tem certeza que deseja excluir "${title}"? Esta ação não pode ser desfeita.`}
        confirmText={loading ? "Excluindo..." : "Excluir"}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        variant="danger"
      />
    </>
  );
}
