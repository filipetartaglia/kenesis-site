"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { AdminUserDetail } from "@/server/users/actions";
import { logoutAction } from "@/server/auth/actions";
import Image from "next/image";
import { storageUrl } from "@/lib/supabase/storage";

export function AdminHeader({ user }: { user?: AdminUserDetail }) {
  const pathname = usePathname();
  
  // Create a simple breadcrumb from pathname
  const paths = pathname.split('/').filter(p => p !== '' && p !== 'admin');
  const currentPage = paths.length > 0 ? paths[paths.length - 1] : 'dashboard';
  
  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

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
          <Link href="/admin/perfil" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
            {user?.photoPath ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={storageUrl("team", user.photoPath)!} alt={user.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-kenesis-green text-sm font-medium text-white group-hover:bg-kenesis-greenDark transition-colors">
                {initials}
              </div>
            )}
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-medium text-gray-900 group-hover:text-kenesis-green transition-colors">{user?.name || 'Usuário'}</span>
              <span className="text-[11px] text-gray-500">{user?.isMaster ? 'Master' : (user?.role === 'admin' ? 'Administrador' : 'Corretor')}</span>
            </div>
          </Link>
          
          <form action={logoutAction} className="ml-2">
            <button type="submit" className="text-gray-400 hover:text-red-600 transition-colors" title="Sair">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
