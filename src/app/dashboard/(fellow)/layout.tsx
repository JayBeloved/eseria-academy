import React from "react";
import { FellowSidebar } from "@/components/dashboard/FellowSidebar";

export default function FellowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#000000] min-h-screen text-zinc-100 selection:bg-amber-500/30 font-sans">
      {/* The Persistent Left Sidebar */}
      <FellowSidebar />
      
      {/* The Main Execution Stage */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}