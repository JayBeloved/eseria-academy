
"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-20 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div>
            <Link href="/" className="font-headline text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6">
              ESERIA <span className="text-primary">CITADEL</span>
            </Link>
            <p className="text-white/40 max-w-xs leading-relaxed text-sm">
              The premium, elite institution operating at the intersection of Financial Engineering, Data Science, and AI Orchestration.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-6">Pillars</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="#programs" className="hover:text-primary transition-colors">Programs</Link></li>
                <li><Link href="#research" className="hover:text-primary transition-colors">Research</Link></li>
                <li><Link href="#navigator" className="hover:text-primary transition-colors">AI Navigator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Charter</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Institutional Terms</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Accreditation</Link></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="#" className="hover:text-primary transition-colors">Terminal</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Institutional X</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
          <p>© 2024 Eseria Citadel. All Rights Reserved.</p>
          <p>The Soriyan Standard of Excellence.</p>
        </div>
      </div>
    </footer>
  );
}
