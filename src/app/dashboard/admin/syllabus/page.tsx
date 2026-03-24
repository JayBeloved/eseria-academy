'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc, where, getDocs } from 'firebase/firestore';
import { BookOpen, Plus, Trash2, ShieldAlert, Target, Layers, Loader2, Zap, User, Edit2 } from 'lucide-react';

export default function SyllabusEngine() {
  const [modules, setModules] = useState<any[]>([]);
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState(1);
  const [order, setOrder] = useState(1);
  const [audience, setAudience] = useState('global');
  const [editId, setEditId] = useState<string | null>(null);

  // 1. DATA SYNC
  useEffect(() => {
    // Fetch Cohort for Audience Dropdown
    const fetchCohort = async () => {
      const q = query(collection(db, 'users'), where('role', '!=', 'admin'));
      const snap = await getDocs(q);
      setFellows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchCohort();

    // Fetch Live Syllabus Modules
    const qSyllabus = query(
      collection(db, 'syllabus_modules'),
      orderBy('phase', 'asc'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(qSyllabus, 
      (snapshot) => {
        setModules(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
      },
      (error) => {
        console.error("Syllabus Fetch Error (Check Index):", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. MODULE DEPLOYMENT
  const handleDeployModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsDeploying(true);
    try {
      if (editId) {
        await updateDoc(doc(db, 'syllabus_modules', editId), {
          title, description, phase: Number(phase), order: Number(order), audience
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, 'syllabus_modules'), {
          title, description, phase: Number(phase), order: Number(order), audience, createdAt: Date.now()
        });
        setOrder(prev => prev + 1); // Auto-increment only on new
      }
      setTitle(''); setDescription('');
    } catch (error) {
      console.error("Module Deployment Failed:", error);
      alert("Failed to deploy module. Check console.");
    } finally {
      setIsDeploying(false);
    }
  };

  const cancelEdit = () => {
    setTitle(''); setDescription(''); setPhase(1); setOrder(1); setAudience('global'); setEditId(null);
  };

  const initiateEdit = (mod: any) => {
    setTitle(mod.title); setDescription(mod.description); setPhase(mod.phase); setOrder(mod.order); setAudience(mod.audience); setEditId(mod.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. DECOMMISSION MODULE
  const handleDeleteModule = async (id: string) => {
    if (confirm("Eradicate this module from the curriculum?")) {
      await deleteDoc(doc(db, 'syllabus_modules', id));
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header className="border-b border-rose-900/50 pb-8 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <BookOpen className="w-3 h-3" /> Curriculum Architecture
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Syllabus <span className="text-rose-500">Engine</span>
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">
            Module Provisioning & Targeting
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: PROVISIONING CONSOLE */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-black border border-zinc-900 p-6 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2 mb-6 relative z-10">
              <Plus className="w-4 h-4" /> Deploy New Module
            </h2>

            <form onSubmit={handleDeployModule} className="space-y-5 relative z-10">
              
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Target Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white uppercase outline-none focus:border-rose-500 transition-colors rounded-lg">
                  <option value="global">Global Broadcast</option>
                  {fellows.map(f => (
                    <option key={f.id} value={f.email}>{f.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Target Phase</label>
                  <input type="number" min="1" max="4" required value={phase} onChange={e => setPhase(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white outline-none focus:border-rose-500 rounded-lg text-center" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Sequence Order</label>
                  <input type="number" min="1" required value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white outline-none focus:border-rose-500 rounded-lg text-center" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Module Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Query Architecture (SELECT/FROM)" className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Technical Context</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Define the technical boundaries..." rows={4} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg resize-none" />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={isDeploying} className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all rounded-lg shadow-xl disabled:opacity-50 flex justify-center items-center">
                  {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? 'Update Module' : 'Deploy Module'}
                </button>
                {editId && (
                  <button type="button" onClick={cancelEdit} className="px-6 py-4 bg-zinc-900 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* COLUMN 2: LIVE CURRICULUM VISUALIZER */}
        <div className="lg:col-span-2">
          <section className="bg-black border border-zinc-900 p-6 md:p-8 rounded-xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-8">
              <Layers className="w-4 h-4" /> Live Curriculum Topology
            </h2>

            <div className="space-y-12">
              {[1, 2, 3, 4].map((phaseNum) => {
                const phaseModules = modules.filter(m => m.phase === phaseNum);
                
                return (
                  <div key={phaseNum} className="relative pl-6 border-l-2 border-zinc-900">
                    {/* Phase Marker */}
                    <div className="absolute -left-[11px] top-0 w-5 h-5 bg-black border-2 border-rose-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    </div>
                    
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">
                      Phase {phaseNum}
                    </h3>

                    {phaseModules.length > 0 ? (
                      <div className="space-y-3">
                        {phaseModules.map((mod) => (
                          <div key={mod.id} className="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-zinc-950/50 border border-zinc-900 hover:border-rose-500/30 rounded-lg transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-sm">
                                  Seq: {mod.order}
                                </span>
                                {mod.audience === 'global' ? (
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                    <Target className="w-3 h-3" /> Core Module
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                    <User className="w-3 h-3" /> Tailored: {fellows.find(f => f.email === mod.audience)?.fullName?.split(' ')[0] || mod.audience}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-tight">{mod.title}</h4>
                              <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">{mod.description}</p>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
                              <button onClick={() => initiateEdit(mod)} className="p-2 text-zinc-600 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteModule(mod.id)} className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold italic py-4">
                        Awaiting Module Deployment.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}