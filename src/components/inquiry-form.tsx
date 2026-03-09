"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function InquiryForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Secure",
      description: "The Dean's office has received your Cohort '26 submission.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="inquiry" className="py-32 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight uppercase leading-tight text-white">
              Institutional <span className="text-amber-500">Gateway</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Submit your credentials for Cohort '26. We accept only those ready to move from reporting to interpretation.
            </p>
            <div className="space-y-6">
              <div className="text-sm">
                <p className="text-slate-500 uppercase tracking-widest mb-1 font-bold">Admissions Desk</p>
                <p className="text-white">contact.johnjlawal@gmail.com</p>
              </div>
              <div className="text-sm">
                <p className="text-slate-500 uppercase tracking-widest mb-1 font-bold">Primary Campus</p>
                <p className="text-white">JJL Enterprise, FCT, Abuja</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="bg-slate-950 p-8 md:p-10 border border-slate-800 rounded-sm shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-slate-400 font-bold">Full Identity</label>
                <Input required placeholder="Your full name" className="bg-slate-900 border-slate-800 text-white rounded-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-slate-400 font-bold">Institutional/Personal Email</label>
                <Input required type="email" placeholder="corporate@organization.com" className="bg-slate-900 border-slate-800 text-white rounded-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 h-12" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-slate-400 font-bold">LinkedIn URL</label>
                <Input required type="url" placeholder="https://linkedin.com/in/yourprofile" className="bg-slate-900 border-slate-800 text-white rounded-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 h-12" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-slate-400 font-bold">Statement of Purpose</label>
                <p className="text-xs text-slate-600 mb-2">Detail your current industry friction and how data orchestration will serve as your career exit strategy.</p>
                <Textarea required placeholder="I am an Economist seeking to transition into..." className="bg-slate-900 border-slate-800 text-white rounded-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[150px]" />
              </div>
              <div className="md:col-span-2 mt-4">
                <Button type="submit" className="w-full bg-amber-600 text-white hover:bg-amber-500 py-6 uppercase tracking-widest text-sm font-bold rounded-sm transition-all duration-300">
                  Apply for Cohort '26
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}