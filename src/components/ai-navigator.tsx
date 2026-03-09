
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { aiNavigatorProgramRecommendation, type AINavigatorProgramRecommendationOutput } from "@/ai/flows/ai-navigator-program-recommendation";
import { Sparkles, Loader2, Compass, Target, Info } from "lucide-react";

export function AINavigator() {
  const [interests, setInterests] = useState("");
  const [aspirations, setAspirations] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AINavigatorProgramRecommendationOutput | null>(null);

  const handleNavigate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await aiNavigatorProgramRecommendation({
        academicInterests: interests,
        careerAspirations: aspirations,
      });
      setResult(output);
    } catch (error) {
      console.error("Navigation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="navigator" className="py-32 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl font-bold mb-6 tracking-tight uppercase">
              AI <span className="text-primary">Navigator</span>
            </h2>
            <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
              Our proprietary neural recommender maps your unique profile to the elite pathways within Eseria Citadel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card className="bg-card border-white/5 rounded-none p-6">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="font-headline uppercase text-xl">Discovery Parameters</CardTitle>
                <CardDescription className="text-white/40">Input your strategic goals and current domain interests.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <form onSubmit={handleNavigate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Academic Interests</label>
                    <Input 
                      placeholder="e.g. Stochastic calculus, Deep Reinforcement Learning"
                      className="bg-background border-white/10 rounded-none focus-visible:ring-primary h-12"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Career Aspirations</label>
                    <Textarea 
                      placeholder="e.g. Architecting autonomous trading agents for sovereign funds..."
                      className="bg-background border-white/10 rounded-none focus-visible:ring-primary min-h-[120px]"
                      value={aspirations}
                      onChange={(e) => setAspirations(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full font-headline bg-primary text-background hover:bg-primary/90 rounded-none h-14 uppercase tracking-widest text-sm"
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Initiate Navigation
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center p-12 border border-dashed border-white/10 opacity-30">
                  <Compass className="h-16 w-16 mb-4 text-primary" />
                  <p className="font-headline uppercase tracking-widest text-sm">Awaiting Parameters</p>
                </div>
              )}
              
              {loading && (
                <div className="h-full flex flex-col items-center justify-center p-12 bg-card border border-white/5">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
                  <p className="font-headline uppercase tracking-widest text-sm animate-pulse">Running Neural Optimization</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Card className="bg-card border-primary/20 rounded-none overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-white/5 py-4">
                      <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
                        <Target className="h-4 w-4" /> Recommended Core
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {result.recommendedPrograms.map((program, i) => (
                          <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                            <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                            {program}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-white/5 rounded-none">
                    <CardHeader className="py-4 border-b border-white/5">
                      <CardTitle className="text-sm font-headline uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Strategic Context
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-white/60 leading-relaxed text-sm mb-6">
                        {result.explanation}
                      </p>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Projected Career Pathways</span>
                        <div className="flex flex-wrap gap-2">
                          {result.careerPathways.map((path, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 text-white/60 text-xs uppercase tracking-wider border border-white/5">
                              {path}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
