'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Receipt,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/claims', icon: FileText, label: 'Claims' },
  { href: '/denials', icon: AlertTriangle, label: 'Denials' },
  { href: '/era', icon: Receipt, label: 'ERA 835' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[220px] flex flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <div>
          <div className="font-bold text-sm leading-tight">RCM Billing</div>
          <div className="text-slate-400 text-[10px] font-medium leading-tight">AgentPay Labs</div>
        </div>
      </div>

      {/* Practice selector */}
      <button className="mx-3 mt-4 flex items-center justify-between rounded-lg px-3 py-2.5 bg-slate-800 hover:bg-slate-700 transition-colors group">
        <div className="text-left">
          <div className="text-xs font-semibold text-white">Okafor Medical Group</div>
          <div className="text-[10px] text-slate-400">NPI: 1234567890</div>
        </div>
        <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300" />
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-5 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = path === item.href || path.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}>
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user */}
      <div className="border-t border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">JO</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Dr. Okafor</div>
            <div className="text-[10px] text-slate-400 truncate">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
