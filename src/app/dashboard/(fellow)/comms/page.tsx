'use client';

import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { MessageSquare, Send, ShieldCheck, Loader2, Clock } from 'lucide-react';

export default function FellowCommsRelay() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  
  // NOTE: Ensure this matches the exact email of your Admin account
  const ADMIN_EMAIL = 'contact.johnjlawal@gmail.com'; 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. ESTABLISH LINK
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        
        // Listen to channel
        const q = query(
          collection(db, 'messages'),
          where('participants', 'array-contains', user.email),
          orderBy('createdAt', 'asc')
        );

        const unsubMessages = onSnapshot(q, (snapshot) => {
          setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          setIsLoading(false);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubMessages();
      }
    });

    return () => unsubAuth();
  }, []);

  // 2. TRANSMIT
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userEmail) return;

    const text = newMessage;
    setNewMessage('');

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderEmail: userEmail,
        participants: [userEmail, ADMIN_EMAIL],
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Transmission Failed:", error);
      alert("Comms link severed. Try again.");
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col animate-in fade-in duration-700 pb-10">
      
      <header className="border-b border-zinc-900 pb-6 mb-6 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <MessageSquare className="w-3 h-3" /> Secure Comms Relay
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          The Dean's <span className="text-amber-500">Office</span>
        </h1>
      </header>

      {/* SECURE TERMINAL */}
      <div className="flex-1 bg-black border border-zinc-900 rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Terminal Header */}
        <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-white">
              Link Established: <span className="text-amber-500">Eseria Command</span>
            </span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-black to-black">
          {messages.length > 0 ? (
            messages.map(msg => {
              const isMe = msg.senderEmail === userEmail;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isMe && <ShieldCheck className="w-3 h-3 text-amber-500" />}
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${isMe ? 'text-zinc-500' : 'text-amber-500'}`}>
                      {isMe ? 'You' : 'The Dean'}
                    </span>
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${isMe ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tr-sm' : 'bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-tl-sm'}`}>
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Signal Pure. Awaiting transmission.</p>
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
              placeholder="Transmit inquiry or report..."
              className="flex-1 bg-black border border-zinc-800 p-4 text-sm text-white outline-none focus:border-amber-500 transition-colors rounded-lg"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 bg-amber-600 text-white hover:bg-amber-500 transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}