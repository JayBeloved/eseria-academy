'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs, writeBatch, doc, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { Send, ShieldAlert, Target, Users, Clock, Zap, ShieldCheck, Loader2, FastForward, Edit2, Trash2, List } from 'lucide-react';

export default function MandateBroadcaster() {
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [mandates, setMandates] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Mandate Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('global');
  const [week, setWeek] = useState(1);
  const [phase, setPhase] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(true); // Default to Architecture (Q2)
  const [requiresSubmission, setRequiresSubmission] = useState(true);
  const [dueDate, setDueDate] = useState('');

  // Progression Engine State
  const [globalPhase, setGlobalPhase] = useState(1);
  const [globalWeek, setGlobalWeek] = useState(1);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // 1. FETCH COHORT ROSTER
  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '!=', 'admin'));
        const snap = await getDocs(q);
        setFellows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Roster Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCohort();
    
    // Fetch Live Mandates
    const qMandates = query(
      collection(db, 'tasks'),
      where('isMandate', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubMandates = onSnapshot(qMandates, 
      (snapshot) => setMandates(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
      (error) => console.error("Mandate Sync Error (Check Index):", error)
    );

    return () => unsubMandates();
  }, []);
  

  // 2. THE FAN-OUT DEPLOYMENT ENGINE
  const handleDeployMandate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return alert("Title and Due Date are required.");
    
    setIsDeploying(true);
    try {
      if (editId) {
        // SURGICAL UPDATE (Single Task)
        await updateDoc(doc(db, 'tasks', editId), {
          title, description, isDeliverable: requiresSubmission,
          urgent: isUrgent, important: isImportant,
          week: Number(week), phase: Number(phase),
          dueDate: new Date(dueDate).getTime()
        });
        setEditId(null);
      } else {
        // FAN-OUT DEPLOYMENT (Multiple Tasks)
        const batch = writeBatch(db);
        const targets = audience === 'global' ? fellows : fellows.filter(f => f.email === audience);

        targets.forEach(fellow => {
          const taskRef = doc(collection(db, 'tasks')); 
          batch.set(taskRef, {
            title, description, email: fellow.email, fellowId: fellow.id,
            isMandate: true, isDeliverable: requiresSubmission, status: 'pending',
            urgent: isUrgent, important: isImportant,
            week: Number(week), phase: Number(phase),
            dueDate: new Date(dueDate).getTime(), createdAt: Date.now(), dependencies: []
          });
        });
        await batch.commit();
        alert(`Mandate deployed successfully to ${targets.length} Fellow(s).`);
      }
      // Reset Form
      setTitle(''); setDescription('');
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed. Check console.");
    } finally {
      setIsDeploying(false);
    }
  };

  const cancelEdit = () => {
    setTitle(''); setDescription(''); setAudience('global'); setEditId(null);
  };

  const initiateEdit = (mandate: any) => {
    setTitle(mandate.title); setDescription(mandate.description || '');
    setWeek(mandate.week); setPhase(mandate.phase);
    setDueDate(new Date(mandate.dueDate).toISOString().split('T')[0]);
    setIsUrgent(mandate.urgent); setIsImportant(mandate.important);
    setRequiresSubmission(mandate.isDeliverable);
    setAudience(mandate.email); // Lock to specific fellow
    setEditId(mandate.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMandate = async (id: string) => {
    if (confirm("Decommission this mandate? It will be wiped from the Fellow's Command Center.")) {
      await deleteDoc(doc(db, 'tasks', id));
    }
  };

  // 3. THE COHORT PROGRESSION ENGINE (Phase Unlocking)
  const handleAdvanceCohort = async () => {
    if (!confirm(`WARNING: This will advance ALL Fellows to Phase ${globalPhase}, Week ${globalWeek}. Proceed?`)) return;
    
    setIsAdvancing(true);
    try {
      const batch = writeBatch(db);
      fellows.forEach(fellow => {
        const fellowRef = doc(db, 'users', fellow.id);
        batch.update(fellowRef, {
          currentPhase: Number(globalPhase),
          currentWeek: Number(globalWeek)
        });
      });
      await batch.commit();
      alert("Cohort Temporal Location Updated. HUDs and Maps recalibrated.");
    } catch (error) {
      console.error("Progression failed:", error);
      alert("Failed to advance cohort.");
    } finally {
      setIsAdvancing(false);
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      <header className="border-b border-rose-900/50 pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Mandate <span className="text-rose-500">Broadcaster</span>
        </h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">
          Global Deployment & Temporal Control
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: PROGRESSION & METRICS */}
        <div className="space-y-8">
          
          {/* THE PROGRESSION ENGINE */}
          <section className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2 mb-4">
              <FastForward className="w-4 h-4" /> Cohort Progression Lock
            </h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Advance the temporal location of the cohort. This action unlocks their Syllabus and updates their Journey Map.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest block mb-2">Target Phase</label>
                <input type="number" min="1" max="4" value={globalPhase} onChange={e => setGlobalPhase(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none focus:border-rose-500 rounded-lg text-center font-black" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest block mb-2">Target Week</label>
                <input type="number" min="1" max="16" value={globalWeek} onChange={e => setGlobalWeek(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none focus:border-rose-500 rounded-lg text-center font-black" />
              </div>
            </div>

            <button 
              onClick={handleAdvanceCohort}
              disabled={isAdvancing}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAdvancing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Cohort Advance'}
            </button>
          </section>

          {/* QUICK ROSTER REFERENCE */}
          <section className="bg-black border border-zinc-900 p-6 rounded-xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
              <Users className="w-4 h-4" /> Active Targets ({fellows.length})
            </h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {fellows.map(f => (
                <div key={f.id} className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-900 rounded-md">
                  <span className="text-xs font-bold text-zinc-300 uppercase">{f.fullName?.split(' ')[0]}</span>
                  <span className="text-[9px] text-zinc-600 font-mono">{f.email}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* COLUMN 2: DEPLOYMENT CONSOLE */}
        <div className="lg:col-span-2">
          <section className="bg-black border border-zinc-900 p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-lg font-black uppercase tracking-tighter text-white flex items-center gap-2 mb-8 relative z-10">
              <Send className="w-5 h-5 text-rose-500" /> Operational Deployment
            </h2>

            <form onSubmit={handleDeployMandate} className="space-y-6 relative z-10">
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Target Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)} disabled={!!editId} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white font-bold uppercase outline-none focus:border-rose-500 transition-colors rounded-lg">
                  <option value="global">Global Broadcast (All Fellows)</option>
                  {fellows.map(f => (
                    <option key={f.id} value={f.email}>Target: {f.fullName} ({f.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Objective Designation (Title)</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Execute XLOOKUP Audit" className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Strategic Context (Optional)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide tactical parameters..." rows={3} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Temporal Parameters</label>
                  <div className="flex gap-2">
                    <input type="number" min="1" placeholder="Phase" value={phase} onChange={e => setPhase(Number(e.target.value))} className="w-1/2 bg-zinc-950 border border-zinc-900 p-4 text-sm text-white outline-none focus:border-rose-500 rounded-lg text-center" />
                    <input type="number" min="1" placeholder="Week" value={week} onChange={e => setWeek(Number(e.target.value))} className="w-1/2 bg-zinc-950 border border-zinc-900 p-4 text-sm text-white outline-none focus:border-rose-500 rounded-lg text-center" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Hard Deadline</label>
                  <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white outline-none focus:border-rose-500 rounded-lg [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Matrix Routing & Uplink</label>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setIsUrgent(!isUrgent)} className={`flex-1 min-w-[120px] py-4 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isUrgent ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
                    <Zap className="w-4 h-4" /> Urgent
                  </button>
                  <button type="button" onClick={() => setIsImportant(!isImportant)} className={`flex-1 min-w-[120px] py-4 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isImportant ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
                    <ShieldCheck className="w-4 h-4" /> Important
                  </button>
                  <button type="button" onClick={() => setRequiresSubmission(!requiresSubmission)} className={`flex-1 min-w-[150px] py-4 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${requiresSubmission ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
                    <Target className="w-4 h-4" /> Require Artifact
                  </button>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="submit" disabled={isDeploying} className="flex-1 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all rounded-lg shadow-xl disabled:opacity-50 flex justify-center items-center">
                  {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : editId ? 'Update Specific Mandate' : 'Launch Mandate Sequence'}
                </button>
                {editId && (
                  <button type="button" onClick={cancelEdit} className="px-6 py-5 bg-zinc-900 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* LIVE MANDATE FEED */}
          <section className="bg-black border border-zinc-900 p-8 rounded-xl mt-8">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-6">
              <List className="w-4 h-4" /> Live Mandate Inventory
            </h2>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {mandates.length > 0 ? (
                mandates.map((m) => (
                  <div key={m.id} className="group flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-900 hover:border-rose-500/30 rounded-lg transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${m.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                          {m.status}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate">
                          Target: {fellows.find(f => f.email === m.email)?.fullName || m.email}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate">{m.title}</h4>
                      <p className="text-[10px] text-zinc-600 mt-1">Phase {m.phase} • Week {m.week}</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => initiateEdit(m)} className="p-2 text-zinc-600 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteMandate(m.id)} className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold italic text-center py-8">
                  No active mandates deployed.
                </p>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}