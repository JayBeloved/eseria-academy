'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ChevronDown, BookOpen, Target, Loader2, Zap } from 'lucide-react';
import { auth, db } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// --- The Fixed 10xB Framework ---
const PHASES = [
  {
    id: 1,
    title: '01: The Commercial Foundation',
    subtitle: 'Data Anatomy & Logic',
    goal: 'Stop typing. Start analyzing.',
    description: "Master the 'Spirit of Money' via Excel/Google Sheets. Frame the business problem before the code.",
    unlockDate: new Date('2026-03-30T00:00:00').getTime(), // Locks until March 30
  },
  {
    id: 2,
    title: '02: The Relational Auditor',
    subtitle: 'SQL Mastery',
    goal: 'Extract and connect business silos.',
    description: "JOINs, CTEs, and Window Functions. Write clean, documented code that categorizes risks via CASE logic.",
    unlockDate: new Date('2026-04-13T00:00:00').getTime(),
  },
  {
    id: 3,
    title: '03: The Visual Storyteller',
    subtitle: 'BI & Executive Presence',
    goal: 'Design experiences that force decisions.',
    description: "Star Schemas and clean UX. Adhere to the 'One chart, one decision' rule. Strip the clutter.",
    unlockDate: new Date('2026-04-27T00:00:00').getTime(),
  },
  {
    id: 4,
    title: '04: The 10xB Architect',
    subtitle: 'Proof of Competence',
    goal: 'Become un-ignorable.',
    description: "Execute a Full-Stack Capstone. Deploy the 'Blue Ocean' maneuver to bypass HR portals and message CTOs directly.",
    unlockDate: new Date('2026-05-04T00:00:00').getTime(),
  }
];

export default function SyllabusPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(true);

  // 1. DATA STREAM: Fetch Global + Tailored Modules
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        // Fetch modules targeted at 'global' OR specifically at this user's email
        const q = query(
          collection(db, "syllabus_modules"),
          where("audience", "in", ["global", user.email]),
          orderBy("order", "asc")
        );

        const unsubModules = onSnapshot(q, 
          (snapshot) => {
            setModules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
          },
          (error) => {
            console.error("Syllabus Sync Error (Check Index):", error);
            setIsLoading(false);
          }
        );
        return () => unsubModules();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const checkUnlockStatus = (unlockDate: number) => {
    const now = Date.now();
    const isUnlocked = now >= unlockDate;
    const daysToUnlock = Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24));
    return { isUnlocked, daysToUnlock };
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold animate-pulse">Decrypting Syllabus...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      <header className="border-b border-zinc-900 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4">
          <BookOpen className="w-3 h-3" /> Eseria Academy Curriculum
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">The <span className="text-amber-500">Ascent</span> Path</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">16-Week Mastery Roadmap • Cohort '26</p>
      </header>

      <div className="space-y-6">
        {PHASES.map((phase) => {
          const { isUnlocked, daysToUnlock } = checkUnlockStatus(phase.unlockDate);
          const isExpanded = expandedPhase === phase.id;
          
          // Filter the dynamically fetched modules for this specific phase
          const phaseModules = modules.filter(m => m.phase === phase.id);

          return (
            <div 
              key={phase.id}
              className={`group border transition-all duration-500 ${
                isUnlocked ? 'border-zinc-800 bg-zinc-950/30' : 'border-zinc-900 bg-black opacity-60'
              }`}
            >
              {/* PHASE HEADER */}
              <div 
                onClick={() => isUnlocked && setExpandedPhase(isExpanded ? null : phase.id)}
                className={`p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer ${!isUnlocked && 'cursor-not-allowed'}`}
              >
                <div className="flex items-start md:items-center gap-6">
                  <div className={`shrink-0 w-12 h-12 flex items-center justify-center border ${isUnlocked ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' : 'border-zinc-800 bg-zinc-900 text-zinc-600'}`}>
                    {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`text-xl font-black uppercase tracking-tight ${isUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                      {phase.title}
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isUnlocked ? 'text-amber-500' : 'text-zinc-700'}`}>
                      {phase.subtitle}
                    </p>
                    {!isUnlocked && (
                      <p className="text-[10px] text-rose-500 uppercase tracking-widest font-bold mt-3 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Authorized in {daysToUnlock} Days
                      </p>
                    )}
                  </div>
                </div>
                
                {isUnlocked && (
                  <div className="hidden md:flex items-center gap-4 text-zinc-500 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest">View Mandates</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </div>

              {/* PHASE CONTENT (EXPANDED) */}
              <AnimatePresence>
                {isExpanded && isUnlocked && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-8 pt-4 border-t border-zinc-900">
                      
                      <div className="bg-amber-500/5 border border-amber-500/20 p-6 mb-8">
                        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Target className="w-3 h-3" /> Phase Objective
                        </h4>
                        <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                          <span className="text-white font-bold">{phase.goal}</span> {phase.description}
                        </p>
                      </div>

                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Deployed Modules
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phaseModules.length > 0 ? (
                          phaseModules.map((mod) => (
                            <div key={mod.id} className="p-5 bg-black border border-zinc-800 hover:border-amber-500/50 transition-all group">
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest bg-amber-500/10 px-2 py-1">
                                  {mod.audience === 'global' ? 'Core Module' : 'Tailored Focus'}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-white uppercase tracking-tight">{mod.title}</h5>
                              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">{mod.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 p-8 border border-zinc-900 border-dashed text-center">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold italic">
                              Modules pending deployment by the Dean.
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}