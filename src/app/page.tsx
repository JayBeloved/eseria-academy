'use client';

import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { ProgramShowcase } from "@/components/program-showcase";
import { FacultySpotlight } from "@/components/faculty-spotlight";
import { AINavigator } from "@/components/ai-navigator";
import { InquiryForm } from "@/components/inquiry-form";
import { Footer } from "@/components/footer";
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Terminal, 
  ArrowRight, 
  Zap, 
  Layers, 
  BarChart3 
} from "lucide-react";
import Image from "next/image";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function EseriaAcademyHome() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      <Navigation />
      
      {/* 1. HERO SECTION: The Initiation Protocol */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50" />
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-8 px-6 py-2 border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full"
          >
            <ShieldCheck className="w-3 h-3" /> The 10xB Data Analyst Standard
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.85] text-white"
          >
            Escape the <br />
            <span className="text-amber-500 italic lowercase font-serif tracking-normal">reporting grind.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12"
          >
            We don't train "reporting vendors." We engineer strategic, full-stack data partners who solve high-value business problems. 
            <span className="text-white"> Start building proof, not certificates.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a 
              href="/apply"
              className="group h-14 px-12 bg-white text-slate-950 hover:bg-amber-500 hover:text-white uppercase tracking-widest text-xs font-bold rounded-sm transition-all duration-500 flex items-center gap-2"
            >
              Initiate Enrollment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/blueprint"
              className="h-14 px-12 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white uppercase tracking-widest text-xs font-bold rounded-sm transition-all duration-300"
            >
              The 16-Week Blueprint
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. THE 10xB STRATEGY: Domain Advantage */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-8 tracking-tight uppercase leading-tight text-white">
                The Domain <span className="text-amber-500">Advantage</span>
              </motion.h2>
              <motion.div variants={fadeInUp} className="w-20 h-1 bg-amber-500 mb-8"></motion.div>
              <motion.div variants={fadeInUp} className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
                <p>
                  Most bootcamps treat your past experience as a liability. At Eseria Academy, we treat it as your <span className="text-white font-medium italic">ultimate weapon.</span>
                </p>
                <p>
                  Whether you are an Economist, a Surveyor, or a fresh graduate, we bypass the tutorial-hell cliché. You will master the 20% of tools that drive 80% of business value: <span className="text-amber-500 font-bold uppercase tracking-tighter">SQL. BI. Storytelling. Logic.</span>
                </p>
              </motion.div>
            </motion.div>
            
            {/* The 10xB Metrics */}
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <ShieldCheck className="w-6 h-6 text-amber-500" />, val: "1%", label: "Acceptance Rate" },
                { icon: <Terminal className="w-6 h-6 text-amber-500" />, val: "16", label: "Weeks Immersion" },
                { icon: <Cpu className="w-6 h-6 text-amber-500" />, val: "24/7", label: "AI Oracle Uptime" },
                { icon: <Globe className="w-6 h-6 text-amber-500" />, val: "$4k+", label: "Target Remote ROI" }
              ].map((metric, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -5, borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  className="aspect-square bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center p-8 rounded-sm transition-all"
                >
                  <div className="mb-4">{metric.icon}</div>
                  <div className="text-white text-3xl font-black mb-1">{metric.val}</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold text-center leading-tight">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. THE BLUEPRINT TEASE: Full-Stack Proof */}
      <section className="py-32 border-t border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500 mb-4">The 10xB Blueprint</h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase text-white">Proof of Competence</h3>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "The Relational Auditor", 
              icon: <Layers className="w-6 h-6" />, 
              body: "Move beyond spreadsheets. Master SQL logic to connect silos and audit business friction." 
            },
            { 
              title: "The Visual Storyteller", 
              icon: <BarChart3 className="w-6 h-6" />, 
              body: "Build executive experiences. Strip the clutter. Focus on the 'One Chart, One Decision' rule." 
            },
            { 
              title: "The 10xB Architect", 
              icon: <Zap className="w-6 h-6" />, 
              body: "Deploy the 'Blue Ocean' maneuver. Bypass HR portals and demonstrate proof directly to CTOs." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 bg-slate-900 border border-slate-800 rounded-sm hover:border-amber-500/20 transition-all"
            >
              <div className="mb-6 text-amber-500">{item.icon}</div>
              <h4 className="text-lg font-bold uppercase text-white mb-4 tracking-wide">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. MODULAR CORE */}
      <ProgramShowcase />
      <FacultySpotlight />
      <AINavigator />
      
      {/* 5. ENROLLMENT GATE */}
      <div id="enrollment" className="scroll-mt-20">
        <InquiryForm />
      </div>
      
      <Footer />
    </main>
  );
}