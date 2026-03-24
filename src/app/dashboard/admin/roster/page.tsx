'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Users, ShieldAlert, Target, Activity, MoreHorizontal, Loader2 } from 'lucide-react';

export default function CohortRoster() {
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all users who are NOT admins
    const q = query(
      collection(db, 'users'),
      where('role', '!=', 'admin') // Note: Requires an index in Firestore!
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setFellows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      },
      (error) => {
        console.error("Roster Fetch Error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-4" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold animate-pulse">
          Decrypting Cohort Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header className="border-b border-rose-900/50 pb-8 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Users className="w-3 h-3" /> Personnel Management
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Cohort <span className="text-rose-500">Roster</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Total Active Fellows</p>
          <div className="text-3xl font-black text-white">{fellows.length}</div>
        </div>
      </header>

      

      {/* THE ROSTER TABLE */}
      <div className="bg-black border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-900 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                <th className="p-6 font-medium">Fellow Designation</th>
                <th className="p-6 font-medium">Primary Stratagem</th>
                <th className="p-6 font-medium">Location (Phase/Week)</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {fellows.length > 0 ? (
                fellows.map((fellow) => (
                  <tr key={fellow.id} className="hover:bg-zinc-950/30 transition-colors group">
                    
                    {/* Identity */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                          <span className="text-sm font-black text-zinc-400">
                            {fellow.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">
                            {fellow.fullName || 'Unknown Unit'}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            {fellow.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Stratagem / Goal */}
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-300">
                          {fellow.primaryGoal || 'Undeclared'}
                        </span>
                      </div>
                    </td>

                    {/* Temporal Location */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                          Phase {fellow.currentPhase || 1}
                        </span>
                        <span className="text-xs font-bold text-zinc-400">
                          Week {fellow.currentWeek || 1}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-6">
                      {fellow.onboardingCompleted ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                          <Activity className="w-3 h-3" /> Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                          <ShieldAlert className="w-3 h-3" /> Onboarding
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right">
                      <button className="p-2 text-zinc-600 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                      No active Fellows detected in the Citadel.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}