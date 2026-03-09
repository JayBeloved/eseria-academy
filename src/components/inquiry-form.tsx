
'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function InquiryForm() {

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
                <p className="text-white">eseria@johnjaylawal.org</p>
              </div>
              <div className="text-sm">
                <p className="text-slate-500 uppercase tracking-widest mb-1 font-bold">Primary Campus</p>
                <p className="text-white">JJL Enterprise, FCT, Abuja</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3 flex items-center justify-center">
            <Link href="/apply" passHref>
                <Button className="w-full bg-amber-600 text-white hover:bg-amber-500 py-8 px-16 uppercase tracking-widest text-lg font-bold rounded-sm transition-all duration-300">
                    Apply for Cohort '26
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}