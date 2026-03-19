import { Navigation } from "@/components/navigation";
import { ProgramShowcase } from "@/components/program-showcase";
import { FacultySpotlight } from "@/components/faculty-spotlight";
import { AINavigator } from "@/components/ai-navigator";
import { InquiryForm } from "@/components/inquiry-form";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ChevronDown, ShieldAlert, Cpu, Globe, Terminal } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function EseriaAcademyHome() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl || "/api/placeholder/1920/1080";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30">
      <Navigation />
      
      {/* HERO SECTION: The Fortified City */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-slate-900 pt-10">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="Eseria Academy Background"
            fill
            className="object-cover opacity-10 mix-blend-luminosity grayscale"
            priority
            data-ai-hint="financial data visualization"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center mt-16">
          <div className="inline-block mb-8 px-6 py-2 border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-bold uppercase tracking-[0.3em] rounded-sm animate-in fade-in slide-in-from-top-4 duration-1000">
            Bespoke Data Analytics Fellowship • Cohort '26
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Escape the Grind. <br />
            <span className="text-amber-500 italic lowercase tracking-normal font-serif">Architect Your Data Career.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300">
            A tailored, 16-week transformation for professionals, career changers, and ambitious graduates. We turn your existing industry knowledge into high-ticket data intelligence.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in duration-1000 delay-500">
            <a 
              href="/apply"
              className="inline-flex items-center justify-center h-14 px-12 bg-amber-600 text-white hover:bg-amber-500 uppercase tracking-widest text-sm font-bold rounded-sm shadow-lg shadow-amber-900/20 transition-all duration-300"
            >
              Apply for the Pivot
            </a>
          </div>
        </div>

        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-amber-500/50">
          <ChevronDown className="h-8 w-8" />
        </div> */}
      </section>

      {/* THE SIDONIAN STANDARD SECTION */}
      <section className="py-32 bg-slate-950 border-b border-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight uppercase leading-tight">
              The Domain <span className="text-amber-500">Advantage</span>
            </h2>
            <div className="w-20 h-1 bg-amber-500 mb-8"></div>
            <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
              <p>
                Most bootcamps treat your past experience as a liability. At Eseria Academy, we treat it as your ultimate weapon. Whether you are an Economist, a Quantity Surveyor, or a fresh graduate, we tailor your data journey to your specific industry.
              </p>
              <p>
                We help you beat the grind of tedious manual reporting. By mastering SQL, Python, and BI tools, you will build an automated "Professional Brain" that makes you a non-substitutable asset in the global remote job market.
              </p>
            </div>
          </div>
            
            {/* The 10xB Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors flex flex-col items-center justify-center p-8 rounded-sm group">
                <ShieldAlert className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-white text-3xl font-bold mb-1">1%</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center">Acceptance Rate</div>
              </div>
              <div className="aspect-square bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors flex flex-col items-center justify-center p-8 rounded-sm group">
                <Terminal className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-white text-3xl font-bold mb-1">16</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center">Week Immersion</div>
              </div>
              <div className="aspect-square bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors flex flex-col items-center justify-center p-8 rounded-sm group relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform relative z-10" />
                <div className="text-white text-3xl font-bold mb-1 relative z-10">24/7</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center relative z-10">AI Terminal Uptime</div>
              </div>
              <div className="aspect-square bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors flex flex-col items-center justify-center p-8 rounded-sm group">
                <Globe className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-white text-3xl font-bold mb-1">Global</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center">Network Nodes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULAR COMPONENTS */}
      {/* These will contain the Syllabus, John's Bio, and the interactive elements */}
      <ProgramShowcase />
      <FacultySpotlight />
      
      {/* Interactive AI Agent for Prospective Students */}
      <AINavigator />
      
      {/* The Enrollment Form with the ID required for the Hero CTA scroll */}
      <div id="enrollment" className="scroll-mt-20">
        <InquiryForm />
      </div>
      
      <Footer />
    </main>
  );
}