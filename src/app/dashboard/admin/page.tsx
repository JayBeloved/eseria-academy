'use client';

import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDocs, updateDoc, serverTimestamp, query, where, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, UserPlus, Calendar, Users, Lock, Unlock, 
  CheckCircle2, ExternalLink, Loader2, BrainCircuit, 
  Database, Plus, Trash2, Send, Upload, Terminal, 
  Video, BookOpen, Link , LogOut, X
} from 'lucide-react';
import { signOut } from 'firebase/auth';

export default function AdminDashboard() {
  // 1. Live States
  const [roster, setRoster] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const router = useRouter();
  const [globalQuizUrl ,setGlobalQuizUrl] = useState('');


  // 2. Task Architect State
  const [targetFellowId, setTargetFellowId] = useState('global');
  const [targetWeek, setTargetWeek] = useState(1);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 3. Provisioning Form State
  const [newFellow, setNewFellow] = useState({
    fullName: '',
    email: '',
    primaryGoal: '',
    billingTier: 'executive'
  });

  // ================================
  // Eseria's Counsel Section 
  // ================================
 // New Modal States
 const [activeWhisperId, setActiveWhisperId] = useState<string | null>(null);
 const [isWhisperModalOpen, setIsWhisperModalOpen] = useState(false);
 const [selectedFellow, setSelectedFellow] = useState<any>(null);
 const [whisperText, setWhisperText] = useState('');

 const openWhisperModal = (fellow: any) => {
   setSelectedFellow(fellow);
   setWhisperText(fellow.aiSuggestion || ''); // Pre-fill with existing whisper
   setIsWhisperModalOpen(true);
 };

 const closeWhisperModal = () => {
   setIsWhisperModalOpen(false);
   setSelectedFellow(null);
   setWhisperText('');
 };

 const handleSendWhisper = async (fellowId: string) => {
  if (!whisperText) return;
  
  try {
    const userRef = doc(db, 'users', fellowId);
    await updateDoc(userRef, {
      aiSuggestion: whisperText,
      lastAuditDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    
    alert("Directive Transmitted to Fellow's Oracle.");
    setWhisperText('');
    setActiveWhisperId(null);
    
    // Refresh local roster to show updated "last audit" date if needed
    // (Optional: fetchRoster() or update local state)
  } catch (error) {
    console.error("Whisper Transmission Failure:", error);
  }
};

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout Failure:", error);
    }
  };

  // ==========================================
  // FETCH LIVE ROSTER
  // ==========================================
  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "fellow"));
        const querySnapshot = await getDocs(q);
        const fellows = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRoster(fellows);
      } catch (error) {
        console.error("Error fetching roster:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoster();
  }, []);

  // ... (Keep handleProvision and togglePhaseLock functions for now)

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
      const fellowIndex = roster.findIndex(f => f.id === id);
      if (fellowIndex === -1) return;
      
      const fellow = roster[fellowIndex];
      
      // FIX: Use 'unlockedPhases' and provide a fallback empty array
      const currentPhases = fellow.unlockedPhases || [];
      const hasPhase = currentPhases.includes(phase);
      
      const updatedPhases = hasPhase 
        ? currentPhases.filter((p: number) => p !== phase) 
        : [...currentPhases, phase];

      // Update Firestore securely
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        unlockedPhases: updatedPhases
      });

      // Update local UI state
      const updatedRoster = [...roster];
      updatedRoster[fellowIndex] = { ...fellow, unlockedPhases: updatedPhases };
      setRoster(updatedRoster);

      console.log(`Phase ${phase} ${hasPhase ? 'Locked' : 'Unlocked'} for ${fellow.fullName}`);

    } catch (error) {
      console.error("Tollgate Override Failed:", error);
      alert("Failed to update financial tollgate. Check permissions.");
    }
  };

  const handleReview = async (submissionId: string, status: 'approved' | 'revision_requested') => {
    try {
      const subRef = doc(db, 'submissions', submissionId);
      await updateDoc(subRef, { status });
      // Logic to update the local list and notify the fellow
      alert(`Submission marked as ${status}`);
    } catch (error) {
      console.error("Audit Failure:", error);
    }
  };

  // ==========================================
  // TASK DEPLOYMENT ENGINE
  // ==========================================
  const deployTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
  
    try {
      if (targetFellowId === 'global') {
        const weekId = `week_${targetWeek}`;
        const weekRef = doc(db, 'weekly_mandates', weekId);
        
        // Fetch current tasks first to append (or use arrayUnion)
        const weekSnap = await getDoc(weekRef);
        const existingData = weekSnap.exists() ? weekSnap.data() : { tasks: [] };
  
        await setDoc(weekRef, {
          ...existingData,
          quizUrl: globalQuizUrl || existingData.quizUrl || '', // Update URL if provided
          tasks: [
            ...existingData.tasks, 
            { id: Date.now().toString(), title: newTaskTitle, completed: false, category: 'global' }
          ]
        }, { merge: true });
  
        alert(`Global Mandate Deployed to Week ${targetWeek}`);
      } else {
        // PERSONAL DEPLOYMENT logic remains the same
        const userRef = doc(db, 'users', targetFellowId);
        const fellow = roster.find(f => f.id === targetFellowId);
        const existingTasks = fellow?.personalTasks || [];
        
        await updateDoc(userRef, {
          personalTasks: [...existingTasks, { id: Date.now().toString(), title: newTaskTitle, completed: false, category: 'personal' }]
        });
        alert(`Personal Mandate Deployed to ${fellow.fullName}`);
      }
      setNewTaskTitle('');
    } catch (error) {
      console.error("Deployment Error:", error);
    }
  };

  // ================================
  // Chronos engine (Calendar Creator)
  // ================================
  const [newEvent, setNewEvent] = useState({ title: '', date: '', audience: 'global' });

  const broadcastEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(collection(db, 'calendar_events')), {
        ...newEvent,
        createdAt: serverTimestamp(),
        // If it's for a specific fellow, we use their sanitized ID/UID
      });
      alert(`Chronos Mandate Broadcast: ${newEvent.title}`);
      setNewEvent({ title: '', date: '', audience: 'global' });
    } catch (err) {
      console.error("Chronos Failure:", err);
    }
  };

  // ========================================
  // Handle and Review Assignment submissions
  // ========================================
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      setSubmissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSubmissions();
  }, []);

  // ==================================
  // Resource Hub
  // ===================================
  const [isDeployingResource, setIsDeployingResource] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    url: '',
    audience: 'global'
  });

  const handleDeployResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeployingResource(true);
    
    try {
      if (resourceForm.audience === 'global') {
        // 1. Global Arsenal: Shared by all Fellows
        const resourceRef = doc(collection(db, 'global_resources'));
        await setDoc(resourceRef, {
          ...resourceForm,
          createdAt: serverTimestamp()
        });
      } else {
        // 2. Personal Arsenal: Injected into a specific Fellow's profile
        const userRef = doc(db, 'users', resourceForm.audience);
        const fellow = roster.find(f => f.id === resourceForm.audience);
        const existingResources = fellow.personalResources || [];
        
        await updateDoc(userRef, {
          personalResources: [...existingResources, { 
            id: Date.now(), 
            title: resourceForm.title, 
            url: resourceForm.url 
          }]
        });
      }
      
      alert(`Resource "${resourceForm.title}" deployed to the Arsenal.`);
      setResourceForm({ title: '', url: '', audience: 'global' });
    } catch (error) {
      console.error("Resource Deployment Failed:", error);
    } finally {
      setIsDeployingResource(false);
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
          <div className="w-px h-10 bg-slate-800"></div>
        {/* Add logout button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all group"
        >
          <LogOut className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Terminate Session
        </button>
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
                  <option value="graduate_grant">Graduate Grant (₦50k/Phase)</option>
                </select>
              </div>

              <button type="submit" disabled={isProvisioning} className="w-full h-12 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isProvisioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Inject into Database
              </button>
            </form>
          </section>
          {/* 2. THE ARSENAL FORGE (New Resource UI) */}
          <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
              <Link className="w-5 h-5 text-amber-500" /> Arsenal Forge
            </h2>
            
            <form onSubmit={handleDeployResource} className="space-y-5 relative z-10">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Resource Title</label>
                <input 
                  type="text" 
                  required 
                  value={resourceForm.title}
                  onChange={e => setResourceForm({...resourceForm, title: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" 
                  placeholder="e.g., Advanced SQL Cheat Sheet" 
                />
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Secure URL</label>
                <input 
                  type="url" 
                  required 
                  value={resourceForm.url}
                  onChange={e => setResourceForm({...resourceForm, url: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none" 
                  placeholder="https://notion.so/..." 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Audience</label>
                <select 
                  value={resourceForm.audience}
                  onChange={e => setResourceForm({...resourceForm, audience: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-sm p-3 text-sm text-white outline-none appearance-none"
                >
                  <option value="global">Global (All Fellows)</option>
                  {roster.map(fellow => (
                    <option key={fellow.id} value={fellow.id}>Fellow: {fellow.fullName}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isDeployingResource} 
                className="w-full h-12 mt-4 bg-slate-950 border border-amber-500/50 hover:bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2"
              >
                {isDeployingResource ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Deploy to Arsenal
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
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {roster.map((fellow) => (
                    <tr key={fellow.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-4">
                        {/* Use fullName as defined in our provision script */}
                        <p className="text-sm font-bold text-white">{fellow.fullName || 'Unnamed Fellow'}</p>
                        <p className="text-xs text-slate-500">{fellow.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-slate-950 border border-slate-700 text-slate-300 text-[9px] uppercase tracking-widest rounded-sm">
                          {(fellow.billingTier || 'executive').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          /* Update to use 'unlockedPhases' */
                          onClick={() => togglePhaseLock(fellow.id, 1)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${fellow.unlockedPhases?.includes(1) ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20' : 'bg-slate-950 text-slate-500 border border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20'}`}
                        >
                          {fellow.unlockedPhases?.includes(1) ? (
                            <><Unlock className="w-3 h-3" /> P1 Open</>
                          ) : (
                            <><Lock className="w-3 h-3" /> P1 Locked</>
                          )}
                        </button>
                      </td>
                      <td className="py-4 pl-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                          {/* WHISPER TRIGGER */}
                          <button 
                            onClick={() => openWhisperModal(fellow)} // Simple, one-line trigger
                            className="p-2 rounded-sm border bg-slate-950 border-slate-800 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 transition-all"
                            title="Forge Directive"
                          >
                            <BrainCircuit className="w-4 h-4" />
                          </button>
                          
                          <button className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors">
                            Review ({fellow.artifactsCount || 0}) <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
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
          {/* Submissions Review */}
          {/* ========================================= */}
          <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl mt-8">
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Database className="w-5 h-5 text-amber-500" /> Artifact Audit Log
            </h2>
            <div className="space-y-4">
              {submissions.length === 0 && <p className="text-xs text-slate-500 uppercase italic">No pending artifacts in the queue.</p>}
              {submissions.map((sub) => (
              <div key={sub.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-950 border border-slate-800 rounded-sm group hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-4">
                  {/* DYNAMIC ICON BASED ON TYPE */}
                  <div className="p-2 bg-slate-900 rounded-sm border border-slate-800">
                    {sub.artifactType === 'github' && <Terminal className="w-4 h-4 text-amber-500" />}
                    {sub.artifactType === 'loom' && <Video className="w-4 h-4 text-rose-500" />}
                    {sub.artifactType === 'drive' && <Database className="w-4 h-4 text-emerald-500" />}
                    {sub.artifactType === 'notion' && <BookOpen className="w-4 h-4 text-indigo-500" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-bold text-white">{sub.fellowName}</p>
                      <span className="text-[8px] px-2 py-0.5 bg-slate-800 text-slate-500 uppercase font-bold tracking-widest rounded-sm border border-slate-700">
                        {sub.artifactType}
                      </span>
                    </div>
                    <a 
                      href={sub.artifactUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
                    >
                      Audit Artifact <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => handleReview(sub.id, 'approved')} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-emerald-500 hover:text-white transition-all">Approve</button>
                    <button onClick={() => handleReview(sub.id, 'revision_requested')} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-rose-500 hover:text-white transition-all">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        {/* ========================================= */}
        {/* THE TASK ARCHITECT (Global & Personal)    */}
        {/* ========================================= */}
        <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden mt-8">
          <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <Send className="w-5 h-5 text-amber-500" /> Task Architect
          </h2>
          
          <form onSubmit={deployTask} className="space-y-4">
          {/* ROW 1: JURISDICTION & METADATA */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Target Jurisdiction</label>
              <select 
                value={targetFellowId} 
                onChange={(e) => setTargetFellowId(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-sm p-3 text-sm text-white outline-none focus:border-amber-500 transition-all"
              >
                <option value="global">Global (All Fellows)</option>
                {roster.map(fellow => (
                  <option key={fellow.id} value={fellow.id}>Fellow: {fellow.fullName}</option>
                ))}
              </select>
            </div>

            {targetFellowId === 'global' && (
              <>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Target Week</label>
                  <input 
                    type="number" 
                    value={targetWeek} 
                    onChange={(e) => setTargetWeek(parseInt(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-sm p-3 text-sm text-white outline-none focus:border-amber-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">NotebookLM Quiz URL</label>
                  <input 
                    type="url" 
                    value={globalQuizUrl}
                    onChange={(e) => setGlobalQuizUrl(e.target.value)}
                    placeholder="https://notebooklm.google.com/..." 
                    className="w-full mt-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-sm p-3 text-sm text-white outline-none" 
                  />
                </div>
              </>
            )}
          </div>

          {/* ROW 2: THE MANDATE DESCRIPTION */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mandate Description</label>
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-sm p-3 text-sm text-white outline-none focus:border-amber-500 transition-all" 
                placeholder={targetFellowId === 'global' ? "e.g., Complete Week 1 Relational Logic Audit" : "e.g., Pst Kelly: Audit the WASH borehole dataset"}
              />
            </div>
            <button 
              type="submit" 
              className="h-[46px] px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-all shadow-lg flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Deploy</span>
            </button>
          </div>
        </form>
        </section>
        {/* ========================================= */}
        {/* THE CHRONOS ENGINE (Calendar Creator)     */}
        {/* ========================================= */}
        <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden mt-8">
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Calendar className="w-5 h-5 text-amber-500" /> The Chronos Engine
            </h2>
          <form onSubmit={broadcastEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Event Title</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  required 
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-sm p-3 text-sm text-white outline-none focus:border-amber-500" 
                  placeholder="Strategy Chamber / 1-on-1 Review" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Date & Time (WAT)</label>
                <input 
                  type="datetime-local" 
                  value={newEvent.date}
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  required 
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-sm p-3 text-sm text-white outline-none [color-scheme:dark]" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Target Audience</label>
                <select 
                  value={newEvent.audience}
                  onChange={e => setNewEvent({...newEvent, audience: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-sm p-3 text-sm text-white outline-none appearance-none"
                >
                  <option value="global">Global (All Fellows)</option>
                  {roster.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                </select>
              </div>
              <button type="submit" className="md:col-span-2 h-12 bg-slate-950 border border-amber-500/50 hover:bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Broadcast to Chronos
              </button>
          </form>
        </section>
        {/* ========================================= */}
        {/* THE ASSESSMENT FORGE (Quiz Generator)     */}
        {/* ========================================= */}
        {/* <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden mt-8">
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
            </div>*/}

            {/* Dynamic Question Block (MVP: Just 1 question for UI layout) */}
            {/* <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-4">
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
        </section> */}
        </div>

      </div>
      {/* ========================================= */}
      {/* THE ORACLE WHISPER MODAL (High-Fidelity)  */}
      {/* ========================================= */}
      {isWhisperModalOpen && selectedFellow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeWhisperModal}></div>
          
          {/* Modal Box */}
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center relative z-10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-amber-500" /> Strategic Oracle Whisper
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
                  Targeting Fellow: <span className="text-amber-500">{selectedFellow.fullName}</span>
                </p>
              </div>
              <button onClick={closeWhisperModal} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Directive Payload
                </label>
                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">
                  Real-time Sync Active
                </span>
              </div>
              
              <textarea 
                value={whisperText}
                onChange={(e) => setWhisperText(e.target.value)}
                autoFocus
                className="w-full h-64 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-sm p-4 text-sm text-slate-200 outline-none leading-relaxed resize-none shadow-inner transition-all"
                placeholder="Enter the strategic directive for this Fellow's trajectory..."
              />
              
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-sm">
                <p className="text-[10px] text-amber-500/70 leading-relaxed italic">
                  <strong>Principal's Reminder:</strong> This message will appear instantly in the Fellow's "Oracle's Counsel" section. Be direct, analytical, and prescriptive.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-4 relative z-10">
              <button onClick={closeWhisperModal} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                Abort
              </button>
              <button 
                onClick={() => handleSendWhisper(selectedFellow.id)}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Transmit Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}