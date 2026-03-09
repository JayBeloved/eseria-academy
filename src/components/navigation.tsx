
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold tracking-tighter flex items-center gap-2">
          ESERIA <span className="text-primary">ACADEMY</span>
        </Link>
        <div className="hidden md:flex items-center gap-12 text-sm font-medium uppercase tracking-widest text-white/60">
          <Link href="#programs" className="hover:text-primary transition-colors">Programs</Link>
          <Link href="#navigator" className="hover:text-primary transition-colors">AI Navigator</Link>
          <Link href="#inquiry" className="hover:text-primary transition-colors">Inquiry</Link>
        </div>
        {/* <Button variant="outline" className="font-headline border-primary text-primary hover:bg-primary hover:text-background uppercase tracking-wider text-xs px-8">
          Admissions
        </Button> */}
      </div>
    </nav>
  );
}
