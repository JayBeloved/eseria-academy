'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

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
    <div className="flex bg-[#000000] min-h-screen text-zinc-100 selection:bg-rose-500/30 font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}