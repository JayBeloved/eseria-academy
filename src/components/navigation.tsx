"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Menu, X, LogIn } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-300 ${
        isScrolled ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 relative z-[60]">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-xl tracking-tighter text-white uppercase">
              ESERIA <span className="text-amber-500">ACADEMY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            <Link href="/blueprint" className="hover:text-amber-500 transition-colors">Blueprint</Link>
            <Link href="/#programs" className="hover:text-amber-500 transition-colors">Jurisdictions</Link>
            <Link href="/#navigator" className="hover:text-amber-500 transition-colors">AI Oracle</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Access Citadel</Link>
            <Link href="/login" className="px-6 py-2.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-2">
              Initiate <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Hamburger Menu (Only shows when menu is CLOSED) */}
          {!isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-amber-500 bg-slate-900 border border-slate-800 rounded-sm"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col p-8 pt-6 md:hidden"
          >
            {/* CLOSE BUTTON (Inside the drawer, Top Right) */}
            <div className="flex justify-end mb-12">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-amber-500 text-slate-950 rounded-sm shadow-2xl"
              >
                <X className="w-8 h-8 stroke-[3]" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {['Blueprint', 'Jurisdictions', 'AI Oracle', 'Inquiry'].map((item) => (
                <Link 
                  key={item}
                  href={item === 'Blueprint' ? '/blueprint' : `/#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter text-white active:text-amber-500"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-4 pb-10">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 bg-amber-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2">
                Initiate Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 bg-slate-900 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2 border border-slate-800">
                <LogIn className="w-4 h-4" /> Access Citadel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}