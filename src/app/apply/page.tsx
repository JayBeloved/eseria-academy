
'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ChevronRight, ChevronLeft, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// --- VALIDATION SCHEMAS ---
const baseSchema = {
  fullName: z.string().min(2, 'Full identity is required'),
  email: z.string().email('Provide a valid institutional/personal email'),
  whatsapp: z.string().min(5, 'WhatsApp number is required for direct comms'),
  excelMastery: z.number().min(1).max(10),
  toolExposure: z.array(z.string()).default([]),
  primaryGoal: z.string().min(1, 'You must select a strategic goal'),
  computerSpecs: z.string().optional(),
  disclaimer: z.boolean().refine((val) => val === true, 'You must accept the institutional terms'),
  availability: z.object({
    days: z.array(z.string()).min(1, 'Select at least one day of operation'),
    hours: z.string().min(1, 'Specify your operational hours'),
  }),
  commitment: z.string().min(1, 'State your weekly hourly commitment'),
  bigVision: z.string().min(10, 'Your vision must be explicitly stated'),
};

const professionalSchema = z.object({
  ...baseSchema,
  manualTasks: z.string().min(5, 'Detail your current friction'),
  experience: z.string().min(1, 'State your domain tenure'),
});

const graduateSchema = z.object({
  ...baseSchema,
  areaOfInterest: z.string().min(2, 'Define your target sector'),
  academicBackground: z.string().min(2, 'State your degree/qualification'),
});

const STEPS = [
  { id: 1, title: 'Identity & Persona' },
  { id: 2, title: 'Technical Baseline' },
  { id: 3, title: 'Strategic Context' },
  { id: 4, title: 'The Mandate' },
];

export default function OnboardingPage() {
  const [persona, setPersona] = useState('professional');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(persona === 'professional' ? professionalSchema : graduateSchema),
    defaultValues: {
      excelMastery: 5,
      toolExposure: [],
      availability: { days: [] }
    }
  });

  // Reset step 3 fields when persona changes so validation doesn't get stuck
  useEffect(() => {
    if (persona === 'professional') {
      setValue('areaOfInterest', 'N/A');
      setValue('academicBackground', 'N/A');
      setValue('manualTasks', '');
      setValue('experience', '');
    } else {
      setValue('manualTasks', 'N/A');
      setValue('experience', 'N/A');
      setValue('areaOfInterest', '');
      setValue('academicBackground', '');
    }
  }, [persona, setValue]);

  const fieldsByStep: Record<number, string[]> = {
    1: ['fullName', 'email', 'whatsapp'],
    2: ['excelMastery', 'toolExposure'],
    3: persona === 'professional' 
        ? ['primaryGoal', 'computerSpecs', 'manualTasks', 'experience'] 
        : ['primaryGoal', 'computerSpecs', 'areaOfInterest', 'academicBackground'],
    4: ['availability.days', 'availability.hours', 'commitment', 'bigVision', 'disclaimer']
  };

  const handleNext = async () => {
    const fieldsToValidate = fieldsByStep[currentStep];
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const docRef = await addDoc(collection(db, 'academy_submissions'), { ...data, persona, submittedAt: new Date().toISOString() });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Transmission failed. Ensure you are connected to the network.');
    } finally {
      setIsLoading(false);
    }
  };

  // UI rendering helpers
  const excelValue = watch('excelMastery');
  const selectedTools = watch('toolExposure') || [];
  const selectedDays = watch('availability.days') || [];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col py-24 sm:px-6 lg:px-8 selection:bg-amber-500/30">
        
        {/* HEADER SECTION */}
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-[0.3em] rounded-sm">
            Eseria Academy • Cohort '26
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
            The 10xB <span className="text-amber-500">Diagnostic</span>
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
            This is not a general inquiry. This is an institutional audit designed to map your current industry friction to our advanced data architecture frameworks. Provide exact parameters.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          {/* STEP TRACKER */}
          {!isSuccess && (
            <div className="mb-8">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-slate-800 z-0"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-amber-500 z-0 transition-all duration-500" 
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                ></div>
                {STEPS.map((step) => (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${currentStep >= step.id ? 'bg-amber-500 border-amber-500 text-slate-950' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                      {step.id}
                    </div>
                    <span className={`absolute -bottom-6 text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors ${currentStep >= step.id ? 'text-amber-500' : 'text-slate-600 hidden md:block'}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FORM CONTAINER */}
          <div className="bg-slate-900/80 border border-slate-800 shadow-2xl rounded-sm p-8 md:p-12 mt-12">
            {isSuccess ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <ShieldCheck className="w-24 h-24 text-amber-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Audit Logged</h3>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                  Your diagnostic has been transmitted to the Dean's Office. You will receive an execution mandate within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* --- STEP 1: IDENTITY --- */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="mb-8">
                      <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Applicant Profile Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPersona('professional')}
                          className={`p-4 border text-left rounded-sm transition-all ${persona === 'professional' ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                        >
                          <span className="block font-bold text-sm uppercase tracking-wide mb-1">The Domain Professional</span>
                          <span className="block text-xs opacity-70">Pivoting an existing career with tech</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPersona('graduate')}
                          className={`p-4 border text-left rounded-sm transition-all ${persona === 'graduate' ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                        >
                          <span className="block font-bold text-sm uppercase tracking-wide mb-1">The Academic Specialist</span>
                          <span className="block text-xs opacity-70">Entering the market with elite skills</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Legal Name</label>
                        <input type="text" {...register('fullName')} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none transition-all" placeholder="John Doe" />
                        {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message as string}</p>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Primary Email</label>
                          <input type="email" {...register('email')} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none transition-all" placeholder="name@domain.com" />
                          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">WhatsApp / Phone</label>
                          <input type="text" {...register('whatsapp')} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none transition-all" placeholder="+234..." />
                          {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message as string}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- STEP 2: TECHNICAL BASELINE --- */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="flex justify-between items-center text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
                        <span>Logic & Spreadsheet Mastery</span>
                        <span className="text-amber-500 text-lg">{excelValue} / 10</span>
                      </label>
                      <input 
                        type="range" min="1" max="10" step="1" 
                        {...register('excelMastery', { valueAsNumber: true })}
                        className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-600 mt-2">
                        <span>Beginner</span>
                        <span>Advanced (VBA/Index-Match)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Prior Technical Exposure</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['SQL', 'Python', 'Power BI', 'Tableau'].map((tool) => (
                          <label key={tool} className={`flex items-center justify-center p-3 border rounded-sm cursor-pointer transition-colors ${selectedTools.includes(tool) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                            <input type="checkbox" value={tool} {...register('toolExposure')} className="hidden" />
                            <span className="text-sm font-bold">{tool}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- STEP 3: STRATEGIC CONTEXT --- */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Target Jurisdiction (Goal)</label>
                      <select {...register('primaryGoal')} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none appearance-none">
                        <option value="">Select an objective...</option>
                        <option value="remote-job">Acquire High-Ticket Remote Role</option>
                        <option value="consulting">Build Independent Consulting Firm</option>
                        <option value="promotion">Dominate Current Corporate Ladder</option>
                      </select>
                      {errors.primaryGoal && <p className="mt-1 text-xs text-red-500">{errors.primaryGoal.message as string}</p>}
                    </div>

                    {persona === 'professional' ? (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Manual Tasks (The Grind)</label>
                            <input type="text" {...register('manualTasks')} placeholder="What manual tasks are wasting your time today?" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                            {errors.manualTasks && <p className="mt-1 text-xs text-red-500">{errors.manualTasks.message as string}</p>}
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Years of Experience</label>
                            <input type="text" {...register('experience')} placeholder="e.g. 7 years in Construction" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                            {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message as string}</p>}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Area of Interest</label>
                            <input type="text" {...register('areaOfInterest')} placeholder="e.g. Econometrics, EdTech" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                            {errors.areaOfInterest && <p className="mt-1 text-xs text-red-500">{errors.areaOfInterest.message as string}</p>}
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Academic Background</label>
                            <input type="text" {...register('academicBackground')} placeholder="e.g. BSc Economics" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                            {errors.academicBackground && <p className="mt-1 text-xs text-red-500">{errors.academicBackground.message as string}</p>}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Hardware Specifications</label>
                      <input type="text" {...register('computerSpecs')} placeholder="e.g. Core i5, 8GB RAM (Used to provision cloud environments)" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                    </div>
                  </div>
                )}

                {/* --- STEP 4: THE MANDATE --- */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Availability Windows</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <label key={day} className={`px-4 py-2 border rounded-sm cursor-pointer transition-colors text-sm font-semibold ${selectedDays.includes(day) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                            <input type="checkbox" value={day} {...register('availability.days')} className="hidden" />
                            {day.substring(0, 3)}
                          </label>
                        ))}
                      </div>
                      {errors.availability?.days && <p className="mb-3 text-xs text-red-500">{errors.availability.days.message as string}</p>}
                      
                      <input type="text" {...register('availability.hours')} placeholder="Specify hours (e.g. 5pm - 8pm WAT)" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-sm p-3 text-white outline-none" />
                      {errors.availability?.hours && <p className="mt-1 text-xs text-red-500">{errors.availability.hours.message as string}</p>}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Weekly Hour Commitment</label>
                      <input type="text" {...register('commitment')} placeholder="e.g. 8 hours/week" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                      {errors.commitment && <p className="mt-1 text-xs text-red-500">{errors.commitment.message as string}</p>}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">The Professional Brain</label>
                      <p className="text-xs text-slate-500 mb-2">If you could build one automated tool to do your hardest work for you, what would it do?</p>
                      <Textarea {...register('bigVision')} rows={3} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-sm p-3 text-white outline-none" />
                      {errors.bigVision && <p className="mt-1 text-xs text-red-500">{errors.bigVision.message as string}</p>}
                    </div>

                    <div className="bg-slate-950 p-4 border border-slate-800 rounded-sm flex items-start gap-4">
                      <input type="checkbox" id="disclaimer" {...register('disclaimer')} className="mt-1 accent-amber-500 w-5 h-5 cursor-pointer" />
                      <div>
                        <label htmlFor="disclaimer" className="text-sm font-bold text-white cursor-pointer">Intellectual Property Mandate</label>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          I acknowledge that the Sidonian Frameworks provided are proprietary. I agree to commit fully to the prescribed hours, understanding that lack of discipline voids the guarantee of results.
                        </p>
                        {errors.disclaimer && <p className="mt-1 text-xs text-red-500">{errors.disclaimer.message as string}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTROL BUTTONS */}
                <div className="flex gap-4 pt-6 border-t border-slate-800">
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      onClick={handleBack}
                      className="px-6 h-14 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 rounded-sm uppercase tracking-widest text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  
                  {currentStep < STEPS.length ? (
                    <button 
                      type="button" 
                      onClick={handleNext}
                      className="flex-1 h-14 bg-white text-slate-950 hover:bg-slate-200 rounded-sm uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                    >
                      Proceed <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1 h-14 bg-amber-600 text-white hover:bg-amber-500 rounded-sm uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      {isLoading ? 'Transmitting...' : 'Submit Diagnostic'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
