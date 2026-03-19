'use client';

import React from 'react';
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, 
  Terminal, Briefcase, GraduationCap, Search, Users, TrendingUp 
} from 'lucide-react';

export default function StarMethodPage() {
  return (
    <>
    < Navigation />
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-amber-500/30">
      {/* HEADER BRIEFING */}
      <section className="pt-32 pb-16 px-6 border-b border-slate-900 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            <ShieldCheck className="w-3 h-3" /> Mandatory Pre-Sync Briefing
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
            The <span className="text-amber-500">STAR</span> Protocol
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-light italic">
            "Recruiters spend an average of <span className="text-white font-bold">7.4 seconds</span> scanning a resume. If you list chores instead of impact, you are a liability. We are here to make you an asset."
          </p>
        </div>
      </section>

      {/* DEFINITION */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold uppercase text-white mb-6">What is the STAR Method?</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                The STAR Method is a structured framework used to reframe your experiences into compelling, data-driven narratives. It moves you from "telling" to "proving."
              </p>
              <div className="space-y-4">
                {[
                  { l: "Situation", d: "Set the scene and provide context for the business problem." },
                  { l: "Task", d: "Explain the specific goal or exact problem you needed to solve." },
                  { l: "Action", d: "Detail the exact steps, technical tools, or strategies you used." },
                  { l: "Result", d: "Share the quantified outcome (Time saved, money made, efficiency)." },
                ].map(item => (
                  <div key={item.l} className="flex gap-4">
                    <span className="text-amber-500 font-bold w-4">{item.l[0]}</span>
                    <div>
                       <p className="text-xs font-bold text-white uppercase tracking-widest">{item.l}</p>
                       <p className="text-[11px] text-slate-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 p-8 border border-slate-800 rounded-sm">
              <h3 className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">The 10xB Formula</h3>
              <p className="text-xl font-bold text-white leading-snug mb-4">
                "Accomplished <span className="text-amber-500">[X]</span> by doing <span className="text-amber-500">[Y]</span> as measured by <span className="text-amber-500">[Z]</span>"
              </p>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                You must clearly state what was accomplished, what action you took, and how you measured success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE MO CHEN EXAMPLE */}
      <section className="py-20 px-6 bg-slate-900/30 border-y border-slate-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-center text-sm font-bold uppercase tracking-[0.4em] text-slate-500 mb-12">The Resume Makeover (Mo Chen Example)</h2>
          <div className="grid gap-8">
             <div className="p-6 bg-slate-950 border border-rose-500/20 opacity-50">
                <p className="text-[10px] text-rose-500 uppercase font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> Bad (Task-Based)</p>
                <p className="text-sm italic">"Conducted data analysis to support marketing initiatives."</p>
             </div>
             <div className="p-8 bg-slate-950 border border-amber-500/30 shadow-2xl relative">
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-3 py-1 text-[9px] font-black uppercase">10xB Standard</div>
                <p className="text-[10px] text-amber-500 uppercase font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> STAR-Based Transformation</p>
                <p className="text-sm leading-relaxed text-slate-200">
                  "Analyzed sales data and combined it with demographic information to identify purchasing patterns and optimize marketing campaigns. I created a series of interactive Tableau dashboards with insights leading to a <span className="text-amber-500 font-bold">20% increase</span> in targeted campaign engagement and a <span className="text-amber-500 font-bold">15% improvement</span> in overall marketing ROI."
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* REFRAMING NON-TECH PAST */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold uppercase text-white mb-4 text-center">Reframing Your <span className="text-amber-500">Non-Tech</span> Past</h2>
          <p className="text-slate-500 text-center mb-16 uppercase text-[10px] tracking-widest font-bold">The Kedeisha Bryan Framework</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <GraduationCap />, title: "Teacher", d: "You didn't just 'manage classrooms'—you analyzed student data to improve educational outcomes." },
              { icon: <Briefcase />, title: "Retail", d: "You didn't just 'stock shelves'—you tracked sales trends to optimize inventory and reduce waste." },
              { icon: <Users />, title: "HR", d: "You didn't just 'manage complaints'—you identified turnover patterns to boost staff retention." },
            ].map(item => (
              <div key={item.title} className="p-8 bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all group">
                <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="text-white font-bold uppercase tracking-wide mb-4">{item.title} Reframing</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic border-l border-amber-500/20 pl-4">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEHAVIORAL INTERVIEW */}
      <section className="py-24 px-6 bg-amber-500/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold uppercase text-white mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="text-amber-500" /> Nailing the Behavioral Interview
            </h2>
            <p className="text-slate-500 text-sm">"Tell me about a time you solved a difficult problem with data."</p>
          </div>

          <div className="space-y-2 relative border-l border-amber-500/30 ml-4 pl-8">
            {[
              { s: "Situation", c: "Our company sales were declining." },
              { s: "Task", c: "I needed to identify the root cause of the decline." },
              { s: "Action", c: "I analyzed transaction data using SQL and found that a key product line had decreased sales due to a competitor's promotion." },
              { s: "Result", c: "We adjusted our pricing strategy, and sales rebounded by 15% in just 2 months." },
            ].map(step => (
              <div key={step.s} className="mb-8">
                <p className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] mb-1">{step.s}</p>
                <p className="text-slate-300 font-light italic leading-relaxed">"{step.c}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOMEWORK */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl bg-slate-900 p-12 border border-amber-500/20 rounded-sm">
          <h3 className="text-2xl font-bold uppercase text-white mb-8 flex items-center gap-3"><Terminal className="text-amber-500" /> Pre-Sync Action Items</h3>
          <ul className="space-y-6 mb-12">
            <li className="flex gap-4 items-start text-sm text-slate-400">
              <span className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center text-[10px] text-amber-500 font-bold shrink-0 mt-1">1</span>
              <span>Write down your top 3-5 professional experiences.</span>
            </li>
            <li className="flex gap-4 items-start text-sm text-slate-400">
              <span className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center text-[10px] text-amber-500 font-bold shrink-0 mt-1">2</span>
              <span>Translate them into analytical narratives using the STAR Method.</span>
            </li>
            <li className="flex gap-4 items-start text-sm text-slate-400">
              <span className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center text-[10px] text-amber-500 font-bold shrink-0 mt-1">3</span>
              <span>Ensure every "Result" ends with a quantified business metric.</span>
            </li>
          </ul>
          <a 
            href="https://calendly.com/contact-johnjlawal/eseria-academy-onboarding-chat"
            target="_blank"
            className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-3"
          >
            Confirm Your Strategy Sync <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}