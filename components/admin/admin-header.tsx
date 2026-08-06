"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();
  
  // Create a simple breadcrumb from pathname
  const paths = pathname.split('/').filter(p => p !== '' && p !== 'admin');
  const currentPage = paths.length > 0 ? paths[paths.length - 1] : 'dashboard';
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="hidden text-sm text-gray-500 sm:block">
          Admin / <span className="font-medium text-gray-900 capitalize">{currentPage.replace(/-/g, ' ')}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar no painel..." 
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm outline-none focus:border-kenesis-green focus:bg-white"
          />
        </div>

        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-kenesis-lime ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-kenesis-green text-sm font-medium text-white">
            FT
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-medium text-gray-900">Filipe Tartaglia</span>
            <span className="text-[11px] text-gray-500">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
}
