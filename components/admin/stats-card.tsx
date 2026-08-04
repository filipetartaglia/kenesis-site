import { cn } from "@/lib/utils";
import { AdminCard } from "./admin-card";

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: { value: string; positive: boolean } 
}) {
  return (
    <AdminCard className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-md bg-kenesis-cream p-2 text-kenesis-green">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={cn("text-xs font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
            {trend.positive ? "+" : "-"}{trend.value}
          </span>
        )}
      </div>
    </AdminCard>
  );
}
