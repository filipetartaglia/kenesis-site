import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({ className, placeholder = "Buscar..." }: { className?: string; placeholder?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
      />
    </div>
  );
}
