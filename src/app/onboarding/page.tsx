'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, updatePassword, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { 
  ShieldCheck, Lock, BrainCircuit, CheckCircle2, 
  Loader2, LogOut, ArrowRight, AlertTriangle 
} from 'lucide-react';

export default function InitiationProtocol() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileForm, setProfileForm] = useState({
    weeklyCommitmentHours: 15,
    deepWorkDays: [] as string[],
    peakFocusTime: 'Morning (4 AM - 8 AM)'
  });
  const [mandateAgreed, setMandateAgreed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      const sanitizedId = user.email?.toLowerCase().replace(/[^a-z0-9]/g, '');
      const docRef = doc(db, 'users', sanitizedId as string);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data.onboardingCompleted) {
          router.push('/dashboard');
        } else {
          setUserData(data);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const toggleDay = (day: string) => {
    setProfileForm(prev => ({
      ...prev,
      deepWorkDays: prev.deepWorkDays.includes(day) 
        ? prev.deepWorkDays.filter(d => d !== day)
        : [...prev.deepWorkDays, day]
    }));
  };

  const handleInitiation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword.length < 8) {
      alert("Passwords must match and be 8+ characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Rotate Password (The sensitive operation)
      await updatePassword(auth.currentUser!, newPassword);

      // 2. Update Firestore Profile
      const sanitizedId = auth.currentUser?.email?.toLowerCase().replace(/[^a-z0-9]/g, '');
      const userRef = doc(db, 'users', sanitizedId as string);
      
      await updateDoc(userRef, {
        operationalProfile: profileForm,
        onboardingCompleted: true,
        lastSecurityRotation: new Date().toISOString()
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error("Initiation Failure:", err);
      
      // THE FIX: Catch the "Requires Recent Login" error
      if (err.code === 'auth/requires-recent-login') {
        alert("Security Gate Timeout: For your protection, password rotation requires a fresh session. Please log in again to complete your initiation.");
        await signOut(auth);
        router.push('/login');
      } else {
        alert("System Calibration failed: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 flex flex-col items-center justify-center selection:bg-amber-500/30">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-amber-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <ShieldCheck className="w-12 h-12 text-amber-500 mb-4" />
            <h1 className="text-3xl font-bold uppercase tracking-tight text-white">Onbooarding Protocol</h1>
            <p className="text-slate-400 text-sm mt-1">Calibrate your jurisdiction before entering the Academy.</p>
          </div>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors">
            <LogOut className="w-3 h-3" /> Terminate Session
          </button>
        </div>

        <form onSubmit={handleInitiation} className="space-y-8">
          
          {/* STEP 1: VERIFICATION */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 01. Trajectory Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 border border-slate-800 rounded-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Assigned Fellow</p>
                <p className="text-white font-medium">{userData?.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Target Role</p>
                <p className="text-white font-medium">{userData?.primaryGoal}</p>
              </div>
            </div>
          </section>

          {/* STEP 2: SECURITY ROTATION */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> 02. Security Rotation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="password" required placeholder="New Password (8+ chars)" 
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-3 text-sm text-white rounded-sm focus:border-amber-500 outline-none"
              />
              <input 
                type="password" required placeholder="Confirm  Password" 
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-3 text-sm text-white rounded-sm focus:border-amber-500 outline-none"
              />
            </div>
          </section>

          {/* STEP 3: SYSTEM CALIBRATION (Your Provided Form) */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> 03. System Calibration
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Weekly Commitment (Hours)</label>
                  <input type="number" min="5" max="40" value={profileForm.weeklyCommitmentHours} onChange={e => setProfileForm({...profileForm, weeklyCommitmentHours: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-white rounded-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Peak Focus Window</label>
                  <select value={profileForm.peakFocusTime} onChange={e => setProfileForm({...profileForm, peakFocusTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-white rounded-sm outline-none appearance-none focus:border-amber-500">
                    <option>Morning (4 AM - 8 AM)</option>
                    <option>Daytime (9 AM - 5 PM)</option>
                    <option>Evening (6 PM - 10 PM)</option>
                    <option>Night (10 PM - 2 AM)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-3">Primary Execution Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <button type="button" key={day} onClick={() => toggleDay(day)} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all ${profileForm.deepWorkDays.includes(day) ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 4: MANDATE */}
          <section className="bg-amber-900/5 border border-amber-500/20 p-6 rounded-sm">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input type="checkbox" required checked={mandateAgreed} onChange={e => setMandateAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500" />
              <p className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                I acknowledge that the curriculum and frameworks of the Eseria Academy are proprietary. I commit to the deep-work hours specified above and understand that the Dean guarantees the architecture, but I must provide the discipline.
              </p>
            </label>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting || !mandateAgreed || profileForm.deepWorkDays.length === 0}
            className="w-full h-14 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Entry & Initialize Dashboard'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>

        </form>
      </div>
    </div>
  );
}