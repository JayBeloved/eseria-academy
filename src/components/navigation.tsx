"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-slate-950/80 backdrop-blur-xl border-b border-amber-500/10 py-4" 
        : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500 transition-transform group-hover:rotate-12" />
          <span className="font-bold text-xl tracking-tighter text-white uppercase">
            ESERIA <span className="text-amber-500">ACADEMY</span>
          </span>
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          <Link href="/blueprint" className="hover:text-amber-500 transition-colors">Blueprint</Link>
          <Link href="/#programs" className="hover:text-amber-500 transition-colors">Jurisdictions</Link>
          <Link href="/#navigator" className="hover:text-amber-500 transition-colors">AI Oracle</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            Access Citadel
          </Link>
          <Link 
            href="/login"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-900/20"
          >
            Initiate <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </nav>
  );
}