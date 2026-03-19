'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { 
  Target, Lock, Unlock, BrainCircuit, Calendar, CheckCircle2, BookOpen, Terminal, Upload, Circle, ExternalLink, Loader2, LogOut, 
  Video, Loom, Database
} from 'lucide-react';

export default function FellowDashboardShell() {
  const router = useRouter();
  // ==========================================
  // 1. ALL HOOKS MUST BE DECLARED HERE AT THE TOP
  // ==========================================
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Execution Engine State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Domain Friction ERD', completed: false },
    { id: 2, title: 'Execute Data Quality Audit (5 Pillars)', completed: false },
    { id: 3, title: 'Provision GitHub Repository', completed: false },
  ]);

  // Logout function
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error("Logout Failure:", error);
      }
    };

  // Profile Setup State (MOVED UP HERE)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    weeklyCommitmentHours: 10,
    deepWorkDays: [] as string[],
    peakFocusTime: 'Morning (4 AM - 8 AM)'
  });

  // For Resources Hub
  const [resources, setResources] = useState<any[]>([]);

  // For calendar events
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [artifactType, setArtifactType] = useState('github');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword || newPassword.length < 8) {
      alert("Passwords must match and be at least 8 characters.");
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      // Firebase Auth method to update password for the currently logged-in user
      await updatePassword(auth.currentUser!, newPassword);
      alert("Access Code Rotated Successfully.");
    } catch (error) {
      console.error("Security Rotation Failed:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // ==========================================
  // 2. THE USE-EFFECT (Firebase Auth Listener)
  // ==========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Generate the Sanity-Checked ID (Matches Admin Provisioning Logic)
          const sanitizedId = user.email 
            ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '') 
            : user.uid;
          
          // 2. Query the Vault
          const userDocRef = doc(db, 'users', sanitizedId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            
            // 3. Authority Check: If you are the Dean, go to the War Room
            if (data.role === 'admin') {
              router.push('/dashboard/admin');
              return;
            }

            // 4. Identity Verified: Hydrate the UI
            setUserData(data);
          } else {
            // Failsafe: No provisioned profile exists in the database
            console.error("Jurisdictional Error: Profile not found in Roster.");
            router.push('/login');
          }
        } catch (error) {
          console.error("Critical Auth Error:", error);
          router.push('/login');
        } finally {
          // 5. Release the UI Lock
          setIsLoading(false);
        }
      } else {
        // No Auth Session found: Redirect to the Gate
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // =================================
  // 2b. Use Effect for Resources, Syllabus and Calendar Events
  // ====================================
  useEffect(() => {
    const fetchCitadelData = async () => {
      if (!userData) return;

      try {
        // --- 1. Fetch Chronos Events (Global + Personal) ---
        const eventsRef = collection(db, 'calendar_events');
        // We fetch all and filter client-side for simplicity in this small cohort
        const eventsSnap = await getDocs(eventsRef);
        const filteredEvents = eventsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((event: any) => 
            event.audience === 'global' || 
            event.audience === (auth.currentUser?.email?.toLowerCase().replace(/[^a-z0-9]/g, '') || auth.currentUser?.uid)
          )
          // Sort by date (ascending)
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setCalendarEvents(filteredEvents);

        // --- 2. Fetch Global Resources ---
        const globalResSnap = await getDocs(collection(db, 'global_resources'));
        const globalRes = globalResSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(), 
          category: 'global' 
        }));

        // --- 3. Extract Personal Resources from userData ---
        const personalRes = (userData.personalResources || []).map((res: any) => ({
          ...res,
          category: 'personal'
        }));

        // --- 4. Merge the Arsenal ---
        setResources([...globalRes, ...personalRes]);

        // --- 5. (Existing Syllabus Logic) ---
        const weekId = `week_${userData.currentWeek || 1}`;
        const mandateRef = doc(db, 'weekly_mandates', weekId);
        const mandateSnap = await getDoc(mandateRef);
        
        let globalTasks = [];
        if (mandateSnap.exists()) globalTasks = mandateSnap.data().tasks || [];
        
        const combinedTasks = [
          ...globalTasks.map((t: any) => ({ ...t, category: 'global' })),
          ...(userData.personalTasks || []).map((t: any) => ({ ...t, category: 'personal' }))
        ];
        setTasks(combinedTasks);
        
      } catch (error) {
        console.error("Chronos Sync Failure:", error);
      }
    };

    fetchCitadelData();
  }, [userData]);

  // ==========================================
  // 3. HELPER FUNCTIONS (Logic Engines)
  // ==========================================
  
  // Handles checking/unchecking tasks in the Execution Engine
  const toggleTask = (id: number) => {
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  // Handles selecting/deselecting deep work days in the Profile Form
  const toggleDay = (day: string) => {
    setProfileForm(prev => ({
      ...prev,
      deepWorkDays: prev.deepWorkDays.includes(day) 
        ? prev.deepWorkDays.filter(d => d !== day)
        : [...prev.deepWorkDays, day]
    }));
  };

  // Handles the Firestore injection for the Operational Profile
  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.deepWorkDays.length === 0) return;
    
    setIsUpdatingProfile(true);
    try {
      // Use the same sanitized ID logic used in the login/provisioning
      const sanitizedId = auth.currentUser?.email 
        ? auth.currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, '') 
        : auth.currentUser?.uid;

      if (!sanitizedId) throw new Error("No authenticated ID found");

      const userRef = doc(db, 'users', sanitizedId);
      
      const profileData = {
        ...profileForm,
        aiPersona: "Standard / Analytical", // Default for Cohort '26
        setupTimestamp: new Date().toISOString()
      };

      await updateDoc(userRef, {
        operationalProfile: profileData,
        onboardingCompleted: true // Marks the fellow as fully initiated
      });
      
      // Update local state so the UI reacts instantly
      setUserData((prev: any) => ({ ...prev, operationalProfile: profileData }));
      
    } catch (error) {
      console.error("Critical Failure in Profile Calibration:", error);
      alert("System Calibration Failed. Check the terminal logs.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // =========================
  // Assignment submission
  // ============================

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const url = (form.elements.namedItem('artifactUrl') as HTMLInputElement).value;

    if (!url) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'submissions'), {
        uid: auth.currentUser?.uid,
        fellowName: userData.fullName,
        weekNumber: userData.currentWeek || 1,
        artifactUrl: url,
        artifactType: artifactType, // Added type tracking
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
      
      alert("Artifact Transmitted. The Dean has been notified.");
      form.reset();
    } catch (error) {
      console.error("Transmission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 4. EARLY RETURNS (Must be below all Hooks)
  // ==========================================
  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold animate-pulse">
          Verifying Jurisdictional Clearance...
        </p>
      </div>
    );
  }

  // Derived state (Safe to put here because they are not Hooks)
  const unlockedPhases = userData.unlockedPhases || [];
  const isPhase1Unlocked = unlockedPhases.includes(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10 font-sans selection:bg-amber-500/30">
      
      {/* ========================================= */}
      {/* PHASE 1: THE HEADER (Live Data)           */}
      {/* ========================================= */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">
            <Target className="w-3 h-3" /> Cohort '26 Fellow
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
            Welcome, {userData.fullName?.split(' ')[0] || 'Fellow'}
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            Target Jurisdiction: <span className="text-white font-semibold">{userData.primaryGoal || 'Pending Declaration'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-sm shadow-lg">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Self-Assessed Mastery</p>
            <p className="text-2xl font-bold text-amber-500">{userData.selfAssessmentScore || 0} <span className="text-sm text-slate-400">/ 10</span></p>
          </div>
          
          <div className="w-px h-10 bg-slate-800"></div>
          
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

      {/* ========================================= */}
      {/* GATED CONTENT WRAPPER                     */}
      {/* ========================================= */}
      {!isPhase1Unlocked ? (
        <div className="flex flex-col items-center justify-center py-20 border border-rose-900/30 bg-rose-950/10 rounded-sm">
          <Lock className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Jurisdiction Locked</h2>
          <p className="text-slate-400 max-w-md text-center text-sm mb-6">
            Your access to the Eseria Academy requires clearance of the Phase 1 Financial Tollgate. 
            Please complete your upfront commitment to unlock Week 1-4 modules.
          </p>
          <button className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors">
            Clear Financial Tollgate
          </button>
        </div>
      ) : (
        /* ... THE REST OF THE GRID REMAINS EXACTLY THE SAME AS YESTERDAY ... */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========================================= */}
          {/* LEFT COLUMN: THE EXECUTION ENGINE         */}
          {/* ========================================= */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            
            {/* 1. Weekly Execution Mandate (Hybrid Tasks) */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4 relative z-10">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" /> Weekly Execution Mandate
                </h2>
                <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-500 uppercase tracking-widest rounded-sm">
                  Week {userData.currentWeek || 1}: {userData.weeklyTheme || 'Foundations'}
                </span>
              </div>

              <div className="space-y-3 relative z-10">
                {tasks.length > 0 ? (
                  tasks.map((task: any) => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all duration-300 ${task.completed ? 'bg-slate-950/50 border-slate-800/50 opacity-60' : 'bg-slate-800/40 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'}`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        {task.category === 'personal' && (
                          <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[8px] font-bold uppercase tracking-widest rounded-full">
                            Tailored
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-10 uppercase tracking-widest italic">
                    No mandates deployed for this jurisdiction yet.
                  </p>
                )}
              </div>
            </section>

            {/* Artifact Submission & Rules */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
              <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 mb-4 relative z-10">
                <Upload className="w-5 h-5 text-amber-500" /> Artifact Submission
              </h2>

              {/* THE RULES OF ENGAGEMENT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-950 border border-slate-800/50 rounded-sm relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Code & SQL</p>
                  <p className="text-[9px] text-slate-500 leading-tight">Strictly GitHub Repositories. No raw files.</p>
                </div>
                <div className="space-y-1 border-l border-slate-800/50 pl-4">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Visuals & Docs</p>
                  <p className="text-[9px] text-slate-500 leading-tight">Google Drive, Notion, or NovyPro links.</p>
                </div>
                <div className="space-y-1 border-l border-slate-800/50 pl-4">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">The Loom Rule</p>
                  <p className="text-[9px] text-slate-500 leading-tight">Complex architecture requires a 2-min Loom walkthrough.</p>
                </div>
              </div>
              
              <form className="space-y-4 relative z-10" onSubmit={handleSubmitArtifact}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* TYPE DROPDOWN */}
                  <select 
                    value={artifactType}
                    onChange={(e) => setArtifactType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest p-3 rounded-sm outline-none focus:border-amber-500 appearance-none min-w-[150px]"
                  >
                    <option value="github">GitHub Repo</option>
                    <option value="drive">Google Drive / PDF</option>
                    <option value="loom">Loom / Video</option>
                    <option value="notion">Notion / Report</option>
                  </select>

                  <input 
                    name="artifactUrl"
                    type="url" 
                    required
                    placeholder="Enter Secure Link..." 
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-sm text-white outline-none"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transmit to Dean'}
                </button>
              </form>
            </section>
          </div>

          {/* ========================================= */}
          {/* RIGHT COLUMN: THE SUPPORT SYSTEMS         */}
          {/* ========================================= */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            
            {/* 1. The Oracle's Counsel (Live Dean's Advice) */}
            <section className="bg-amber-900/10 border border-amber-500/30 rounded-sm p-6 shadow-xl relative overflow-hidden animate-in fade-in duration-1000">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-4 relative z-10">
                <BrainCircuit className="w-4 h-4" /> Eseria's Counsel
              </h2>
              <div className="relative z-10 border-l-2 border-amber-500/50 pl-4">
                <p className="text-sm text-amber-500/80 leading-relaxed italic">
                  {/* Fetches the specific 'aiSuggestion' field from the user document */}
                  {userData.aiSuggestion || "Eseria is currently analyzing your trajectory. Execute your weekly mandates to generate a personalized insight."}
                </p>
                {userData.lastAuditDate && (
                  <p className="text-[8px] uppercase tracking-widest text-amber-500/40 mt-3 font-bold">
                    Last Architectural Audit: {userData.lastAuditDate}
                  </p>
                )}
              </div>
            </section>

            {/* 2. The Chronos (Live 7-Day Schedule) */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
                <Calendar className="w-4 h-4 text-amber-500" /> The 7-Day Chronos
              </h2>
              
              <div className="space-y-5 relative z-10">
                {calendarEvents.length > 0 ? (
                  calendarEvents.map((event: any) => {
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                    return (
                      <div key={event.id} className="group">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
                              {formattedDate} @ {formattedTime} WAT
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                                {event.title}
                              </p>
                              {event.audience !== 'global' && (
                                <span className="text-[7px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full uppercase tracking-tighter">
                                  1-on-1
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="p-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-sm transition-all shadow-sm">
                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-500" />
                          </button>
                        </div>
                        <div className="w-full h-px bg-slate-800/50 mt-4 last:hidden"></div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest text-center py-4 italic">
                    No mandates scheduled in Chronos.
                  </p>
                )}
              </div>
            </section>

            {/* 3. The Arsenal (Live Weapons Hub) */}
            <section className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
                <Terminal className="w-4 h-4 text-amber-500" /> The Arsenal
              </h2>
              
              <div className="space-y-3 relative z-10">
                {resources.length > 0 ? (
                  resources.map((res: any, index: number) => (
                    <a 
                      key={res.id || index}
                      href={res.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`flex justify-between items-center p-3 bg-slate-950/50 border transition-all group rounded-sm ${res.category === 'personal' ? 'border-indigo-500/30 hover:border-indigo-500/60' : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-300 group-hover:text-white flex items-center gap-2">
                          {res.title}
                          {res.category === 'personal' && (
                            <span className="text-[7px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full uppercase tracking-tighter">
                              Custom Forge
                            </span>
                          )}
                        </span>
                        <span className="text-[9px] text-slate-600 truncate max-w-[150px]">{res.url}</span>
                      </div>
                      <ExternalLink className={`w-3 h-3 transition-colors ${res.category === 'personal' ? 'text-indigo-500' : 'text-slate-500 group-hover:text-amber-500'}`} />
                    </a>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest text-center py-4 italic">
                    Arsenal currently empty. Awaiting Dean's provisioning.
                  </p>
                )}
              </div>
            </section>

            {/* 4. The Assessment Portal (NotebookLM) */}
            {userData.currentWeekQuizUrl && (
              <section className="bg-indigo-900/10 border border-indigo-500/30 rounded-sm p-6 shadow-xl relative overflow-hidden mt-8 animate-pulse-slow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-4 relative z-10">
                  <BrainCircuit className="w-4 h-4" /> Weekly Assessment Active
                </h2>
                <p className="text-xs text-indigo-300/80 leading-relaxed mb-6 relative z-10">
                  Your Week {userData.currentWeek} assessment is ready. This is a non-linear probe into your architectural logic.
                </p>
                <a 
                  href={userData.currentWeekQuizUrl} 
                  target="_blank" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Launch NotebookLM Probe <ExternalLink className="w-3 h-3" />
                </a>
              </section>
            )}

          </div>
        </div>
      )}
    </div>
  );
}