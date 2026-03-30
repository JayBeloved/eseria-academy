'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { Loader2, Menu } from "lucide-react"; // Added Menu icon

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const sanitizedId = user.email.toLowerCase().replace(/[^a-z0-9]/g, '');
        const userDoc = await getDoc(doc(db, 'users', sanitizedId));
        
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAuthorized(true);
        } else {
          // Intrusion detected. Route to login or their fellow dashboard.
          router.push('/dashboard'); 
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold animate-pulse">
          Verifying Dean Credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#000000] text-zinc-100 selection:bg-rose-500/30 font-sans">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR WRAPPER */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* MAIN EXECUTION STAGE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden flex items-center p-4 border-b border-rose-900/30 bg-zinc-950 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-rose-500 hover:text-white p-1 mr-3 rounded"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black uppercase tracking-tighter text-lg">
            DEAN <span className="text-rose-500">CONTROL</span>
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