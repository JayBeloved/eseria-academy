'use client';

import React, { useState, useEffect } from 'react';
import { 
    Target, Lock, Unlock, BrainCircuit, Calendar, CheckCircle2, BookOpen, Terminal, Upload, Circle, ExternalLink 
  } from 'lucide-react';

// Mocking the Firestore User Data for Phase 1 testing
const mockFellowData = {
  fullName: "Evwiehor Favour",
  role: "fellow",
  primaryGoal: "Remote Business Operations Analyst",
  selfAssessmentScore: 3,
  billingTier: "graduate_grant", // "executive", "diaspora_partner", "graduate_grant"
  unlockedPhases: [1], // If empty [], the whole dashboard is locked
  currentWeek: 1
};

export default function FellowDashboardShell() {
  const [userData, setUserData] = useState(mockFellowData);
  // Phase 2: Execution State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Domain Friction ERD', completed: true },
    { id: 2, title: 'Execute Data Quality Audit (5 Pillars)', completed: false },
    { id: 3, title: 'Provision GitHub Repository', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    // In production, this will trigger a Firestore update to 'user_progress'
  };
  const [isLoading, setIsLoading] = useState(false); // Set to true when fetching real Firebase data

  // Derived state for the Gated Milestone Protocol
  const isPhase1Unlocked = userData.unlockedPhases.includes(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10 font-sans selection:bg-amber-500/30">
      
      {/* ========================================= */}
      {/* PHASE 1: THE HEADER (Identity & State)    */}
      {/* ========================================= */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">
            <Target className="w-3 h-3" /> Cohort '26 Fellow
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
            Welcome, {userData.fullName.split(' ')[0]}
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            Target Jurisdiction: <span className="text-white font-semibold">{userData.primaryGoal}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-sm shadow-lg">
          {/* Self Assessment Tracker */}
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Self-Assessed Mastery</p>
            <p className="text-2xl font-bold text-amber-500">{userData.selfAssessmentScore} <span className="text-sm text-slate-400">/ 10</span></p>
          </div>
          
          <div className="w-px h-10 bg-slate-800"></div>
          
          {/* Financial Tollgate Status */}
          <div className="flex flex-col items-center justify-center px-2">
            {isPhase1Unlocked ? (
              <div className="flex flex-col items-center text-emerald-500">
                <Unlock className="w-5 h-5 mb-1" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Phase 1 Active</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-rose-500">
                <Lock className="w-5 h-5 mb-1" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Portal Locked</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================= */}
      {/* GATED CONTENT WRAPPER                     */}
      {/* ========================================= */}
      {!isPhase1Unlocked ? (
        <div className="flex flex-col items-center justify-center py-20 border border-rose-900/30 bg-rose-950/10 rounded-sm">
          <Lock className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Jurisdiction Locked</h2>
          <p className="text-slate-400 max-w-md text-center text-sm mb-6">
            Your access to the Eseria Citadel requires clearance of the Phase 1 Financial Tollgate. 
            Please complete your upfront commitment to unlock Week 1-4 modules.
          </p>
          <button className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors">
            Clear Financial Tollgate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========================================= */}
          {/* LEFT COLUMN: The Execution Engine         */}
          {/* ========================================= */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            
            {/* Execution Mandate (To-Dos) */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" /> Weekly Execution Mandate
                </h2>
                <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-xs font-bold text-amber-500 uppercase tracking-widest rounded-sm">
                  Week 1: Relational Logic
                </span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all duration-300 ${task.completed ? 'bg-slate-950/50 border-slate-800/50 opacity-60' : 'bg-slate-800/40 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'}`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Artifact Submission */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
              <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-2 relative z-10">
                <Upload className="w-5 h-5 text-amber-500" /> Artifact Submission
              </h2>
              <p className="text-xs text-slate-400 mb-6 relative z-10">
                Deploy your architectural evidence. Submit your GitHub repository or secure drive link for the Dean's audit.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Artifact logged for Dean's Review."); }}>
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/..." 
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-sm text-white outline-none transition-all"
                />
                <button type="submit" className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-lg shadow-amber-900/20 whitespace-nowrap">
                  Transmit to Dean
                </button>
              </form>
            </section>

          </div>

          {/* ========================================= */}
          {/* RIGHT COLUMN: The Support Systems         */}
          {/* ========================================= */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            
            {/* 1. The Oracle's Counsel (AI Suggestions) */}
            <section className="bg-amber-900/10 border border-amber-500/30 rounded-sm p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-4 relative z-10">
                <BrainCircuit className="w-4 h-4" /> The Oracle's Counsel
              </h2>
              <p className="text-sm text-amber-500/80 leading-relaxed italic relative z-10 border-l-2 border-amber-500/50 pl-4">
                "Based on your current trajectory, focus heavily on Entity Relationship Diagrams (ERDs) this week. Understanding how tables connect is mathematically more critical than SQL syntax right now. Master the architecture."
              </p>
            </section>

            {/* 2. The Chronos (Calendar) */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                <Calendar className="w-4 h-4 text-amber-500" /> The 7-Day Chronos
              </h2>
              <div className="space-y-5">
                <div className="flex justify-between items-center group">
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Friday, 5:00 PM WAT</p>
                    <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">Artifacts Due (GitHub)</p>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-800/50"></div>
                <div className="flex justify-between items-center group">
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Saturday, 10:00 AM WAT</p>
                    <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">Strategy Chamber (Live Sync)</p>
                  </div>
                  <button className="p-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-sm transition-all shadow-sm">
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-500" />
                  </button>
                </div>
              </div>
            </section>

            {/* 3. The Arsenal (Tools & Library) */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                <Terminal className="w-4 h-4 text-amber-500" /> The Arsenal
              </h2>
              <div className="space-y-3">
                <a href="https://livesql.oracle.com/" target="_blank" rel="noreferrer" className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 rounded-sm transition-all group">
                  <span className="text-sm text-slate-300 font-medium group-hover:text-white">Oracle Live SQL</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-500" />
                </a>
                <a href="https://colab.research.google.com/" target="_blank" rel="noreferrer" className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 rounded-sm transition-all group">
                  <span className="text-sm text-slate-300 font-medium group-hover:text-white">Google Colab Engine</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-500" />
                </a>
                <a href="#" className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 rounded-sm transition-all group">
                  <span className="text-sm text-slate-300 font-medium group-hover:text-white">Eseria Knowledge Hub</span>
                  <BookOpen className="w-3 h-3 text-slate-500 group-hover:text-amber-500" />
                </a>
              </div>
            </section>

          </div>
        </div>
      )}
    </div>
  );
}