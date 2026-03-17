'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Loader2, FileSignature } from 'lucide-react';

// Mock data for UI testing. In production, fetch this from Firestore using auth.currentUser.uid
const mockProvisionedData = {
  uid: "mock_uid_123",
  fullName: "Kelly Doe",
  primaryGoal: "Senior Data Analyst",
  billingTier: "executive", // 'executive' | 'diaspora_partner' | 'graduate_grant'
  onboardingCompleted: false
};

export default function FellowOnboarding() {
  const router = useRouter();
  const [userData, setUserData] = useState(mockProvisionedData);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Derived Financial Logic based on Admin's pre-selection
  const getBillingDetails = (tier: string) => {
    switch (tier) {
      case 'executive':
        return { title: 'Executive Professional Pivot', milestone: '₦75,000 / Phase' };
      case 'diaspora_partner':
        return { title: 'Sovereign Partnership (UK)', milestone: '£150 / Phase' };
      case 'graduate_grant':
        return { title: 'Graduate Ascent Fellowship', milestone: '₦50,000 / Phase' };
      default:
        return { title: 'Pending Audit', milestone: 'TBD' };
    }
  };

  const billing = getBillingDetails(userData.billingTier);

  const handleCompleteOnboarding = async () => {
    if (!isAgreed) return;
    setIsLoading(true);

    try {
      // In production, ensure auth.currentUser exists before updating
      // const userRef = doc(db, 'users', auth.currentUser.uid);
      // await updateDoc(userRef, { onboardingCompleted: true });
      
      // Simulate network delay for UI
      setTimeout(() => {
        router.push('/dashboard/fellow');
      }, 1500);
      
    } catch (error) {
      console.error("Failed to update onboarding status", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-amber-500/30 relative overflow-hidden font-sans">
      
      {/* Ambient Lighting */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-10">
          <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Initiation Protocol</h1>
          <p className="text-sm text-slate-400">Verify your designated parameters before entering the Citadel.</p>
        </div>

        {/* The Verification Slate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-sm p-8 md:p-10 shadow-2xl backdrop-blur-sm space-y-8">
          
          {/* Step 1: Trajectory Verification */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 1. Identity & Trajectory
            </h2>
            <div className="grid md:grid-cols-2 gap-4 bg-slate-950 border border-slate-800 p-4 rounded-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Authorized Fellow</p>
                <p className="text-white font-medium">{userData.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Target Jurisdiction</p>
                <p className="text-white font-medium">{userData.primaryGoal}</p>
              </div>
            </div>
          </div>

          {/* Step 2: Financial Tollgate Acknowledgment */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 2. Financial Jurisdiction
            </h2>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Approved Track</p>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 rounded-sm">
                  Verified
                </span>
              </div>
              <p className="text-lg text-white font-bold mb-1">{billing.title}</p>
              <p className="text-sm text-slate-400">
                Phase Unlock Requirement: <span className="text-amber-500 font-bold">{billing.milestone}</span>
              </p>
            </div>
            <div className="mt-3 flex items-start gap-3 text-slate-400 bg-amber-900/10 border border-amber-900/30 p-3 rounded-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Notice: Your Phase 1 module remains locked until the initial commitment is cleared. The system will automatically gate access to subsequent phases every 4 weeks.
              </p>
            </div>
          </div>

          {/* Step 3: IP & Discipline Mandate */}
          <div className="pt-4 border-t border-slate-800">
            <h2 className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-4 flex items-center gap-2">
              <FileSignature className="w-4 h-4" /> 3. The Sovereign Mandate
            </h2>
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <div className="w-5 h-5 border-2 border-slate-600 rounded-sm peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all"></div>
                <CheckCircle2 className="absolute w-3 h-3 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                I acknowledge that the curriculum, frameworks, and logic provided by the Eseria Academy are proprietary. I agree to execute the required deep-work hours, understanding that the academy guarantees the architecture, but I must provide the discipline.
              </p>
            </label>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCompleteOnboarding}
            disabled={!isAgreed || isLoading}
            className="w-full h-14 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accept Mandate & Enter Citadel'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </div>
  );
}