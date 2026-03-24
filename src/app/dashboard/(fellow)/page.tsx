'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { 
  Target, BrainCircuit, CheckCircle2, Terminal, 
  Upload, ExternalLink, Loader2, LogOut, Activity, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ExecutiveHUD() {
  const router = useRouter();
  
  // STATE
  const [userData, setUserData] = useState<any>(null);
  const [mandates, setMandates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artifactType, setArtifactType] = useState('github');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // 1. IDENTITY & MANDATE SYNC
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const sanitizedId = user.email?.toLowerCase().replace(/[^a-z0-9]/g, '') || user.uid;
        const userDocRef = doc(db, 'users', sanitizedId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.role === 'admin') { router.push('/dashboard/admin'); return; }
          setUserData(data);

          // Fetch only this week's mandates for the HUD progress
          const q = query(
            collection(db, "tasks"),
            where("email", "==", user.email),
            where("isMandate", "==", true),
            where("week", "==", data.currentWeek || 1)
          );
          
          const mandateSnap = await getDocs(q);
          setMandates(mandateSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // 2. HUD METRICS
  const progressMetrics = useMemo(() => {
    if (mandates.length === 0) return 0;
    const completed = mandates.filter(t => t.status === 'completed').length;
    return Math.round((completed / mandates.length) * 100);
  }, [mandates]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleSubmitArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const url = (form.elements.namedItem('artifactUrl') as HTMLInputElement).value;
    
    if (!url || !selectedTaskId) {
      alert("You must select a target deliverable and provide a secure link.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Find the specific task to grab its title
      const targetTask = mandates.find(m => m.id === selectedTaskId);

      await addDoc(collection(db, 'submissions'), {
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        fellowName: userData.fullName,
        taskId: selectedTaskId,          // <--- THE RELATIONAL LINK
        taskTitle: targetTask?.title,    // <--- FOR EASY ADMIN READING
        weekNumber: userData.currentWeek || 1,
        artifactUrl: url,
        artifactType: artifactType,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });

      // Auto-complete the task in the Command Center upon submission!
      await updateDoc(doc(db, 'tasks', selectedTaskId), {
        status: 'completed'
      });

      alert("Artifact Transmitted to the Dean. Objective marked complete.");
      form.reset();
      setSelectedTaskId('');
    } catch (error) {
      console.error("Transmission failed:", error);
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold animate-pulse">Initializing HUD...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* 1. THE EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Activity className="w-3 h-3" /> Operational Status: Active
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Fellow {userData.fullName?.split(' ')[0] || 'Unit'}
          </h1>
          <p className="text-zinc-400 text-xs mt-2 uppercase tracking-widest font-bold">
            Jurisdiction: <span className="text-amber-500">{userData.primaryGoal || 'Data Architecture'}</span>
          </p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-900 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-500 text-[10px] font-bold uppercase tracking-widest transition-all">
          <LogOut className="w-3 h-3" /> Terminate Session
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TELEMETRY & UPLINK */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* THE 10xB PULSE (Current Week Progress) */}
          <section className="bg-black border border-zinc-900 p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl transition-all group-hover:bg-amber-500/10" />
            
            <div className="flex justify-between items-end mb-8 relative z-10">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" /> Week {userData.currentWeek || 1} Telemetry
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">
                  Active Mandates Executed
                </p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-white">{progressMetrics}%</span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-zinc-950 rounded-full mb-8 overflow-hidden relative z-10">
              <div 
                className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-1000" 
                style={{ width: `${progressMetrics}%` }}
              />
            </div>

            {/* ROUTING BUTTON */}
            <Link href="/dashboard/command" className="w-full py-4 bg-zinc-950 border border-zinc-800 hover:border-amber-500 text-[10px] font-bold text-white uppercase tracking-widest flex items-center justify-center gap-3 transition-all relative z-10 group/btn">
              Enter Command Center <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-amber-500" />
            </Link>
          </section>

          {/* ARTIFACT UPLINK */}
          <section className="bg-black border border-zinc-900 p-8">
            <h2 className="text-lg font-black uppercase tracking-tighter text-white flex items-center gap-2 mb-6">
              <Upload className="w-5 h-5 text-amber-500" /> Submissions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-zinc-950 border border-zinc-900">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Code</p>
                <p className="text-[9px] text-zinc-500 leading-tight">GitHub Repos only.</p>
              </div>
              <div className="space-y-1 md:border-l border-zinc-900 md:pl-4">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Visuals</p>
                <p className="text-[9px] text-zinc-500 leading-tight">Drive, Notion, or NovyPro.</p>
              </div>
              <div className="space-y-1 md:border-l border-zinc-900 md:pl-4">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">The Loom Rule</p>
                <p className="text-[9px] text-zinc-500 leading-tight">Walkthrough required.</p>
              </div>
            </div>

            {/* Derived Deliverables List */}
            {(() => {
              const deliverables = mandates.filter(m => m.isDeliverable && m.status !== 'completed');
              
              return (
                <form onSubmit={handleSubmitArtifact} className="space-y-4">
                  
                  {/* STEP 1: SELECT DELIVERABLE */}
                  <select 
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-900 text-xs font-bold uppercase text-white p-4 outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="" disabled className="text-zinc-600">Select Target Deliverable...</option>
                    {deliverables.map(d => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>

                  {/* STEP 2: LINK & TYPE */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                      value={artifactType} 
                      onChange={(e) => setArtifactType(e.target.value)}
                      className="bg-zinc-950 border border-zinc-900 text-[10px] font-bold uppercase text-zinc-400 p-4 outline-none focus:border-amber-500 transition-colors shrink-0"
                    >
                      <option value="github">GitHub</option>
                      <option value="loom">Loom</option>
                      <option value="drive">Drive / Doc</option>
                    </select>
                    
                    <input 
                      name="artifactUrl" 
                      type="url" 
                      required
                      placeholder="Insert secure link..." 
                      className="flex-1 bg-zinc-950 border border-zinc-900 p-4 text-sm text-white outline-none focus:border-amber-500 transition-colors"
                    />
                    
                    <button 
                      disabled={isSubmitting || deliverables.length === 0}
                      className="px-8 py-4 bg-amber-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transmit'}
                    </button>
                  </div>
                  
                  {deliverables.length === 0 && (
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-2">
                      No active deliverables require submission this week.
                    </p>
                  )}
                </form>
              );
            })()}
          </section>
        </div>

        {/* RIGHT COLUMN: THE ORACLE */}
        <div className="space-y-8">
          <section className="bg-amber-500/5 border border-amber-500/20 p-8 h-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-6">
              <BrainCircuit className="w-4 h-4" /> The Eseria's Counsel
            </h3>
            <div className="border-l-2 border-amber-500/30 pl-4 space-y-4">
              <p className="text-sm italic text-amber-100/80 leading-relaxed">
                "{userData.aiSuggestion || "Master the anatomy of the data before you attempt to build the architecture. Week 1 is about establishing precision. Execute your mandates in the Command Center."}"
              </p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/50">
                Generated based on current trajectory
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}