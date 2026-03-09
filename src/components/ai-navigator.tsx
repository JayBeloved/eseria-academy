"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { aiNavigatorProgramRecommendation, type AINavigatorProgramRecommendationOutput } from "@/ai/flows/ai-navigator-program-recommendation";
import { Sparkles, Loader2, Compass, Target, Info, Download } from "lucide-react";
import { jsPDF } from "jspdf";

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

  // The Sidonian Document Generator
  const handleDownload = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Eseria Academy Header (Slate & Amber styling)
    doc.setTextColor(15, 23, 42); // slate-950
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ESERIA ACADEMY", 20, 30);

    doc.setTextColor(217, 119, 6); // amber-600
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("COHORT '26: STRATEGIC PATHWAY COMMISSIONING", 20, 38);

    // Decorative Line
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.5);
    doc.line(20, 42, pageWidth - 20, 42);

    // Candidate Input Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("I. CANDIDATE PROFILE", 20, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Background: ${interests}`, 20, 63, { maxWidth: pageWidth - 40 });
    doc.text(`Objective: ${aspirations}`, 20, 73, { maxWidth: pageWidth - 40 });

    // The Dean's Context
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("II. THE DEAN'S STRATEGIC CONTEXT", 20, 93);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitContext = doc.splitTextToSize(result.explanation, pageWidth - 40);
    doc.text(splitContext, 20, 101);

    // Dynamic Y-axis tracking based on explanation length
    let currentY = 101 + (splitContext.length * 5) + 10;

    // Recommended Core
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("III. RECOMMENDED 10xB PATHWAY", 20, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    result.recommendedPrograms.forEach((program) => {
      const splitProgram = doc.splitTextToSize(`• ${program}`, pageWidth - 40);
      doc.text(splitProgram, 20, currentY);
      currentY += (splitProgram.length * 5) + 2;
    });

    currentY += 10;

    // Projected Positioning
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("IV. PROJECTED MARKET POSITIONING", 20, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const pathways = result.careerPathways.map(p => `[ ${p} ]`).join("   ");
    const splitPathways = doc.splitTextToSize(pathways, pageWidth - 40);
    doc.text(splitPathways, 20, currentY);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Confidential & Proprietary. The Sidonian Standard of Excellence.", 20, 285);
    doc.text("© 2026 Eseria Academy by JJL Enterprise.", 20, 290);

    doc.save("Eseria_Academy_Strategic_Pathway.pdf");
  };

  return (
    <section id="navigator" className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight uppercase text-white">
              The Admissions <span className="text-amber-500">Oracle</span>
            </h2>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
              Our proprietary AI evaluates your current industry friction and architects a bespoke data pathway to accelerate your career exit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Input Form */}
            <Card className="bg-slate-950 border-slate-800 rounded-sm p-6 shadow-xl">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="uppercase text-xl font-bold text-white tracking-wide">Discovery Parameters</CardTitle>
                <CardDescription className="text-slate-500">Input your current domain and ultimate strategic goals.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <form onSubmit={handleNavigate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Current Industry & Skills</label>
                    <Input 
                      placeholder="e.g. 5 years in HR, basic Excel skills..."
                      className="bg-slate-900 border-slate-800 text-white rounded-sm focus-visible:ring-1 focus-visible:ring-amber-500 h-12"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">The Strategic Goal</label>
                    <Textarea 
                      placeholder="e.g. I want to automate payroll reporting and land a remote Data Analyst role..."
                      className="bg-slate-900 border-slate-800 text-white rounded-sm focus-visible:ring-1 focus-visible:ring-amber-500 min-h-[120px]"
                      value={aspirations}
                      onChange={(e) => setAspirations(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full bg-amber-600 text-white hover:bg-amber-500 rounded-sm h-14 uppercase tracking-widest text-sm font-bold transition-all duration-300"
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Initiate Oracle Scan
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results Display */}
            <div className="space-y-6 h-full flex flex-col">
              {!result && !loading && (
                <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 border border-dashed border-slate-700 bg-slate-900/30 rounded-sm opacity-50">
                  <Compass className="h-16 w-16 mb-4 text-slate-600" />
                  <p className="uppercase tracking-widest text-sm text-slate-500 font-bold">Awaiting Parameters</p>
                </div>
              )}
              
              {loading && (
                <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 bg-slate-950 border border-amber-500/30 rounded-sm">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin text-amber-500" />
                  <p className="uppercase tracking-widest text-sm text-amber-500/80 font-bold animate-pulse">Running Neural Optimization</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1">
                  
                  {/* Download Action Bar */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      className="border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Official Strategy
                    </Button>
                  </div>

                  {/* Recommended Core */}
                  <Card className="bg-slate-950 border-amber-500/50 rounded-sm overflow-hidden shadow-lg shadow-amber-900/10">
                    <CardHeader className="bg-amber-900/20 border-b border-amber-500/20 py-4">
                      <CardTitle className="text-sm uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                        <Target className="h-4 w-4" /> Recommended 10xB Pathway
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {result.recommendedPrograms.map((program, i) => (
                          <li key={i} className="flex items-start gap-3 text-white font-medium">
                            <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
                            <span>{program}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Strategic Context */}
                  <Card className="bg-slate-950 border-slate-800 rounded-sm shadow-xl">
                    <CardHeader className="py-4 border-b border-slate-800">
                      <CardTitle className="text-sm uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                        <Info className="h-4 w-4" /> The Dean's Strategic Context
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-slate-300 leading-relaxed text-sm mb-6">
                        {result.explanation}
                      </p>
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Projected Market Positioning</span>
                        <div className="flex flex-wrap gap-2">
                          {result.careerPathways.map((path, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-800 text-amber-400 text-xs font-semibold tracking-wider border border-slate-700 rounded-sm">
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