"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleUserActive } from "@/server/users/actions";
import { StatusBadge } from "@/components/admin/status-badge";

export function UserStatusToggle({ id, isActive, statusLabel }: { id: string; isActive: boolean, statusLabel: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    const result = await toggleUserActive(id, !isActive);
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
      className="inline-flex items-center transition-opacity disabled:opacity-50"
      title={isActive ? "Clique para inativar" : "Clique para ativar"}
    >
      <StatusBadge status={loading ? "Carregando..." : statusLabel} />
    </button>
  );
}
