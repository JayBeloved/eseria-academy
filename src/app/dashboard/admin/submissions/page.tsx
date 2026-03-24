'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { 
  Inbox, CheckCircle2, XCircle, ExternalLink, 
  Clock, FileCode2, Video, FileText, Loader2, Filter
} from 'lucide-react';

export default function ArtifactReview() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // 1. REAL-TIME ARTIFACT INTERCEPT
  useEffect(() => {
    const q = query(
      collection(db, 'submissions'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
      },
      (error) => {
        console.error("Artifact Fetch Error (Check Index):", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. STATUS UPDATE ENGINE
  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'submissions', id), { status: newStatus });
    } catch (error) {
      console.error("Status Update Failed:", error);
      alert("Failed to update artifact status.");
    }
  };

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') return submissions;
    return submissions.filter(s => s.status === statusFilter);
  }, [submissions, statusFilter]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'github': return <FileCode2 className="w-4 h-4 text-zinc-400" />;
      case 'loom': return <Video className="w-4 h-4 text-zinc-400" />;
      default: return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header className="border-b border-rose-900/50 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Inbox className="w-3 h-3" /> Artifact Intercept
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Artifact <span className="text-rose-500">Review</span>
          </h1>
        </div>

        {/* METRICS & FILTERS */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-black border border-zinc-900 px-4 py-2 rounded-lg">
            <span className="text-amber-500">{submissions.filter(s => s.status === 'pending').length} Pending</span>
            <span className="w-px h-3 bg-zinc-800" />
            <span className="text-emerald-500">{submissions.filter(s => s.status === 'approved').length} Cleared</span>
          </div>
          
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
            <Filter className="w-3 h-3 text-zinc-600 ml-2 mr-1" />
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button 
                key={f} 
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* THE ARTIFACT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((sub) => (
            <div key={sub.id} className="bg-black border border-zinc-900 rounded-xl overflow-hidden flex flex-col">
              
              {/* Card Header */}
              <div className="p-5 border-b border-zinc-900 bg-zinc-950/30 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">{sub.fellowName}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{sub.email}</p>
                </div>
                <div className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                  sub.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  sub.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                  'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                  {sub.status}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Target Deliverable</p>
                  <p className="text-xs font-bold text-zinc-300 uppercase tracking-tight line-clamp-2">
                    {sub.taskTitle || "Unknown Objective"}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Week {sub.weekNumber}</p>
                </div>

                <div className="pt-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Transmitted Asset</p>
                  <a 
                    href={sub.artifactUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 hover:border-rose-500/50 rounded-lg group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getIconForType(sub.artifactType)}
                      <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-rose-500 transition-colors">
                        {sub.artifactType} Payload
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-rose-500 transition-colors" />
                  </a>
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t border-zinc-900 grid grid-cols-2 divide-x divide-zinc-900">
                <button 
                  onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                  disabled={sub.status === 'rejected'}
                  className="p-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button 
                  onClick={() => handleUpdateStatus(sub.id, 'approved')}
                  disabled={sub.status === 'approved'}
                  className="p-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border border-zinc-900 border-dashed rounded-xl">
            <Clock className="w-10 h-10 text-zinc-800 mb-4" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold text-center">
              No artifacts detected in the current filter state.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}