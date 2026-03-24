'use client';

import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { MessageSquare, Send, ShieldAlert, User, Loader2, Clock } from 'lucide-react';

export default function AdminCommsRelay() {
  const [fellows, setFellows] = useState<any[]>([]);
  const [selectedFellow, setSelectedFellow] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. INITIALIZE SWITCHBOARD
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setAdminEmail(user.email);
        // Fetch Cohort
        const qUsers = query(collection(db, 'users'), where('role', '!=', 'admin'));
        const snap = await getDocs(qUsers);
        setFellows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // 2. LISTEN TO SELECTED CHANNEL
  useEffect(() => {
    if (!selectedFellow || !adminEmail) return;

    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', selectedFellow.email),
      orderBy('createdAt', 'asc')
    );

    const unsubMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      // Auto-scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubMessages();
  }, [selectedFellow, adminEmail]);

  // 3. TRANSMIT MESSAGE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFellow) return;

    const text = newMessage;
    setNewMessage(''); // Optimistic clear

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderEmail: adminEmail,
        participants: [adminEmail, selectedFellow.email],
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Transmission Failed:", error);
      alert("Comms link severed. Try again.");
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto h-[85vh] flex flex-col animate-in fade-in duration-700 pb-10">
      
      <header className="border-b border-rose-900/50 pb-6 mb-6 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <MessageSquare className="w-3 h-3" /> Secure Comms Relay
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Direct <span className="text-rose-500">Feedback</span>
        </h1>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        
        {/* ROSTER SIDEBAR */}
        <div className="bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/50">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <User className="w-4 h-4" /> Cohort Channels
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {fellows.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFellow(f)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group ${selectedFellow?.id === f.id ? 'bg-rose-500/10 border border-rose-500/30' : 'bg-transparent hover:bg-zinc-900/50 border border-transparent'}`}
              >
                <div>
                  <p className={`text-xs font-bold uppercase tracking-tight ${selectedFellow?.id === f.id ? 'text-rose-500' : 'text-zinc-300 group-hover:text-white'}`}>
                    {f.fullName}
                  </p>
                  <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{f.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECURE TERMINAL */}
        <div className="md:col-span-2 bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
          {selectedFellow ? (
            <>
              {/* Terminal Header */}
              <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Link Established: <span className="text-rose-500">{selectedFellow.fullName}</span>
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/5 via-black to-black">
                {messages.length > 0 ? (
                  messages.map(msg => {
                    const isDean = msg.senderEmail === adminEmail;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isDean ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isDean && <ShieldAlert className="w-3 h-3 text-rose-500" />}
                          <span className={`text-[8px] font-bold uppercase tracking-widest ${isDean ? 'text-rose-500' : 'text-zinc-500'}`}>
                            {isDean ? 'The Dean' : selectedFellow.fullName?.split(' ')[0]}
                          </span>
                        </div>
                        <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${isDean ? 'bg-rose-500/10 border border-rose-500/20 text-rose-100 rounded-tr-sm' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[8px] text-zinc-600 font-mono mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-50">
                    <Clock className="w-8 h-8 text-zinc-700 mb-3" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No transmissions detected.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Engine */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Transmit directive..."
                    className="flex-1 bg-black border border-zinc-800 p-4 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 bg-rose-600 text-white hover:bg-rose-500 transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShieldAlert className="w-12 h-12 text-zinc-800 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Select a Fellow to establish a secure comms link.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}