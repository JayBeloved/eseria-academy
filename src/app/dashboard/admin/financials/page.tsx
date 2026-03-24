'use client';

import React, { useState, useEffect } from 'react';
import { ReceiptModal } from '@/components/dashboard/ReceiptModal';
import { collection, query, orderBy, onSnapshot, addDoc, getDocs, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Wallet, Plus, Receipt, CheckCircle2, ShieldAlert, Loader2, Landmark, Clock, ExternalLink } from 'lucide-react';

export default function TreasuryEngine() {
  const [payments, setPayments] = useState<any[]>([]);
  const [fellows, setFellows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);

  // Minting Form State
  const [targetEmail, setTargetEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [coverage, setCoverage] = useState('Full 16-Week Citadel');
  const [notes, setNotes] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // 1. DATA SYNC
  useEffect(() => {
    const fetchCohort = async () => {
      const q = query(collection(db, 'users'), where('role', '!=', 'admin'));
      const snap = await getDocs(q);
      setFellows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchCohort();

    const qPayments = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. MINT OFFICIAL RECEIPT
  const handleMintReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !amount) return;

    setIsMinting(true);
    try {
      const targetFellow = fellows.find(f => f.email === targetEmail);
      const receiptId = `ESR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await addDoc(collection(db, 'payments'), {
        email: targetEmail,
        fellowName: targetFellow?.fullName || targetEmail,
        amount: Number(amount),
        currency: 'NGN',
        coverage: coverage,
        status: 'verified',
        receiptId: receiptId,
        notes: notes,
        createdAt: Date.now(),
        verifiedAt: Date.now()
      });

      setAmount(''); setNotes('');
      alert(`Receipt ${receiptId} minted and deployed to Fellow's dashboard.`);
    } catch (error) {
      console.error("Minting Failed:", error);
      alert("Failed to mint receipt. Check console.");
    } finally {
      setIsMinting(false);
    }
  };

  // 3. VERIFY FELLOW SUBMISSION
  const handleVerifyPayment = async (id: string, fellowName: string) => {
    if (!confirm(`Verify capital injection from ${fellowName} and mint official receipt?`)) return;

    try {
      const receiptId = `ESR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await updateDoc(doc(db, 'payments', id), {
        status: 'verified',
        receiptId: receiptId,
        verifiedAt: Date.now()
      });

    } catch (error) {
      console.error("Verification Failed:", error);
      alert("Failed to verify transaction. Check console.");
    }
  };

  // Calculate Total Revenue (Verified only)
  const totalRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header className="border-b border-rose-900/50 pb-8 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Landmark className="w-3 h-3" /> Eseria Treasury
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Financial <span className="text-rose-500">Ledger</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Total Verified Revenue</p>
          <div className="text-3xl font-black text-white">₦{totalRevenue.toLocaleString()}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: MINTING ENGINE */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-black border border-zinc-900 p-6 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2 mb-6 relative z-10">
              <Plus className="w-4 h-4" /> Mint Verified Receipt
            </h2>

            <form onSubmit={handleMintReceipt} className="space-y-5 relative z-10">
              
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Target Fellow</label>
                <select required value={targetEmail} onChange={e => setTargetEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white uppercase outline-none focus:border-rose-500 transition-colors rounded-lg">
                  <option value="" disabled>Select Fellow...</option>
                  {fellows.map(f => (
                    <option key={f.id} value={f.email}>{f.fullName} ({f.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Capital Injection (NGN)</label>
                <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 480000" className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg font-mono" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Coverage Assignment</label>
                <select value={coverage} onChange={e => setCoverage(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white uppercase outline-none focus:border-rose-500 transition-colors rounded-lg">
                  <option value="Full 16-Week Citadel">Full 16-Week Citadel</option>
                  <option value="Phase 1 Activation">Phase 1 Activation</option>
                  <option value="Phase 2 Continuation">Phase 2 Continuation</option>
                  <option value="Phase 3 Continuation">Phase 3 Continuation</option>
                  <option value="Phase 4 Finalization">Phase 4 Finalization</option>
                  <option value="Bi-Weekly Tranche (Part 1)">Bi-Weekly Tranche (Part 1)</option>
                  <option value="Bi-Weekly Tranche (Part 2)">Bi-Weekly Tranche (Part 2)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Ledger Notes (Optional)</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Sovereign Couple Discount" className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-rose-500 transition-colors rounded-lg" />
              </div>

              <button type="submit" disabled={isMinting} className="w-full py-4 mt-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all rounded-lg shadow-xl disabled:opacity-50 flex justify-center items-center">
                {isMinting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mint & Deploy Receipt'}
              </button>
            </form>
          </section>
        </div>

        {/* COLUMN 2: THE LEDGER */}
        <div className="lg:col-span-2">
          <section className="bg-black border border-zinc-900 p-6 md:p-8 rounded-xl h-full">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-8">
              <Wallet className="w-4 h-4" /> Global Master Ledger
            </h2>

            {payments.map((p) => (
                  <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-zinc-950/50 border border-zinc-900 rounded-xl transition-colors">
                    
                    {/* Identity & Details */}
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className={`p-3 rounded-lg border ${p.status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                        {p.status === 'verified' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">{p.fellowName}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{p.coverage}</p>
                        
                        {/* Proof Link (If uploaded by Fellow) */}
                        {p.proofUrl && (
                          <a 
                            href={p.proofUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest mt-2 bg-rose-500/10 px-2 py-1 rounded-sm transition-colors"
                          >
                            View Uploaded Proof <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {p.notes && <p className="text-[9px] text-rose-500 italic mt-2">{p.notes}</p>}
                      </div>
                    </div>

                    {/* Financials & Actions */}
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t border-zinc-900 pt-4 md:border-0 md:pt-0">
                      <div className="text-xl font-black text-white font-mono">
                        ₦{Number(p.amount).toLocaleString()}
                      </div>
                      
                      {p.status === 'verified' ? (
                        <button 
                          onClick={() => setSelectedReceipt(p)}
                          className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded transition-colors flex items-center gap-2"
                        >
                          <Receipt className="w-3 h-3" /> View Receipt
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Pending Verification
                          </span>
                          {/* The Verification Trigger */}
                          <button 
                            onClick={() => handleVerifyPayment(p.id, p.fellowName)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded transition-colors"
                          >
                            Verify & Mint
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
          </section>
        </div>

      </div>
    {/* RECEIPT MODAL ENGINE */}
    {selectedReceipt && (
        <ReceiptModal payment={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div> // Final closing div
  );
}