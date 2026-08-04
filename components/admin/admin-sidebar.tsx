"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  UserSquare2, 
  MessageSquareQuote, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Imóveis", href: "/admin/imoveis", icon: Home },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Usuários", href: "/admin/usuarios", icon: UserSquare2 },
  { label: "Depoimentos", href: "/admin/depoimentos", icon: MessageSquareQuote },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        className="fixed bottom-4 right-4 z-50 rounded-full bg-kenesis-green p-3 text-white shadow-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-kenesis-greenDark text-white transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <span className="font-display text-xl tracking-[0.15em] text-white">KENESIS</span>
          <span className="ml-2 text-[10px] uppercase tracking-widest text-kenesis-lime">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-white/10 text-kenesis-lime" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-red-400">
            <LogOut size={18} />
            Sair do sistema
          </button>
        </div>
      </aside>
    </>
  );
}
