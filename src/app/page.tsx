
import { Navigation } from "@/components/navigation";
import { ProgramShowcase } from "@/components/program-showcase";
import { FacultySpotlight } from "@/components/faculty-spotlight";
import { AINavigator } from "@/components/ai-navigator";
import { InquiryForm } from "@/components/inquiry-form";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl || "";

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="Eseria Citadel Background"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="financial data visualization"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-8 px-6 py-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.4em] animate-in fade-in slide-in-from-top-4 duration-1000">
            Institutional Portal for Eseria Citadel
          </div>
          <h1 className="font-headline text-6xl md:text-9xl font-bold mb-8 tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            A Fortified City of <br />
            <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300">
            Operating at the critical intersection of Financial Engineering, Data Science, and AI Orchestration. We define the Soriyan standard of aggressive excellence.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in duration-1000 delay-500">
            <Button size="lg" className="font-headline bg-primary text-background hover:bg-primary/90 px-12 h-14 uppercase tracking-widest text-sm rounded-none">
              Explore Programs
            </Button>
            <Button variant="outline" size="lg" className="font-headline border-white/10 hover:bg-white/5 px-12 h-14 uppercase tracking-widest text-sm rounded-none">
              Institutional Inquiry
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/20">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* About Section (Modular Content Section) */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-headline text-5xl font-bold mb-8 tracking-tight uppercase leading-tight">
                Beyond <span className="text-primary">Academia</span>
              </h2>
              <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed">
                <p>
                  Eseria Citadel is not merely a learning institution. It is a sovereign engine of intellectual and financial production. We serve as the vanguard for the next generation of quantitative architects and AI orchestrators.
                </p>
                <p>
                  Our curriculum is forged through direct collaboration with the world's most aggressive technology firms and financial institutions, ensuring our candidates possess an asymmetric advantage from day one.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-card border border-white/5 flex flex-col items-center justify-center p-8 gold-glow">
                <div className="text-primary font-headline text-4xl font-bold mb-2">0.1%</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold text-center">Acceptance Rate</div>
              </div>
              <div className="aspect-square bg-card border border-white/5 flex flex-col items-center justify-center p-8">
                <div className="text-primary font-headline text-4xl font-bold mb-2">$4.2B</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold text-center">Alumni Fund Value</div>
              </div>
              <div className="aspect-square bg-card border border-white/5 flex flex-col items-center justify-center p-8">
                <div className="text-primary font-headline text-4xl font-bold mb-2">24/7</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold text-center">Terminal Uptime</div>
              </div>
              <div className="aspect-square bg-card border border-white/5 flex flex-col items-center justify-center p-8">
                <div className="text-primary font-headline text-4xl font-bold mb-2">Global</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold text-center">Network Nodes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgramShowcase />
      <FacultySpotlight />
      <AINavigator />
      <InquiryForm />
      <Footer />
    </main>
  );
}
