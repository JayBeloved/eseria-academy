'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';


// Mock data for now
const studentData = {
    name: "Jane Doe",
    program: "The Professional Pivot",
    progress: 60,
    upcomingSession: "Deep Work: SQL & Database Architecture",
    sessionTime: "Tomorrow, 6:00 PM WAT"
};

const DashboardPage = () => {
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-slate-950 text-white py-24 sm:px-6 lg:px-8">
                <header className="max-w-7xl mx-auto mb-12 px-6">
                    <h1 className="text-4xl font-bold tracking-tighter uppercase">
                        Welcome, <span className="text-amber-500">{studentData.name}</span>
                    </h1>
                    <p className="text-slate-400 mt-2">This is your command center for the 10x Blueprint program.</p>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                    {/* Main content - Left */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Program Info */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
                            <h2 className="text-2xl font-bold text-amber-500 uppercase tracking-wide mb-4">Current Mission: {studentData.program}</h2>
                            <p className="text-slate-300 mb-6">Your goal is to master the art of data orchestration and secure a high-impact role. Stay focused.</p>
                            <div className="w-full bg-slate-800 rounded-full h-4">
                                <div className="bg-amber-500 h-4 rounded-full" style={{ width: `${studentData.progress}%` }}></div>
                            </div>
                            <p className="text-right text-sm text-slate-400 mt-2">{studentData.progress}% Complete</p>
                        </div>
                        
                        {/* Course Materials */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
                            <h3 className="text-xl font-bold uppercase tracking-wide mb-4">Declassified Resources</h3>
                            <ul className="space-y-3">
                                {/* Replace with actual links/components */}
                                <li className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer">▶ Sidonian Frameworks (PDF)</li>
                                <li className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer">▶ Week 3: Python for Automation Scripts</li>
                                <li className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer">▶ The Professional Brain: Project Repo</li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar - Right */}
                    <aside className="space-y-8">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
                            <h3 className="text-xl font-bold uppercase tracking-wide mb-4">Next Transmission</h3>
                            <p className="text-2xl font-semibold text-amber-400">{studentData.upcomingSession}</p>
                            <p className="text-slate-400">{studentData.sessionTime}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
                            <h3 className="text-xl font-bold uppercase tracking-wide mb-4">Direct Comms</h3>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-sm transition-colors">
                                Message the Dean
                            </button>
                        </div>
                    </aside>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default DashboardPage;
