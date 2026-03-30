'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { FileText, Plus, Trash2, Save, Eye, Edit3, Loader2, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MemosEngine() {
  const [memos, setMemos] = useState<any[]>([]);
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Editor State
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('global');
  const [category, setCategory] = useState('brief');
  const [week, setWeek] = useState('Week 1'); // NEW: Week Tagging
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    const fetchCohort = async () => {
      const q = query(collection(db, 'users'), where('role', '!=', 'admin'));
      const snap = await getDocs(q);
      setFellows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchCohort();

    const qMemos = query(collection(db, 'memos'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qMemos, (snapshot) => {
      setMemos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert("Title and Content required.");
    setIsSaving(true);
    try {
      if (activeId) {
        await updateDoc(doc(db, 'memos', activeId), { title, content, audience, category, week, updatedAt: Date.now() });
      } else {
        const docRef = await addDoc(collection(db, 'memos'), {
          title, content, audience, category, week, createdAt: Date.now(), updatedAt: Date.now()
        });
        setActiveId(docRef.id);
      }
    } catch (error) {
      console.error("Save Failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = () => {
    setActiveId(null); setTitle(''); setContent(''); setAudience('global'); setCategory('brief'); setWeek('Week 1'); setViewMode('write');
  };

  const loadMemo = (m: any) => {
    setActiveId(m.id); setTitle(m.title); setContent(m.content); setAudience(m.audience); setCategory(m.category); setWeek(m.week || 'Week 1'); setViewMode('write');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Eradicate this memo?")) {
      await deleteDoc(doc(db, 'memos', id));
      if (activeId === id) handleCreateNew();
    }
  };

  const filteredMemos = memos.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const MarkdownComponents: any = {
    h1: ({node, ...props}: any) => <h1 className="text-3xl font-black text-white mt-8 mb-4 border-b border-zinc-800 pb-2" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-3" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-xl font-bold text-zinc-200 mt-4 mb-2" {...props} />,
    p: ({node, ...props}: any) => <p className="text-zinc-300 leading-relaxed mb-4 text-sm md:text-base" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside text-zinc-300 mb-4 space-y-2" {...props} />,
    a: ({node, ...props}: any) => <a className="text-rose-500 hover:text-rose-400 underline underline-offset-4" target="_blank" {...props} />,
    img: ({node, ...props}: any) => <img className="rounded-xl border border-zinc-800 my-6 max-w-full h-auto shadow-2xl" {...props} />,
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
          <div className="bg-zinc-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 flex justify-between">
            {match[1]} <span className="text-rose-500">Eseria Terminal</span>
          </div>
          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, background: '#000', padding: '1.5rem' }} {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>{children}</code>
      );
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-7xl mx-auto h-[85vh] flex flex-col animate-in fade-in duration-700 pb-10">
      
      <header className="border-b border-rose-900/50 pb-6 mb-6 shrink-0">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Strategic <span className="text-rose-500">Memos</span>
        </h1>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        
        {/* DIRECTORY SIDEBAR */}
        <div className="bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-900 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Directory</span>
            <button onClick={handleCreateNew} className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded"><Plus className="w-4 h-4" /></button>
          </div>
          {/* SEARCH BAR */}
          <div className="p-2 border-b border-zinc-900">
            <div className="relative">
              <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-zinc-900/50 text-white text-xs pl-7 pr-2 py-1.5 rounded outline-none border border-zinc-800 focus:border-rose-500 transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredMemos.map(m => (
              <div key={m.id} className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer ${activeId === m.id ? 'bg-zinc-900/80 border border-zinc-800' : 'hover:bg-zinc-950 border border-transparent'}`} onClick={() => loadMemo(m)}>
                <div className="min-w-0 pr-2">
                  <p className={`text-xs font-bold truncate ${activeId === m.id ? 'text-rose-500' : 'text-zinc-300'}`}>{m.title}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="p-1.5 text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* EDITOR PANE */}
        <div className="md:col-span-3 bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 flex flex-wrap gap-4 items-center justify-between shrink-0">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <select value={audience} onChange={e => setAudience(e.target.value)} className="bg-black border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 p-2 rounded outline-none focus:border-rose-500">
                <option value="global">Global Broadcast</option>
                {fellows.map(f => <option key={f.id} value={f.email}>Target: {f.fullName}</option>)}
              </select>
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 p-2 rounded outline-none focus:border-rose-500">
                <option value="brief">Strategic Brief</option>
                <option value="walkthrough">Walkthrough</option>
                <option value="roadmap">Roadmap</option>
                <option value="announcement">Announcement</option>
              </select>
              <select value={week} onChange={e => setWeek(e.target.value)} className="bg-black border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 p-2 rounded outline-none focus:border-rose-500">
                <option value="Global">Global / No Week</option>
                {[...Array(16)].map((_, i) => (
                  <option key={i} value={`Week ${i + 1}`}>Week {i + 1}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-900 rounded-md border border-zinc-800 p-1 mr-2">
                <button onClick={() => setViewMode('write')} className={`p-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${viewMode === 'write' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}><Edit3 className="w-3 h-3"/> Write</button>
                <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${viewMode === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}><Eye className="w-3 h-3"/> Preview</button>
              </div>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {activeId ? 'Update Memo' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-black">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Memo Title..." className="w-full bg-transparent text-3xl md:text-5xl font-black text-white outline-none mb-8 placeholder:text-zinc-800 tracking-tight" />
            
            {viewMode === 'write' ? (
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)}
                placeholder="# Enter Strategy\n\nUse Markdown for formatting:\n## Subheading\n**Bold Text**\n\n"
                className="w-full h-full min-h-[400px] bg-transparent text-sm md:text-base text-zinc-300 outline-none resize-none placeholder:text-zinc-800 leading-relaxed font-mono"
                />
            ) : (
              <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                      {content || 'No content to preview.'}
                  </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}