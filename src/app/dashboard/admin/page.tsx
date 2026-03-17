'use client';

import { collection, doc, setDoc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Adjust this path if your config is elsewhere

import React, { useState } from 'react';
import { 
  ShieldCheck, UserPlus, Calendar, Users, Lock, Unlock, CheckCircle2, 
  ExternalLink, Loader2, BrainCircuit, Database 
} from 'lucide-react';

// Mock Roster Data for UI Testing
const mockRoster = [
  { id: '1', name: 'Kelly Doe', email: 'odkellymsc886@gmail.com', tier: 'executive', phases: [1], artifacts: 1 },
  { id: '2', name: 'UK Partner 1', email: 'uk.partner@gmail.com', tier: 'diaspora_partner', phases: [], artifacts: 0 },
  { id: '3', name: 'Evwiehor Favour', email: 'favour@gmail.com', tier: 'graduate_grant', phases: [1], artifacts: 2 },
];

export default function AdminDashboard() {
  const [roster, setRoster] = useState(mockRoster);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Provisioning Form State
  const [newFellow, setNewFellow] = useState({
    fullName: '',
    email: '',
    primaryGoal: '',
    billingTier: 'executive'
  });

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);
    
    try {
      // 1. Create a clean ID based on their email (removes special characters)
      const sanitizedId = newFellow.email.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // 2. Define the exact Sidonian Schema for a new Fellow
      const fellowData = {
        uid: sanitizedId, // We use this until they Auth, then we merge
        fullName: newFellow.fullName,
        email: newFellow.email.toLowerCase(),
        role: "fellow",
        primaryGoal: newFellow.primaryGoal,
        billingTier: newFellow.billingTier,
        unlockedPhases: [], // Locked by default
        currentWeek: 1,
        onboardingCompleted: false,
        artifactsCount: 0,
        createdAt: serverTimestamp()
      };

      // 3. Inject directly into Firestore 'users' collection
      await setDoc(doc(db, 'users', sanitizedId), fellowData);

      // 4. Update the local UI state so you see it instantly without refreshing
      setRoster([...roster, { 
        id: sanitizedId, 
        name: fellowData.fullName, 
        email: fellowData.email, 
        tier: fellowData.billingTier, 
        phases: [], 
        artifacts: 0 
      }]);

      // 5. Reset the Provisioning Form
      setNewFellow({ fullName: '', email: '', primaryGoal: '', billingTier: 'executive' });
      alert("Fellow Provisioned. The database has accepted the injection.");

    } catch (error) {
      console.error("Database Injection Failed:", error);
      alert("Transmission failed. Check console for terminal errors.");
    } finally {
      setIsProvisioning(false);
    }
  };

  const togglePhaseLock = async (id: string, phase: number) => {
    try {
      // Find the fellow in the current local state
      const fellowIndex = roster.findIndex(f => f.id === id);
      if (fellowIndex === -1) return;
      
      const fellow = roster[fellowIndex];
      const hasPhase = fellow.phases.includes(phase);
      
      // Toggle logic: If they have it, remove it (lock). If they don't, add it (unlock).
      const updatedPhases = hasPhase 
        ? fellow.phases.filter(p => p !== phase) 
        : [...fellow.phases, phase];

      // Update Firestore securely
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        unlockedPhases: updatedPhases
      });

      // Update local UI state
      const updatedRoster = [...roster];
      updatedRoster[fellowIndex] = { ...fellow, phases: updatedPhases };
      setRoster(updatedRoster);

    } catch (error) {
      console.error("Tollgate Override Failed:", error);
      alert("Failed to update financial tollgate. Check permissions.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10 font-sans selection:bg-amber-500/30">
      
      {/* HEADER: The Dean's Identity */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3 h-3" /> Eseria Dean Command
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
            Central Architecture
          </h1>
          <p className="text-slate-400 mt-2">Manage Fellow provisioning, financial tollgates, and artifact audits.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-sm">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Cohort</p>
            <p className="text-2xl font-bold text-amber-500">{roster.length} <span className="text-sm text-slate-400">Fellows</span></p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Provisioning Engine */}
        <div className="xl:col-span-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
              <UserPlus className="w-5 h-5 text-amber-500" /> Provision Fellow
            </h2>
            
            <form onSubmit={handleProvision} className="space-y-5 relative z-10">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Full Name</label>
                <input type="text" required value={newFellow.fullName} onChange={e => setNewFellow({...newFellow, fullName: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="Kelly Doe" />
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Encrypted Email</label>
                <input type="email" required value={newFellow.email} onChange={e => setNewFellow({...newFellow, email: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="kelly@domain.com" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Target Jurisdiction</label>
                <input type="text" required value={newFellow.primaryGoal} onChange={e => setNewFellow({...newFellow, primaryGoal: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="Senior Data Analyst" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Financial Tier</label>
                <select value={newFellow.billingTier} onChange={e => setNewFellow({...newFellow, billingTier: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none appearance-none">
                  <option value="executive">Executive Pivot (₦75k/Phase)</option>
                  <option value="diaspora_partner">Sovereign Partnership (£150/Phase)</option>
                  <option value="graduate_grant">Graduate Grant (₦50k/Phase)</option>
                </select>
              </div>

              <button type="submit" disabled={isProvisioning} className="w-full h-12 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isProvisioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Inject into Database
              </button>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: The Command Roster */}
        <div className="xl:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl">
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Users className="w-5 h-5 text-amber-500" /> The Active Roster
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <th className="pb-3 pr-4">Fellow Identity</th>
                    <th className="pb-3 px-4">Billing Tier</th>
                    <th className="pb-3 px-4">Tollgate Control</th>
                    <th className="pb-3 pl-4 text-right">Artifacts</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((fellow) => (
                    <tr key={fellow.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="text-sm font-bold text-white">{fellow.name}</p>
                        <p className="text-xs text-slate-500">{fellow.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-slate-950 border border-slate-700 text-slate-300 text-[9px] uppercase tracking-widest rounded-sm">
                          {fellow.tier.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {/* Tollgate Toggle Button */}
                        <button 
                          onClick={() => togglePhaseLock(fellow.id, 1)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${fellow.phases.includes(1) ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20' : 'bg-slate-950 text-slate-500 border border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20'}`}
                        >
                          {fellow.phases.includes(1) ? (
                            <><Unlock className="w-3 h-3" /> P1 Open</>
                          ) : (
                            <><Lock className="w-3 h-3" /> P1 Locked</>
                          )}
                        </button>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors">
                          Review ({fellow.artifacts}) <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {roster.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-slate-500 uppercase tracking-widest">
                        Roster is currently empty. Provision fellows to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {/* ========================================= */}
            {/* THE CHRONOS ENGINE (Calendar Creator)     */}
            {/* ========================================= */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden mt-8">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
                <Calendar className="w-5 h-5 text-amber-500" /> The Chronos Engine
            </h2>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Event pushed to Chronos network."); }} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                
                <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Event Title / Mandate</label>
                <input type="text" required className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="e.g., Week 2 Strategy Chamber (Live)" />
                </div>

                <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Date & Time (WAT)</label>
                <input type="datetime-local" required className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none [color-scheme:dark]" />
                </div>

                <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Audience Jurisdiction</label>
                <select className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none appearance-none">
                    <option value="global">Global (Entire Cohort)</option>
                    {/* In production, map through your roster to populate specific Fellows */}
                    <option value="uid_kelly">1-on-1: Kelly Doe</option>
                    <option value="uid_favour">1-on-1: Evwiehor Favour</option>
                </select>
                </div>

                <button type="submit" className="md:col-span-2 h-12 mt-2 bg-slate-950 border border-amber-500/50 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Broadcast to Chronos
                </button>
            </form>
        </section>
        {/* ========================================= */}
        {/* THE ASSESSMENT FORGE (Quiz Generator)     */}
        {/* ========================================= */}
        <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-800 pb-4 relative z-10">
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-500" /> Assessment Forge
            </h2>
            <button type="button" className="mt-4 md:mt-0 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-2">
            <BrainCircuit className="w-3 h-3" /> Initialize Gemini Generation (Coming Soon)
            </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); alert("Assessment deployed to Fellows."); }} className="space-y-6 relative z-10">
            
            <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Assessment Topic</label>
            <input type="text" required className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="e.g., SQL Joins & Relational Logic" />
            </div>

            {/* Dynamic Question Block (MVP: Just 1 question for UI layout) */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Question 1</label>
            </div>
            <input type="text" required className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="What is the primary difference between a LEFT JOIN and an INNER JOIN?" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" required className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="Option A (Correct Answer)" />
                <input type="text" required className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="Option B" />
                <input type="text" required className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="Option C" />
                <input type="text" required className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" placeholder="Option D" />
            </div>
            </div>

            <div className="flex gap-4">
            <button type="button" className="flex-1 h-12 bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
                + Add Question
            </button>
            <button type="submit" className="flex-1 h-12 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-lg">
                Deploy Assessment
            </button>
            </div>
        </form>
        </section>
        </div>

      </div>
    </div>
  );
}