'use client'; // Must be a client component now to handle menu state

import React, { useState } from "react";
import { FellowSidebar } from "@/components/dashboard/FellowSidebar";
import { Menu } from "lucide-react"; // Added Menu icon

export default function FellowLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  return (
    <div className="flex h-screen overflow-hidden bg-[#000000] text-zinc-100 selection:bg-amber-500/30 font-sans">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* THE PERSISTENT LEFT SIDEBAR (Wrapped for Mobile) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <FellowSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* MAIN EXECUTION STAGE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden flex items-center p-4 border-b border-zinc-900 bg-zinc-950 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-amber-500 hover:text-white p-1 mr-3 rounded"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black uppercase tracking-tighter text-lg">
            ESERIA <span className="text-amber-500">OS</span>
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}