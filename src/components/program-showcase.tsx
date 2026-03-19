"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight, Zap, GraduationCap, BrainCircuit } from "lucide-react";

const programs = [
  {
    id: "pro-pivot",
    title: "The Executive Pivot",
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    description: "For career professionals (HR, Finance, Surveying). Translate years of domain expertise into a high-ticket Senior Data role. Master the automation of industry-specific manual friction.",
    image: PlaceHolderImages.find(img => img.id === 'program-fin-eng')?.imageUrl || "/api/placeholder/800/600",
  },
  {
    id: "grad-ascent",
    title: "The Graduate Grant",
    icon: <GraduationCap className="w-5 h-5 text-amber-500" />,
    description: "For recent graduates. Bypass the entry-level trap. Build an 'Anti-Cliché' portfolio with real-world logic that forces recruiters to ignore your lack of 'years' in favor of 'proof'.",
    image: PlaceHolderImages.find(img => img.id === 'program-data-sci')?.imageUrl || "/api/placeholder/800/600",
  },
  {
    id: "ai-brain",
    title: "The Capstone Forge",
    icon: <BrainCircuit className="w-5 h-5 text-amber-500" />,
    description: "The 10xB Architect phase. Every fellow builds a 'Professional Brain'—a bespoke AI project tailored to their niche, serving as undeniable proof for remote $4k+ roles.",
    image: PlaceHolderImages.find(img => img.id === 'program-ai-orch')?.imageUrl || "/api/placeholder/800/600",
  }
];

export function ProgramShowcase() {
  return (
    <section id="programs" className="py-32 bg-slate-950 border-b border-slate-900 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="max-w-3xl mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight uppercase text-white"
          >
            Tailored <span className="text-amber-500">Pathways</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 leading-relaxed font-light"
          >
            We curate specialists, not reporting vending machines. Choose the jurisdiction that aligns with your current professional friction.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="group bg-slate-900 border-slate-800 overflow-hidden hover:border-amber-500/40 transition-all duration-500 rounded-sm h-full flex flex-col">
                <div className="relative h-64 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/30 transition-colors" />
                  
                  {/* Category Label */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full flex items-center gap-2">
                    {program.icon}
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Jurisdiction</span>
                  </div>
                </div>

                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-bold uppercase tracking-tight text-white flex items-center justify-between">
                    {program.title}
                    <ArrowUpRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex-grow">
                  <p className="text-slate-400 leading-relaxed font-light text-sm italic">
                    {program.description}
                  </p>
                </CardContent>
                
                <div className="px-8 pb-8">
                  <button className="w-full py-3 bg-slate-950 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all">
                    View Pathway Details
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}