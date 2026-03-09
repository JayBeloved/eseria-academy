
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const facultyMembers = [
  {
    id: "f1",
    name: "Dr. Alistair Thorne",
    role: "Dean of Financial Engineering",
    expertise: "Stochastic Volatility & HFT",
    image: PlaceHolderImages.find(img => img.id === 'faculty-1')?.imageUrl || ""
  },
  {
    id: "f2",
    name: "Prof. Elena Vance",
    role: "Head of AI Orchestration",
    expertise: "Multi-Agent Neural Systems",
    image: PlaceHolderImages.find(img => img.id === 'faculty-2')?.imageUrl || ""
  },
  {
    id: "f3",
    name: "Dr. Marcus Soria",
    role: "Director of Data Intelligence",
    expertise: "Predictive Economic Modeling",
    image: PlaceHolderImages.find(img => img.id === 'faculty-3')?.imageUrl || ""
  }
];

export function FacultySpotlight() {
  return (
    <section id="research" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-headline text-5xl font-bold mb-6 tracking-tight uppercase">
              Architects of <span className="text-primary">Intelligence</span>
            </h2>
            <p className="text-xl text-white/60 leading-relaxed font-light">
              Our faculty members are not just educators; they are active architects of the systems that define modern global finance.
            </p>
          </div>
          <div className="text-right border-l border-primary/20 pl-8 hidden md:block">
            <div className="text-primary font-headline text-4xl font-bold">480+</div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Publications in 2024</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {facultyMembers.map((member) => (
            <div key={member.id} className="relative group">
              <div className="aspect-[4/5] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  data-ai-hint="professional professor portrait"
                />
                <div className="absolute inset-0 border border-white/5 group-hover:border-primary/50 transition-colors" />
              </div>
              <div className="mt-8">
                <h3 className="font-headline text-2xl font-bold uppercase tracking-tight mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">{member.role}</p>
                <div className="h-px w-12 bg-primary/30 mb-4" />
                <p className="text-white/40 text-sm leading-relaxed italic">{member.expertise}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
