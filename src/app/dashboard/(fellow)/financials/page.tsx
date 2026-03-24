'use client';

import React, { useState, useEffect } from 'react';
import { ReceiptModal } from '@/components/dashboard/ReceiptModal';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '@/firebase/firebaseConfig';
import { 
  Landmark, Receipt, Upload, Clock, 
  CheckCircle2, CreditCard, Loader2, ShieldCheck, Image as ImageIcon
} from 'lucide-react';

export default function FellowFinancials() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  // Form State
  const [amount, setAmount] = useState('');
  const [coverage, setCoverage] = useState('Phase 1 Activation');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // 1. ESTABLISH LEDGER SYNC
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        setUserName(user.displayName || user.email);

        const q = query(
          collection(db, 'payments'),
          where('email', '==', user.email),
          orderBy('createdAt', 'desc')
        );

        const unsubPayments = onSnapshot(q, (snapshot) => {
          setPayments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          setIsLoading(false);
        });

        return () => unsubPayments();
      }
    });

    return () => unsubAuth();
  }, []);

  // 2. UPLOAD IMAGE & SUBMIT PROOF
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !proofFile || !auth.currentUser) return;

    setIsSubmitting(true);
    try {
      // A. Upload Image to Firebase Storage
      const fileExtension = proofFile.name.split('.').pop();
      const fileName = `receipt_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `receipts/${auth.currentUser.uid}/${fileName}`);
      
      await uploadBytes(storageRef, proofFile);
      const secureDownloadUrl = await getDownloadURL(storageRef);

      // B. Save Transaction to Firestore Ledger
      await addDoc(collection(db, 'payments'), {
        email: userEmail,
        fellowName: userName,
        amount: Number(amount),
        currency: 'NGN',
        coverage: coverage,
        status: 'pending',
        proofUrl: secureDownloadUrl, // The uploaded image URL
        createdAt: Date.now()
      });

      setAmount('');
      setProofFile(null);
      // Reset file input UI manually
      const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      alert("Transmission successful. Awaiting Dean verification.");
    } catch (error) {
      console.error("Submission Failed:", error);
      alert("Failed to securely upload proof. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="h-96 flex justify-center items-center"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      <header className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Landmark className="w-3 h-3" /> Eseria Treasury
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Financial <span className="text-amber-500">Ledger</span>
          </h1>
        </div>
      </header>

      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: WIRE INSTRUCTIONS & UPLINK */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-6">
              <CreditCard className="w-4 h-4" /> Routing Instructions
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Bank Name</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">Access Bank</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Account Beneficiary</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">John J. Lawal</p>
              </div>
              <div className="p-3 bg-black border border-zinc-800 rounded-lg flex justify-between items-center group">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Account Number</p>
                  <p className="text-lg font-mono font-black text-amber-500 tracking-widest">0769363008</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-zinc-900 p-6 rounded-xl shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-6">
              <Upload className="w-4 h-4" /> Transmit Payment Proof
            </h2>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Capital Injection (NGN)</label>
                <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 120000" className="w-full bg-zinc-950 border border-zinc-900 p-3 text-sm text-white outline-none focus:border-amber-500 transition-colors rounded-lg font-mono" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Coverage Assignment</label>
                <select value={coverage} onChange={e => setCoverage(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white uppercase outline-none focus:border-amber-500 transition-colors rounded-lg">
                  <option value="Full 16-Week Citadel">Full 16-Week Citadel</option>
                  <option value="Phase 1 Activation">Phase 1 Activation</option>
                  <option value="Phase 2 Continuation">Phase 2 Continuation</option>
                  <option value="Phase 3 Continuation">Phase 3 Continuation</option>
                  <option value="Phase 4 Finalization">Phase 4 Finalization</option>
                  <option value="Bi-Weekly Tranche (Part 1)">Bi-Weekly Tranche (Part 1)</option>
                  <option value="Bi-Weekly Tranche (Part 2)">Bi-Weekly Tranche (Part 2)</option>
                </select>
              </div>

              {/* DIRECT IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3"/> Attach Receipt (Image/PDF)
                </label>
                <input 
                  id="receipt-upload"
                  type="file" 
                  accept="image/*,application/pdf"
                  required 
                  onChange={e => setProofFile(e.target.files ? e.target.files[0] : null)} 
                  className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 outline-none transition-colors rounded-lg cursor-pointer" 
                />
              </div>

              <button type="submit" disabled={isSubmitting || !proofFile} className="w-full py-4 mt-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-lg shadow-xl disabled:opacity-50 flex justify-center items-center cursor-pointer">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transmit to Dean'}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMN 2: THE FELLOW'S LEDGER */}
        <div className="lg:col-span-2">
          <section className="bg-black border border-zinc-900 p-6 md:p-8 rounded-xl h-full">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-8">
              <Receipt className="w-4 h-4" /> Personal Transaction History
            </h2>

            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((p) => (
                  <div key={p.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl transition-colors border ${
                    p.status === 'verified' ? 'bg-zinc-950/50 border-emerald-500/20' : 'bg-black border-zinc-900'
                  }`}>
                    
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className={`p-3 rounded-lg border ${p.status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                        {p.status === 'verified' ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">{p.coverage}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-0.5">
                          {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t border-zinc-900 pt-4 md:border-0 md:pt-0">
                      <div className="text-xl font-black text-white font-mono">
                        ₦{Number(p.amount).toLocaleString()}
                      </div>
                      {p.status === 'verified' ? (
                        <button 
                          onClick={() => setSelectedReceipt(p)}
                          className="text-[9px] font-black text-emerald-500 hover:text-white uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/30 px-3 py-1.5 rounded-sm transition-colors border border-emerald-500/20"
                        >
                          <Receipt className="w-3 h-3" /> Print Document
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                          Pending Verification
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-zinc-900 border-dashed rounded-xl opacity-50">
                <Receipt className="w-8 h-8 text-zinc-700 mb-4" />
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold text-center max-w-xs">
                  No transactions detected. Inject capital via the routing instructions to activate clearance.
                </p>
              </div>
            )}
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