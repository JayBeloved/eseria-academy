"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight } from "lucide-react";

const programs = [
  {
    id: "pro-pivot",
    title: "The Professional Pivot",
    description: "For career changers. Translate your years of experience (HR, Finance, Engineering) into a Senior Data Analyst role. Learn to automate your current industry's most tedious manual tasks.",
    image: PlaceHolderImages.find(img => img.id === 'program-fin-eng')?.imageUrl || "/api/placeholder/800/600",
    hint: "professional working on data dashboard"
  },
  {
    id: "grad-ascent",
    title: "The Graduate Ascent",
    description: "For students and recent graduates. Bypass the entry-level trap. Build an 'Anti-Cliché' portfolio with real-world business logic that proves your value to global recruiters immediately.",
    image: PlaceHolderImages.find(img => img.id === 'program-data-sci')?.imageUrl || "/api/placeholder/800/600",
    hint: "student analyzing data"
  },
  {
    id: "ai-brain",
    title: "The Capstone Build",
    description: "Every fellow builds a 'Professional Brain'—a bespoke AI and Data Analytics project tailored to their specific industry, serving as undeniable proof of competence for remote roles.",
    image: PlaceHolderImages.find(img => img.id === 'program-ai-orch')?.imageUrl || "/api/placeholder/800/600",
    hint: "artificial intelligence brain network"
  }
];

export function ProgramShowcase() {
  return (
    <section id="programs" className="py-32 bg-slate-950 border-b border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight uppercase">
            Tailored <span className="text-amber-500">Pathways</span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed font-light">
            We do not mass-produce analysts. We curate specialists. Choose the pathway that aligns with your current career friction.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="group bg-slate-900 border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all duration-500 rounded-sm">
              <div className="relative h-64 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={program.hint}
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/20 transition-colors" />
              </div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold uppercase tracking-tight text-white flex items-center justify-between">
                  {program.title}
                  <ArrowUpRight className="text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-slate-400 leading-relaxed font-light">
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