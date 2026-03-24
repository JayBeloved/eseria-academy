'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { 
  HardDrive, Plus, Trash2, ShieldAlert, 
  Target, Link as LinkIcon, Loader2, FileText, 
  LayoutTemplate, Code, Wrench, User, Edit2
} from 'lucide-react';

// Eseria Standard Categories
const CATEGORIES = [
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'templates', label: 'Templates' },
  { id: 'cheatsheets', label: 'Cheatsheets' },
  { id: 'tooling', label: 'Tooling' },
  { id: 'memos', label: 'Strategic Memos' },
];

export default function ArsenalEngine() {
  const [resources, setResources] = useState<any[]>([]);
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('frameworks');
  const [audience, setAudience] = useState('global');
  const [editId, setEditId] = useState<string | null>(null);

  // 1. DATA SYNC
  useEffect(() => {
    // Fetch Cohort for Audience Dropdown
    const fetchCohort = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '!=', 'admin'));
        const snap = await getDocs(q);
        setFellows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Roster Fetch Error:", err);
      }
    };
    fetchCohort();

    // Fetch Live Arsenal Assets
    const qResources = query(
      collection(db, 'resources'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(qResources, 
      (snapshot) => {
        setResources(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
      },
      (error) => {
        console.error("Arsenal Fetch Error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. ASSET DEPLOYMENT
  const handleDeployAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setIsDeploying(true);
    try {
      if (editId) {
        // UPDATE EXISTING ASSET
        await updateDoc(doc(db, 'resources', editId), {
          title, description, url, category, audience
        });
        setEditId(null);
      } else {
        // CREATE NEW ASSET
        await addDoc(collection(db, 'resources'), {
          title, description, url, category, audience,
          createdAt: Date.now() 
        });
      }
      // Reset Form
      setTitle(''); setDescription(''); setUrl('');
    } catch (error) {
      console.error("Asset Deployment Failed:", error);
      alert("Failed to deploy asset. Check console.");
    } finally {
      setIsDeploying(false);
    }
  };

  const cancelEdit = () => {
    setTitle(''); setDescription(''); setUrl(''); setCategory('frameworks'); setAudience('global'); setEditId(null);
  };

  const initiateEdit = (res: any) => {
    setTitle(res.title); setDescription(res.description); setUrl(res.url); setCategory(res.category); setAudience(res.audience); setEditId(res.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to form
  };

  // 3. DECOMMISSION ASSET
  const handleDeleteAsset = async (id: string) => {
    if (confirm("Eradicate this asset from the Eseria Arsenal?")) {
      await deleteDoc(doc(db, 'resources', id));
    }
  };

  const getCategoryIcon = (catId: string) => {
    switch(catId) {
      case 'frameworks': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'templates': return <LayoutTemplate className="w-4 h-4 text-rose-500" />;
      case 'cheatsheets': return <Code className="w-4 h-4 text-rose-500" />;
      case 'tooling': return <Wrench className="w-4 h-4 text-rose-500" />;
      case 'memos': return <FileText className="w-4 h-4 text-rose-500" />;
      default: return <HardDrive className="w-4 h-4 text-rose-500" />;
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header className="border-b border-rose-900/50 pb-8 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <HardDrive className="w-3 h-3" /> Asset Management
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Arsenal <span className="text-rose-500">Provisioning</span>
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">
            Global Tooling & Strategic Memos
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Active Assets</p>
          <div className="text-3xl font-black text-white">{resources.length}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: PROVISIONING CONSOLE */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-black border border-zinc-900 p-6 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2 mb-6 relative z-10">
              <Plus className="w-4 h-4" /> Drop Asset to Citadel
            </h2>

            <form onSubmit={handleDeployAsset} className="space-y-5 relative z-10">
              
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Target Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white uppercase outline-none focus:border-rose-500 transition-colors rounded-lg">
                  <option value="global">Global Broadcast</option>
                  {fellows.map(f => (
                    <option key={f.id} value={f.email}>{f.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Asset Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white uppercase outline-none focus:border-rose-500 transition-colors rounded-lg">
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Asset Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., The Blue Ocean Formula" className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Operational Context</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Why does the Fellow need this?" rows={3} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Secure URL</label>
                <input type="url" required value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isDeploying} className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all rounded-lg shadow-xl disabled:opacity-50 flex justify-center items-center">
                  {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? 'Update Asset' : 'Deploy Asset'}
                </button>
                {editId && (
                  <button type="button" onClick={cancelEdit} className="px-6 py-4 bg-zinc-900 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* COLUMN 2: LIVE ASSET INVENTORY */}
        <div className="lg:col-span-2">
          <section className="bg-black border border-zinc-900 p-6 md:p-8 rounded-xl h-full">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-8">
              <HardDrive className="w-4 h-4" /> Live Inventory Feed
            </h2>

            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((res) => (
                  <div key={res.id} className="group flex flex-col justify-between p-5 bg-zinc-950/50 border border-zinc-900 hover:border-rose-500/30 rounded-xl transition-colors">
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-rose-500/10 rounded-md">
                            {getCategoryIcon(res.category)}
                          </div>
                          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest border border-zinc-800 px-2 py-0.5 rounded-sm">
                            {CATEGORIES.find(c => c.id === res.category)?.label || res.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => initiateEdit(res)} className="p-1.5 text-zinc-600 hover:text-amber-500 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteAsset(res.id)} className="p-1.5 text-zinc-600 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-bold text-zinc-200 leading-tight mb-2">{res.title}</h3>
                      <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed mb-4">{res.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                      {res.audience === 'global' ? (
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                          <Target className="w-3 h-3" /> Global Payload
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                          <User className="w-3 h-3" /> Target: {fellows.find(f => f.email === res.audience)?.fullName?.split(' ')[0] || 'Unknown'}
                        </span>
                      )}
                      
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1">
                        Verify Link <LinkIcon className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-zinc-900 border-dashed rounded-xl">
                <HardDrive className="w-8 h-8 text-zinc-800 mb-4" />
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold italic">
                  Arsenal Empty. Provision assets for the cohort.
                </p>
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}