'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig'; // Adjust import based on your setup
import { ShieldCheck, Mail, Key, Loader2, ArrowRight } from 'lucide-react';

export default function CitadelAccess() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // The Switchboard Logic: Route users based on their role
 const routeUser = async (uid: string, userEmail: string | null) => {
    try {
      const sanitizedId = userEmail?.toLowerCase().replace(/[^a-z0-9]/g, '');
      const userDocRef = doc(db, 'users', sanitizedId as string);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (data.onboardingCompleted === false) {
          // FORCE ONBOARDING IF NOT DONE
          router.push('/onboarding');
        } else {
          router.push('/dashboard/fellow');
        }
      } else {
        // Fallback for unauthorized logins
        router.push('/login');
      }
    } catch (err) {
      console.error("Routing Error:", err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // REMOVED: userCredential.user.displayName (the 3rd argument)
      await routeUser(userCredential.user.uid, userCredential.user.email);
    } catch (err: any) {
      setError("Invalid credentials. Access denied.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // REMOVED: result.user.displayName (the 3rd argument)
      await routeUser(result.user.uid, result.user.email);
    } catch (err: any) {
      setError("Google authentication failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-amber-500/30 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-slate-900 border border-slate-800 shadow-xl mb-6">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white">Eseria Academy</h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">Authorized Personnel Only</p>
        </div>

        {/* Access Terminal */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-sm p-8 shadow-2xl backdrop-blur-sm">
          
          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/50 text-rose-500 text-xs font-bold uppercase tracking-widest rounded-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Encrypted Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm py-3 pl-10 pr-4 text-sm text-white outline-none transition-all"
                  placeholder="fellow@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Access Code</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm py-3 pl-10 pr-4 text-sm text-white outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Initialize Session'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute w-full h-px bg-slate-800"></div>
            <span className="relative bg-slate-900 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Or Bypass With</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="mt-6 w-full h-12 bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google Identity
          </button>
          <div className="mt-6 w-full h-12 bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-3">
          <Link href="/blueprint" 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border text-center border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all group">Back to Home</Link>
          </div>
         
        </div>
      </div>
    </div>
  );
}