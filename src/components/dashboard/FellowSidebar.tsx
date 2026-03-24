"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Terminal, BookOpen, Map, HardDrive, 
        ShieldCheck, MessageSquare, FilePenLine, Landmark } from "lucide-react";

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Command Center', icon: Terminal, path: '/dashboard/command' },
  { name: 'Syllabus', icon: BookOpen, path: '/dashboard/syllabus' },
  { name: 'User Journey', icon: Map, path: '/dashboard/journey' },
  { name: 'Resource Hub', icon: HardDrive, path: '/dashboard/resources' },
  { name: 'Comms Relay', icon: MessageSquare, path: '/dashboard/comms' },
  { name: 'Strategic Memos', icon: FilePenLine, path: '/dashboard/memos' },
  { name: 'Payments', icon: Landmark, path: '/dashboard/financials' }
];

export function FellowSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#000000] border-r border-zinc-900 flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />
        <span className="font-black text-white tracking-tighter uppercase text-lg">
          ESERIA <span className="text-amber-500">OS</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`
                flex items-center gap-4 p-3 rounded-md transition-all group
                ${isActive ? "bg-zinc-900 text-amber-500" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"}
              `}>
                <item.icon className={`w-5 h-5 ${isActive ? "text-amber-500" : "group-hover:text-amber-500"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-zinc-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest">System Active</span>
        </div>
      </div>
    </aside>
  );
}