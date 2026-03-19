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

  // Close menu on link click
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/10 py-4" 
          : "bg-transparent py-6"
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-2 relative z-[60]">
            <ShieldCheck className="w-6 h-6 text-amber-500 transition-transform group-hover:rotate-12" />
            <span className="font-bold text-xl tracking-tighter text-white uppercase">
              ESERIA <span className="text-amber-500">ACADEMY</span>
            </span>
          </Link>

          {/* DESKTOP LINKS (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            <Link href="/blueprint" className="hover:text-amber-500 transition-colors">Blueprint</Link>
            <Link href="/#programs" className="hover:text-amber-500 transition-colors">Jurisdictions</Link>
            <Link href="/#navigator" className="hover:text-amber-500 transition-colors">AI Navigator</Link>
          </div>

          {/* DESKTOP CTA (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
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

          {/* MOBILE TOGGLE (Hidden on Desktop) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-[60] p-2 text-slate-400 hover:text-amber-500 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[55] bg-slate-950 flex flex-col pt-32 px-8 md:hidden"
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-8 mb-12">
              {[
                { name: "The Blueprint", href: "/blueprint" },
                { name: "Jurisdictions", href: "/#programs" },
                { name: "AI Navigator", href: "/#navigator" },
                { name: "Inquiry", href: "/#inquiry" }
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-2xl font-bold uppercase tracking-tighter text-white hover:text-amber-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-auto pb-12 space-y-4">
              <Link 
                href="/login"
                onClick={closeMenu}
                className="w-full py-4 bg-amber-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20"
              >
                Initiate Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/login"
                onClick={closeMenu}
                className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Access Citadel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}