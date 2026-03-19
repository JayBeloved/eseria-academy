"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ShieldCheck, Award } from "lucide-react";

const facultyMembers = [
  {
    id: "f1",
    name: "John J. Lawal",
    role: "Dean & Lead Architect",
    expertise: "Financial Engineering, Enterprise Data Architecture & AI Orchestration",
    image: PlaceHolderImages.find(img => img.id === 'faculty-1')?.imageUrl || "/api/placeholder/600/800"
  }
];

export function FacultySpotlight() {
  return (
    <section id="research" className="py-32 bg-slate-950 border-b border-slate-900 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight uppercase text-white">
              Architects of <span className="text-amber-500 font-serif italic lowercase tracking-normal">Intelligence</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed font-light">
              We are not just educators; we are active architects of the systems that define modern global finance. At Eseria, you learn from practitioners, not theorists.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-right border-l-2 border-amber-500/20 pl-8 hidden md:block"
          >
            <div className="text-amber-500 text-5xl font-black tracking-tighter">1%</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-1 italic">Acceptance Standard</div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {facultyMembers.map((member, i) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group"
            >
              <div className="aspect-[4/5] relative overflow-hidden rounded-sm bg-slate-900 border border-slate-800 group-hover:border-amber-500/50 transition-all duration-700">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Authority Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">{member.name}</h3>
                <div className="flex items-center gap-3 mb-6">
                   <p className="text-amber-500 font-bold text-[10px] uppercase tracking-[0.2em]">{member.role}</p>
                   <div className="h-px flex-1 bg-slate-800" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-light italic border-l-2 border-amber-500/20 pl-4">
                  {member.expertise}
                </p>
              </div>
            </motion.div>
          ))}
          
          {/* Vacant "Future Architect" Slot to show growth */}
          <div className="hidden md:flex flex-col items-center justify-center aspect-[4/5] border border-dashed border-slate-800 rounded-sm opacity-30 p-12 text-center">
            <Award className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Research Fellows <br /> TBA Cohort '26</p>
          </div>
        </div>
      </div>
    </section>
  );
}