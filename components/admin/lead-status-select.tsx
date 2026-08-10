"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/server/leads/actions";

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "em_atendimento", label: "Em Atendimento" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    const newStatus = e.target.value as any;
    const result = await updateLeadStatus(id, newStatus);
    if (result.error) {
      alert(result.error);
    }
    router.refresh();
    setLoading(false);
  }

  const getColors = () => {
    switch (status) {
      case "novo":
        return "bg-green-100 text-green-700";
      case "em_atendimento":
        return "bg-blue-100 text-blue-700";
      case "convertido":
        return "bg-gray-100 text-gray-700"; // Assuming a completed state
      case "perdido":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium outline-none appearance-none cursor-pointer ${getColors()} disabled:opacity-50`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-white text-gray-900">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
