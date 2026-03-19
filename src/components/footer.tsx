"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* BRAND BLOCK */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <span className="text-2xl font-bold tracking-tighter text-white uppercase">
                ESERIA <span className="text-amber-500">ACADEMY</span>
              </span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm mb-8">
              The elite institution operating at the intersection of Financial Engineering, 
              Data Architecture, and AI Orchestration. Building the next generation of $4k+ remote data partners.
            </p>
          </div>

          {/* LINK GROUPS */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-slate-300 font-bold mb-8">Pillars</h4>
              <ul className="space-y-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
                <li><Link href="/blueprint" className="hover:text-amber-500 transition-colors">The Blueprint</Link></li>
                <li><Link href="#programs" className="hover:text-amber-500 transition-colors">Jurisdictions</Link></li>
                <li><Link href="#research" className="hover:text-amber-500 transition-colors">Faculty</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-slate-300 font-bold mb-8">Governance</h4>
              <ul className="space-y-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Privacy Charter</Link></li>
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Terms of Entry</Link></li>
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Data Ethics</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-slate-300 font-bold mb-8">Ecosystem</h4>
              <ul className="space-y-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
                <li><Link href="https://johnjaylawal.org" target="_blank" className="hover:text-amber-500 transition-colors">JJL Enterprise</Link></li>
                <li><Link href="#" className="hover:text-amber-500 transition-colors">AI Terminal</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
            © 2026 ESERIA ACADEMY. THE SIDONIAN STANDARD.
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
            <span>ABUJA</span>
            <span>LONDON</span>
            <span>LAGOS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}