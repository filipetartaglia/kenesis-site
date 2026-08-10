"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "@/server/users/actions";

type Props = {
  id: string;
  userName: string;
};

export function UserDeleteButton({ id, userName }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`TEM CERTEZA que deseja EXCLUIR o usuário "${userName}"?\n\nEsta ação não poderá ser desfeita e irá falhar se ele tiver imóveis cadastrados.`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteUser(id);
    setIsDeleting(false);

    if (result?.error) {
      alert(result.error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
      title="Excluir Usuário"
    >
      <Trash2 size={16} />
    </button>
  );
}
