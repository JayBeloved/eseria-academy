"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6 text-white">
              ESERIA <span className="text-amber-500">ACADEMY</span>
            </Link>
            <p className="text-slate-400 max-w-xs leading-relaxed text-sm">
              The premium, elite institution operating at the intersection of Financial Engineering, Data Science, and AI Orchestration.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold mb-6">Pillars</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#programs" className="hover:text-amber-500 transition-colors">Programs</Link></li>
                <li><Link href="#research" className="hover:text-amber-500 transition-colors">Faculty</Link></li>
                <li><Link href="#inquiry" className="hover:text-amber-500 transition-colors">Admissions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Privacy Charter</Link></li>
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Institutional Terms</Link></li>
                <li><Link href="#" className="hover:text-amber-500 transition-colors">Data Sourcing</Link></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-amber-500 transition-colors">AI Terminal</Link></li>
                <li><Link href="https://johnjaylawal.org" target="_blank" className="hover:text-amber-500 transition-colors">JJL Enterprise</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          <p>© 2026 Eseria Academy. All Rights Reserved.</p>
          <p>The Sidonian Standard of Excellence.</p>
        </div>
      </div>
    </footer>
  );
}