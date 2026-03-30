'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { FileText, FilePenLine, Loader2, Target, CalendarDays, Search, Maximize2, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function FellowMemosViewer() {
  const [memos, setMemos] = useState<any[]>([]);
  const [activeMemo, setActiveMemo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New States for Filters & Focus Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWeek, setSelectedWeek] = useState('All');
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const qMemos = query(
          collection(db, 'memos'),
          where('audience', 'in', ['global', user.email]),
          orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(qMemos, (snapshot) => {
          const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setMemos(fetched);
          if (fetched.length > 0 && !activeMemo) setActiveMemo(fetched[0]);
          setIsLoading(false);
        });

        return () => unsub();
      }
    });
    return () => unsubAuth();
  }, [activeMemo]);

  // Derived Filtering
  const filteredMemos = memos.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesWeek = selectedWeek === 'All' || (m.week || 'Global') === selectedWeek;
    return matchesSearch && matchesCategory && matchesWeek;
  });

  // Focus Mode Navigation
  const currentIndex = filteredMemos.findIndex(m => m.id === activeMemo?.id);
  
  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < filteredMemos.length - 1) {
      setActiveMemo(filteredMemos[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveMemo(filteredMemos[currentIndex - 1]);
    }
  };

  const MarkdownComponents: any = {
    h1: ({node, ...props}: any) => <h1 className="text-3xl font-black text-white mt-8 mb-4 border-b border-zinc-800 pb-2" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-amber-500 mt-6 mb-3" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-xl font-bold text-zinc-200 mt-4 mb-2" {...props} />,
    p: ({node, ...props}: any) => <p className="text-zinc-300 leading-relaxed mb-4 text-sm md:text-base" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside text-zinc-300 mb-4 space-y-2" {...props} />,
    a: ({node, ...props}: any) => <a className="text-amber-500 hover:text-amber-400 underline underline-offset-4" target="_blank" {...props} />,
    img: ({node, ...props}: any) => <img className="rounded-xl border border-zinc-800 my-6 max-w-full h-auto shadow-2xl" {...props} />,
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
          <div className="bg-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 flex justify-between items-center">
            {match[1]} <span className="text-amber-500 font-mono tracking-tight">Eseria Code Engine</span>
          </div>
          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, background: '#000', padding: '1.5rem' }} {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>{children}</code>
      );
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-7xl mx-auto h-[85vh] flex flex-col animate-in fade-in duration-700 pb-10">
      
      <header className="border-b border-zinc-900 pb-6 mb-6 shrink-0 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Strategic <span className="text-amber-500">Memos</span>
        </h1>
        
        {/* GLOBAL FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search Knowledge Base..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full md:w-48 bg-zinc-900/50 text-white text-xs pl-9 pr-3 py-2 rounded-md outline-none border border-zinc-800 focus:border-amber-500 transition-colors" />
          </div>
          <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} className="bg-zinc-900/50 border border-zinc-800 text-xs font-bold text-zinc-300 py-2 px-3 rounded-md outline-none focus:border-amber-500">
            <option value="All">All Weeks</option>
            <option value="Global">Global Context</option>
            {[...Array(16)].map((_, i) => (<option key={i} value={`Week ${i + 1}`}>Week {i + 1}</option>))}
          </select>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-zinc-900/50 border border-zinc-800 text-xs font-bold text-zinc-300 py-2 px-3 rounded-md outline-none focus:border-amber-500">
            <option value="All">All Types</option>
            <option value="brief">Strategic Brief</option>
            <option value="walkthrough">Walkthrough</option>
            <option value="roadmap">Roadmap</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        
        {/* DIRECTORY SIDEBAR */}
        <div className="bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Filter className="w-3 h-3" /> Indexed ({filteredMemos.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredMemos.length > 0 ? filteredMemos.map(m => (
              <button key={m.id} onClick={() => setActiveMemo(m)} className={`w-full text-left p-4 rounded-lg transition-all border ${activeMemo?.id === m.id ? 'bg-amber-500/5 border-amber-500/30' : 'bg-transparent border-transparent hover:bg-zinc-900/50'}`}>
                <p className={`text-xs font-bold leading-tight mb-1 ${activeMemo?.id === m.id ? 'text-amber-500' : 'text-zinc-300'}`}>{m.title}</p>
                <div className="flex items-center justify-between mt-2 opacity-60">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">{m.week || 'Global'} • {m.category}</span>
                  {m.audience !== 'global' && <Target className="w-3 h-3 text-amber-500" />}
                </div>
              </button>
            )) : <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold text-center py-6">No matching records.</p>}
          </div>
        </div>

        {/* READER PANE */}
        <div className="md:col-span-3 bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
          {activeMemo ? (
            <div className="flex-1 overflow-y-auto p-8 md:p-14 custom-scrollbar bg-black">
              {/* Meta Data & Focus Button */}
              <div className="flex items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-900 text-zinc-400 text-[9px] font-black uppercase tracking-widest"><FileText className="w-3 h-3" /> {activeMemo.category}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><CalendarDays className="w-3 h-3" /> {new Date(activeMemo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {activeMemo.audience !== 'global' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest ml-auto"><Target className="w-3 h-3" /> Tailored For You</span>}
                </div>
                {/* MAXIMIZE BUTTON */}
                <button onClick={() => setIsFocusMode(true)} className="p-2 bg-zinc-900 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-500 rounded transition-colors" title="Enter Focus Mode">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight leading-tight">
                {activeMemo.title}
              </h1>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                  {activeMemo.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
              <FilePenLine className="w-12 h-12 text-zinc-700 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select a document from the index.</p>
            </div>
          )}
        </div>
      </div>

      {/* FOCUS MODE FULLSCREEN OVERLAY */}
      {isFocusMode && activeMemo && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md flex flex-col animate-in zoom-in-95 duration-200">
          
          {/* Focus Mode Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-black shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors bg-zinc-900 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNext} disabled={currentIndex === filteredMemos.length - 1} className="p-2 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors bg-zinc-900 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4 hidden sm:block">
                Document {currentIndex + 1} of {filteredMemos.length}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest hidden md:block">Focus Mode</span>
              <button onClick={() => setIsFocusMode(false)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded transition-colors border border-zinc-800">
                Exit <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Focus Mode Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-24 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2 block">
                  {activeMemo.week || 'Global'} • {activeMemo.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                  {activeMemo.title}
                </h1>
              </div>
              <div className="prose prose-invert prose-amber max-w-none text-zinc-300 leading-relaxed text-base md:text-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                  {activeMemo.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}