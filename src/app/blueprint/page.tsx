'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Link from "next/link";
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ShieldCheck, Target, Zap, Layers, Crown, GraduationCap, 
  ArrowRight, BarChart3, Terminal, Video, Search, BrainCircuit,
  Briefcase, FileText, TrendingUp, Sparkles, MessageSquare, Users,
  CheckCircle2 
} from 'lucide-react';

export default function ProgrammeBlueprint() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30 overflow-x-hidden">
    <Navigation />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-slate-900 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-amber-500/5 blur-[140px] rounded-full"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
        >
          <ShieldCheck className="w-3 h-3" /> The 10xB Data Analyst Standard
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white max-w-5xl leading-[0.85] mb-8"
        >
          Stop collecting <br /> certificates. <br /> <span className="text-amber-500">Start building proof.</span>
        </motion.h1> {/* Changed from </h1 > to </motion.h1> */}
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          We don't train "reporting vending machines." We engineer strategic, full-stack data partners who solve high-value business problems.
        </motion.p>
      </section>

      {/* 2. THE DELIVERABLES (PART 1) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-bold mb-4">Part 1: The Deliverables</h2>
          <h3 className="text-3xl font-bold uppercase text-white">What You Get Inside the Blueprint</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: <Terminal className="w-5 h-5" />, 
              title: "16-Week Custom Technical Sprint", 
              desc: "A roadmap tailored to your hardware and industry background. Excel, SQL, BI Tools, and automated cleaning—no vacuum learning." 
            },
            { 
              icon: <Layers className="w-5 h-5" />, 
              title: "The 'Anti-Cliché' Portfolio Forge", 
              desc: "Bypass Titanic datasets. Use AI to engineer hyper-realistic, messy, industry-specific synthetic data that proves competence." 
            },
            { 
              icon: <Briefcase className="w-5 h-5" />, 
              title: "30-Day 'Volunteer Consulting' Playbook", 
              desc: "Real-world experience is not given; it's taken. Our playbook for pitching free consulting to SMEs to secure real case studies." 
            },
            { 
              icon: <Search className="w-5 h-5" />, 
              title: "7.4-Second Branding Makeover", 
              desc: "Optimize for the 'Glance Factor.' STAR-method resumes and LinkedIn profiles that move you from 'Aspiring' to 'Authority'." 
            },
            { 
              icon: <Video className="w-5 h-5" />, 
              title: "Storytelling & Decision Engine", 
              desc: "Master the 'Pyramid Principle.' Lead with answers, support with insights, and design decks that force C-suite decisions." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-slate-900/40 border border-slate-800 rounded-sm hover:border-amber-500/30 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 mb-6 group-hover:border-amber-500/50 transition-all">
                {item.icon}
              </div>
              <h4 className="text-white font-bold uppercase tracking-wide mb-3">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. THE SYSTEM ROADMAP (PART 2) */}
      <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-24">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-bold mb-4">Part 2: The 10xB System Roadmap</h2>
            <h3 className="text-3xl font-bold uppercase text-white italic">Unbreakable Systematic Foundation</h3>
          </div>

          {/* ROADMAP LINE */}
          <div className="absolute left-4 md:left-1/2 top-40 bottom-20 w-px bg-slate-800 hidden md:block">
            <motion.div 
              className="w-full bg-amber-500 origin-top shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              style={{ scaleY }}
            />
          </div>

          {/* PHASES */}
          <div className="space-y-32">
            {[
              { 
                phase: "01", title: "The Commercial Foundation", sub: "Data Anatomy & Logic", 
                goal: "Stop typing. Start analyzing.", 
                body: "Master the 'Spirit of Money' via Excel/Google Sheets. Frame the business problem before the code." 
              },
              { 
                phase: "02", title: "The Relational Auditor", sub: "SQL Mastery", 
                goal: "Extract and connect business silos.", 
                body: "JOINs, CTEs, and Window Functions. Write clean, documented code that categorizes risks via CASE logic." 
              },
              { 
                phase: "03", title: "The Visual Storyteller", sub: "BI & Executive Presence", 
                goal: "Design experiences that force decisions.", 
                body: "Star Schemas and clean UX. Adhere to the 'One chart, one decision' rule. Strip the clutter." 
              },
              { 
                phase: "04", title: "The 10xB Architect", sub: "Proof of Competence", 
                goal: "Become un-ignorable.", 
                body: "Execute a Full-Stack Capstone. Deploy the 'Blue Ocean' maneuver to bypass HR portals and message CTOs directly." 
              }
            ].map((p, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 text-center md:text-right">
                   {i % 2 !== 0 && <div className="hidden md:block" />}
                   <div className={i % 2 === 0 ? 'md:text-right' : 'md:text-left'}>
                      <span className="text-5xl font-black text-slate-800 mb-2 block">{p.phase}</span>
                      <h4 className="text-xl font-bold text-white uppercase mb-1">{p.title}</h4>
                      <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4">{p.sub}</p>
                   </div>
                </div>
                
                {/* Center Node */}
                <div className="w-10 h-10 rounded-full bg-slate-950 border-4 border-slate-800 z-10 shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
                </div>

                <div className="flex-1 bg-slate-900/50 border border-slate-800 p-8 rounded-sm">
                  <p className="text-amber-500 text-[10px] font-bold uppercase mb-2">Goal: {p.goal}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE JURISDICTIONS (TIERS) */}
      <section className="py-32 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-bold mb-4">Jurisdictional Enrollment</h2>
            <h3 className="text-4xl font-bold uppercase text-white">Choose Your Operational Tier</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* EXECUTIVE PIVOT */}
            <div className="relative p-10 bg-slate-950 border border-amber-500/40 rounded-sm shadow-2xl group overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h4 className="text-3xl font-black text-white uppercase leading-none mb-2">Executive Pivot</h4>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">The High-Sovereignty Path</p>
                </div>
                <Crown className="w-10 h-10 text-amber-500" />
              </div>

              <div className="mb-10 relative z-10">
                <p className="text-4xl font-bold text-white mb-1">₦75,000</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Per 4-Week Phase</p>
              </div>

              <ul className="space-y-5 mb-12 relative z-10">
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-amber-500/10 rounded-full"><Sparkles className="w-3 h-3 text-amber-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wide">Personalized AI Data Assistant</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">A bespoke Gemini Gem engineered for your specific industry niche.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-amber-500/10 rounded-full"><MessageSquare className="w-3 h-3 text-amber-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wide">Bi-Weekly 1-on-1 "War Room" Syncs</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Direct architectural review of your artifacts by the Dean.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-amber-500/10 rounded-full"><TrendingUp className="w-3 h-3 text-amber-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wide">6-Months Post-Grad Career Strategy</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Ongoing executive consulting to help you navigate your new role.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start opacity-70">
                  <div className="mt-1 p-1 bg-amber-500/10 rounded-full"><ShieldCheck className="w-3 h-3 text-amber-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wide">VIP Referral Network Access</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Direct introductions to hiring managers in the 10xB partner network.</p>
                  </div>
                </li>
              </ul>
              <Link href="/apply" passHref>
              <button className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all shadow-lg">
                Initiate Executive Enrollment
              </button>
              </ Link>
            </div>

            {/* GRADUATE GRANT */}
            <div className="relative p-10 bg-slate-950 border border-slate-800 rounded-sm group overflow-hidden">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h4 className="text-3xl font-black text-white uppercase leading-none mb-2 text-slate-200">Graduate Grant</h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">The Career Forge Path</p>
                </div>
                <GraduationCap className="w-10 h-10 text-slate-800" />
              </div>

              <div className="mb-10 relative z-10">
                <p className="text-4xl font-bold text-white mb-1">₦50,000</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Per 4-Week Phase</p>
              </div>

              <ul className="space-y-5 mb-12 relative z-10">
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-slate-800 rounded-full"><BrainCircuit className="w-3 h-3 text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">10xB Data AI Assistant</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Standardized high-fidelity prompt library for all technical phases.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-slate-800 rounded-full"><Users className="w-3 h-3 text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">Weekly Group Strategy Chambers</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Collaborative peer audits and group Q&A with the Dean.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-slate-800 rounded-full"><TrendingUp className="w-3 h-3 text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">3-Months Post-Grad Career Guidance</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Assistance with resume audits and job board navigation strategy.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-slate-800 rounded-full"><CheckCircle2 className="w-3 h-3 text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">The Full-Stack Portfolio Framework</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Structured templates for building un-ignorable case studies.</p>
                  </div>
                </li>
              </ul>
              <Link href="/apply" passHref>
              <button className="w-full py-5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all">
                Initiate Graduate Enrollment
              </button>
              </ Link>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center border-t border-slate-900">
        <h2 className="text-4xl font-bold text-white uppercase mb-6 italic">Ready to Bridge the Gap?</h2>
        <p className="text-slate-400 text-sm uppercase tracking-[0.3em] mb-12">The 10xB standard awaits your authorization.</p>
        <button className="px-12 py-5 bg-white text-slate-950 text-xs font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl">
          Start Your Initiation Protocol
        </button>
      </section>

    </div>
    < Footer />
    </>
  );
}
