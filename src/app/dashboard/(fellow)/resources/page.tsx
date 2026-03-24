'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HardDrive, ExternalLink, FileText, 
  Wrench, Code, LayoutTemplate, Loader2, Search 
} from 'lucide-react';
import { auth, db } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// Category Configuration mapped to Icons
const CATEGORIES = [
  { id: 'all', label: 'All Assets', icon: HardDrive },
  { id: 'memos', label: 'Memos & Briefs', icon: FileText },
  { id: 'frameworks', label: 'Frameworks', icon: FileText },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'cheatsheets', label: 'Cheatsheets', icon: Code },
  { id: 'tooling', label: 'Tooling', icon: Wrench },
];

export default function ResourceHub() {
  const [resources, setResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. DATA STREAM: Fetch Global + Tailored Resources
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const q = query(
          collection(db, "resources"),
          where("audience", "in", ["global", user.email]),
          orderBy("createdAt", "desc")
        );

        const unsubResources = onSnapshot(q, 
          (snapshot) => {
            setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
          },
          (error) => {
            console.error("Arsenal Sync Error (Check Index):", error);
            setIsLoading(false);
          }
        );
        return () => unsubResources();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. FILTER & SEARCH ENGINE
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesTab = activeTab === 'all' || res.category === activeTab;
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [resources, activeTab, searchQuery]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold animate-pulse">Unlocking Arsenal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <HardDrive className="w-3 h-3" /> Eseria Knowledge Base
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">The <span className="text-amber-500">Arsenal</span></h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">Tactical Assets & Tooling</p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </header>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                isActive 
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => {
              // Find the icon for the specific category
              const CategoryIcon = CATEGORIES.find(c => c.id === res.category)?.icon || FileText;

              return (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col bg-black border border-zinc-900 hover:border-amber-500/50 rounded-xl overflow-hidden transition-all h-full"
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg group-hover:border-amber-500/30 transition-colors">
                        <CategoryIcon className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest bg-zinc-950 px-2 py-1 border border-zinc-900 rounded-sm">
                        {res.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{res.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                      {res.description}
                    </p>
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 mt-auto">
                    <a 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-amber-500 transition-colors"
                    >
                      Access Asset <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center border border-zinc-900 border-dashed rounded-xl"
            >
              <HardDrive className="w-10 h-10 text-zinc-800 mb-4" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold text-center max-w-sm">
                No assets found matching the current parameters. Adjust your filters or await Dean provisioning.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}