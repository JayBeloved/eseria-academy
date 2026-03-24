'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDot, Lock, Map as MapIcon, Loader2, Target } from 'lucide-react';
import { auth, db } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// The 16-Week Citadel Architecture
const ASCENT_PATH = [
  { phase: 1, title: 'The Commercial Foundation', weeks: [1, 2, 3, 4] },
  { phase: 2, title: 'The Relational Auditor', weeks: [5, 6, 7, 8] },
  { phase: 3, title: 'The Visual Storyteller', weeks: [9, 10, 11, 12] },
  { phase: 4, title: 'The 10xB Architect', weeks: [13, 14, 15, 16] },
];

export default function JourneyPage() {
  const [userData, setUserData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user && user.email) {
          const sanitizedId = user.email.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          // 1. Fetch Profile Data
          const userDoc = await getDoc(doc(db, 'users', sanitizedId));
          if (userDoc.exists()) setUserData(userDoc.data());

          // 2. Fetch Task Telemetry (We only care about Mandates for the Journey Map)
          const q = query(
            collection(db, 'tasks'),
            where('email', '==', user.email),
            where('isMandate', '==', true)
          );
          const taskSnap = await getDocs(q);
          setTasks(taskSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        setIsLoading(false);
      });
    };

    fetchTelemetry();
  }, []);

  if (isLoading || !userData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Mapping Coordinates...</p>
      </div>
    );
  }

  const currentWeek = userData.currentWeek || 1;
  const totalWeeks = 16;
  const overallProgress = Math.round(((currentWeek - 1) / totalWeeks) * 100);

  // Helper to extract specific stats for a given week node
  const getWeekTelemetry = (weekNum: number) => {
    const weekTasks = tasks.filter(t => t.week === weekNum);
    const completedTasks = weekTasks.filter(t => t.status === 'completed');
    const progress = weekTasks.length > 0 ? (completedTasks.length / weekTasks.length) * 100 : 0;
    
    return {
      total: weekTasks.length,
      completed: completedTasks.length,
      progress: Math.round(progress),
      activeTasks: weekTasks // We return the actual tasks to render them
    };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* Header & Overall Progress */}
      <header className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <MapIcon className="w-3 h-3" /> Operational Topography
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Trajectory <span className="text-amber-500">Map</span></h1>
        </div>
        <div className="text-left md:text-right bg-black border border-zinc-900 p-4 rounded-lg shadow-xl">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Global Ascent</p>
          <div className="text-3xl font-black text-white">{overallProgress}% <span className="text-sm text-zinc-600">Complete</span></div>
        </div>
      </header>

      {/* The Vertical Ascent Path */}
      <div className="relative pl-4 md:pl-8">
        {/* Underlying Line */}
        <div className="absolute top-0 bottom-0 left-[27px] md:left-[43px] w-0.5 bg-zinc-900" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-0 left-[27px] md:left-[43px] w-0.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
          style={{ height: `${(currentWeek / totalWeeks) * 100}%` }}
        />

        {ASCENT_PATH.map((phase) => (
          <div key={phase.phase} className="mb-12 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-black border-2 border-zinc-800 flex items-center justify-center shrink-0 z-10 relative">
                <span className="text-[10px] font-black text-zinc-500">P{phase.phase}</span>
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                {phase.title}
              </h2>
            </div>

            <div className="space-y-8 pl-4">
              {phase.weeks.map((week) => {
                const isCompleted = week < currentWeek;
                const isCurrent = week === currentWeek;
                const isLocked = week > currentWeek;
                
                // Fetch the real data for this node
                const telemetry = getWeekTelemetry(week);

                return (
                  <motion.div 
                    key={week}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: week * 0.05 }}
                    className={`flex items-start gap-6 group ${isLocked ? 'opacity-40' : ''}`}
                  >
                    {/* The Node Icon */}
                    <div className="relative z-10 bg-black mt-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-amber-500 bg-black rounded-full" />
                      ) : isCurrent ? (
                        <div className="relative flex items-center justify-center w-6 h-6">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-20 animate-ping" />
                          <CircleDot className="w-6 h-6 text-amber-500 relative bg-black rounded-full" />
                        </div>
                      ) : (
                        <Lock className="w-5 h-5 text-zinc-700 bg-black ml-0.5" />
                      )}
                    </div>

                    {/* The Content Card */}
                    <div className={`flex-1 p-5 rounded-lg border transition-all ${
                      isCurrent 
                        ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                        : isCompleted
                        ? 'bg-zinc-950 border-zinc-800'
                        : 'bg-black border-zinc-900'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${
                          isCurrent ? 'text-amber-500' : 'text-zinc-500'
                        }`}>
                          Week {week}
                        </p>
                        
                        {/* Status Badge */}
                        {!isLocked && (
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                            {telemetry.completed} / {telemetry.total} Mandates
                          </span>
                        )}
                      </div>

                      {/* Dynamic Content based on State */}
                      {isCompleted ? (
                        <p className="text-xs font-bold text-zinc-300">Phase Objectives Cleared.</p>
                      ) : isCurrent ? (
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold tracking-tight text-white mb-3">
                            Active Operational Window
                          </h3>
                          
                          {/* Mini Progress Bar for Current Week */}
                          <div className="h-1 w-full bg-black rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 transition-all duration-1000"
                              style={{ width: `${telemetry.progress}%` }}
                            />
                          </div>
                          
                          {/* Live Task List */}
                          <div className="space-y-2 mt-3">
                            {telemetry.activeTasks.length > 0 ? (
                              telemetry.activeTasks.map(task => (
                                <div key={task.id} className="flex items-start gap-2">
                                  {task.status === 'completed' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  ) : (
                                    <Target className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  )}
                                  <span className={`text-[11px] uppercase tracking-tight font-bold ${task.status === 'completed' ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                                    {task.title}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-zinc-600 uppercase tracking-widest italic">Awaiting Mandates from Dean.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <h3 className="text-sm font-bold tracking-tight text-zinc-600">
                          Awaiting Clearance
                        </h3>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}