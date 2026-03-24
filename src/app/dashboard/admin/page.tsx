'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { 
  Activity, Users, Target, Inbox, 
  TrendingUp, Clock, ShieldAlert, Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalFellows: 0,
    activeFellows: 0,
    totalMandates: 0,
    completedMandates: 0,
    pendingArtifacts: 0,
  });
  const [recentArtifacts, setRecentArtifacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        // 1. Cohort Metrics
        const qUsers = query(collection(db, 'users'), where('role', '!=', 'admin'));
        const usersSnap = await getDocs(qUsers);
        const fellows = usersSnap.docs.map(d => d.data());
        
        // 2. Mandate Metrics (Across all fellows)
        const qTasks = query(collection(db, 'tasks'), where('isMandate', '==', true));
        const tasksSnap = await getDocs(qTasks);
        const mandates = tasksSnap.docs.map(d => d.data());
        const completed = mandates.filter(m => m.status === 'completed').length;

        // 3. Artifact Metrics
        const qSubmissions = query(collection(db, 'submissions'), where('status', '==', 'pending'));
        const submissionsSnap = await getDocs(qSubmissions);
        
        // 4. Recent Activity (Latest 4 pending submissions)
        const qRecent = query(collection(db, 'submissions'), where('status', '==', 'pending'), orderBy('submittedAt', 'desc'), limit(4));
        const recentSnap = await getDocs(qRecent);

        setMetrics({
          totalFellows: fellows.length,
          activeFellows: fellows.filter(f => f.onboardingCompleted).length,
          totalMandates: mandates.length,
          completedMandates: completed,
          pendingArtifacts: submissionsSnap.size,
        });

        setRecentArtifacts(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (error) {
        console.error("Telemetry Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelemetry();
  }, []);

  const completionRate = metrics.totalMandates > 0 
    ? Math.round((metrics.completedMandates / metrics.totalMandates) * 100) 
    : 0;

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header className="border-b border-rose-900/50 pb-8 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <ShieldAlert className="w-3 h-3" /> Eseria Citadel Network
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Global <span className="text-rose-500">Telemetry</span>
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">
            System Status & Operations
          </p>
        </div>
      </header>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black border border-zinc-900 p-6 rounded-xl flex flex-col justify-between group hover:border-rose-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><Users className="w-5 h-5" /></div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white">{metrics.totalFellows}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Total Personnel</p>
            <p className="text-[10px] text-emerald-500 mt-2 font-black">{metrics.activeFellows} Active in Citadel</p>
          </div>
        </div>

        <div className="bg-black border border-zinc-900 p-6 rounded-xl flex flex-col justify-between group hover:border-rose-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><Target className="w-5 h-5" /></div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white">{metrics.totalMandates}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Global Mandates Deployed</p>
          </div>
        </div>

        <div className="bg-black border border-zinc-900 p-6 rounded-xl flex flex-col justify-between group hover:border-rose-500/50 transition-colors relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white">{completionRate}%</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Cohort Execution Rate</p>
            <div className="w-full h-1 bg-zinc-900 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-black border border-rose-900/50 p-6 rounded-xl flex flex-col justify-between group shadow-[0_0_20px_rgba(244,63,94,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-500"><Inbox className="w-5 h-5" /></div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white">{metrics.pendingArtifacts}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Pending Reviews</p>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" /> Action Required: Unreviewed Artifacts
          </h2>
          
          {recentArtifacts.length > 0 ? (
            <div className="space-y-3">
              {recentArtifacts.map(art => (
                <div key={art.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">{art.fellowName}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{art.taskTitle}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/admin/submissions" className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-white transition-colors bg-rose-500/10 px-3 py-1.5 rounded-sm">
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-zinc-900 border-dashed rounded-xl flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-8 h-8 text-zinc-800 mb-3" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">No pending artifacts in queue.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" /> Command Relays
          </h2>
          <div className="space-y-3">
            <Link href="/dashboard/admin/broadcaster" className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-rose-500/50 rounded-lg group transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-rose-500 transition-colors">Deploy Mandate</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-rose-500 transition-colors" />
            </Link>
            <Link href="/dashboard/admin/syllabus" className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-rose-500/50 rounded-lg group transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-rose-500 transition-colors">Update Curriculum</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-rose-500 transition-colors" />
            </Link>
            <Link href="/dashboard/admin/arsenal" className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 hover:border-rose-500/50 rounded-lg group transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-rose-500 transition-colors">Provision Arsenal</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-rose-500 transition-colors" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}