"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, Users, Send, BookOpen, 
  HardDrive, Inbox, Activity, MessageSquare,
  FilePenLine, Landmark, X
} from "lucide-react";

const navItems = [
  { name: 'Global Overview', icon: Activity, path: '/dashboard/admin' },
  { name: 'Cohort Roster', icon: Users, path: '/dashboard/admin/roster' },
  { name: 'Mandate Broadcaster', icon: Send, path: '/dashboard/admin/broadcaster' },
  { name: 'Syllabus Engine', icon: BookOpen, path: '/dashboard/admin/syllabus' },
  { name: 'Arsenal Upload', icon: HardDrive, path: '/dashboard/admin/arsenal' },
  { name: 'Artifact Review', icon: Inbox, path: '/dashboard/admin/submissions' },
  { name: 'Comms Relay', icon: MessageSquare, path: '/dashboard/admin/comms' },
  { name: 'Strategic Memos', icon: FilePenLine, path: '/dashboard/admin/memos' },
  { name: 'Treasury', icon: Landmark, path: '/dashboard/admin/financials' }
];

// ADD the onClose prop here
export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#000000] border-r border-rose-900/50 flex flex-col z-50 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-rose-900/30">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
          <div className="flex flex-col">
            <span className="font-black text-white tracking-tighter uppercase text-lg leading-none">
              DEAN <span className="text-rose-500">CONTROL</span>
            </span>
            <span className="text-[8px] font-bold text-rose-500/70 uppercase tracking-widest mt-1">
              Absolute Authority
            </span>
          </div>
        </div>
        
        {/* MOBILE CLOSE BUTTON */}
        {onClose && (
          <button onClick={onClose} className="md:hidden text-rose-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} onClick={onClose}>
              <div className={`
                flex items-center gap-4 p-3 rounded-md transition-all group
                ${isActive ? "bg-rose-950/50 border border-rose-900/50 text-rose-500" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"}
              `}>
                <item.icon className={`w-4 h-4 ${isActive ? "text-rose-500" : "group-hover:text-rose-500 transition-colors"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-rose-900/30 bg-rose-950/10 mt-auto">
        <div className="flex items-center gap-2 text-rose-500">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest">God-Mode Active</span>
        </div>
      </div>
    </aside>
  );
}