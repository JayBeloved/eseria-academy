
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight } from "lucide-react";

const programs = [
  {
    id: "fin-eng",
    title: "Financial Engineering",
    description: "Architecting high-frequency trading systems and quantitative risk models using advanced stochastic calculus and computational finance.",
    image: PlaceHolderImages.find(img => img.id === 'program-fin-eng')?.imageUrl || "",
    hint: "finance algorithms"
  },
  {
    id: "data-sci",
    title: "Data Science & Intelligence",
    description: "Extracting institutional-grade signals from noise. Mastery of deep learning, predictive analytics, and massive-scale data orchestration.",
    image: PlaceHolderImages.find(img => img.id === 'program-data-sci')?.imageUrl || "",
    hint: "data neural networks"
  },
  {
    id: "ai-orch",
    title: "AI Orchestration",
    description: "Beyond simple modeling. Building autonomous agentic frameworks and sovereign AI infrastructure for enterprise-level deployment.",
    image: PlaceHolderImages.find(img => img.id === 'program-ai-orch')?.imageUrl || "",
    hint: "artificial intelligence orchestration"
  }
];

export function ProgramShowcase() {
  return (
    <section id="programs" className="py-32 bg-background noiseless-gradient">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <h2 className="font-headline text-5xl font-bold mb-6 tracking-tight leading-tight uppercase">
            Elite Academic <span className="text-primary">Core</span>
          </h2>
          <p className="text-xl text-white/60 leading-relaxed font-light">
            Eseria Citadel operates at the critical intersection of finance and machine intelligence. 
            Our programs are designed for those who demand aggressive excellence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="group bg-card border-white/5 overflow-hidden gold-glow-hover transition-all duration-500 rounded-none">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={program.hint}
                />
                <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
              </div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline text-2xl uppercase tracking-tighter flex items-center justify-between">
                  {program.title}
                  <ArrowUpRight className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-white/50 leading-relaxed">
                  {program.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
