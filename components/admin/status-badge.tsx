import { cn } from "@/lib/utils";

type BadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: BadgeProps) {
  const getColors = () => {
    switch (status.toLowerCase()) {
      case "ativo":
      case "publicado":
      case "novo":
        return "bg-green-100 text-green-700";
      case "rascunho":
        return "bg-yellow-100 text-yellow-700";
      case "reservado":
        return "bg-blue-100 text-blue-700";
      case "inativo":
      case "arquivado":
        return "bg-red-100 text-red-700";
      case "vendido":
      case "finalizado":
        return "bg-gray-100 text-gray-700";
      case "em atendimento":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getColors(), className)}>
      {status}
    </span>
  );
}
