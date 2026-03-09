"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const facultyMembers = [
  {
    id: "f1",
    name: "John J. Lawal",
    role: "Dean & Lead Architect",
    expertise: "Financial Engineering, Enterprise Data Architecture & AI Orchestration",
    image: PlaceHolderImages.find(img => img.id === 'faculty-1')?.imageUrl || "/api/placeholder/600/800"
  },

  {
    id: "f3",
    name: "DataCamp Enterprise",
    role: "Infrastructure Partner",
    expertise: "World-Class Cloud-Based Interactive Learning Environments",
    image: PlaceHolderImages.find(img => img.id === 'faculty-3')?.imageUrl || "/api/placeholder/600/800"
  }
];

export function FacultySpotlight() {
  return (
    <section id="research" className="py-32 bg-slate-950 border-b border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight uppercase">
              Architects of <span className="text-amber-500">Intelligence</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed font-light">
              Our faculty members and partners are not just educators; they are active architects of the systems that define modern global finance and tech.
            </p>
          </div>
          <div className="text-right border-l border-amber-500/20 pl-8 hidden md:block">
            <div className="text-amber-500 text-4xl font-bold">1%</div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Acceptance Standard</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {facultyMembers.map((member) => (
            <div key={member.id} className="relative group">
              <div className="aspect-[4/5] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  data-ai-hint="professional portrait"
                />
                <div className="absolute inset-0 border border-slate-800 group-hover:border-amber-500/50 transition-colors" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-1">{member.name}</h3>
                <p className="text-amber-500 font-medium text-sm uppercase tracking-widest mb-4">{member.role}</p>
                <div className="h-px w-12 bg-amber-500/30 mb-4" />
                <p className="text-slate-400 text-sm leading-relaxed italic">{member.expertise}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}