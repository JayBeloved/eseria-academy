
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function InquiryForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Transmission Secure",
      description: "Our institutional desk has received your inquiry.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="inquiry" className="py-32 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3">
            <h2 className="font-headline text-5xl font-bold mb-8 tracking-tight uppercase leading-tight">
              Institutional <span className="text-primary">Gateway</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              DataCamp Enterprise and global strategic partners may use this portal for dedicated priority communication.
            </p>
            <div className="space-y-4">
              <div className="text-sm">
                <p className="text-white/20 uppercase tracking-widest mb-1">Inquiry Desk</p>
                <p className="text-white/80">institutional@eseria.citadel</p>
              </div>
              <div className="text-sm">
                <p className="text-white/20 uppercase tracking-widest mb-1">Campus</p>
                <p className="text-white/80">Eseria Citadel, District 1</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Full Identity</label>
                <Input required placeholder="Your full name" className="bg-transparent border-white/10 rounded-none focus:border-primary h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Institutional Email</label>
                <Input required type="email" placeholder="corporate@organization.com" className="bg-transparent border-white/10 rounded-none focus:border-primary h-12" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Strategic Inquiry</label>
                <Textarea required placeholder="Details of your request or proposal..." className="bg-transparent border-white/10 rounded-none focus:border-primary min-h-[150px]" />
              </div>
              <div className="md:col-span-2">
                <Button className="w-full md:w-auto font-headline bg-primary text-background hover:bg-primary/90 px-12 h-14 uppercase tracking-widest text-sm rounded-none">
                  Transmit Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
