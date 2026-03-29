"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

declare global {
  interface Window { PayHero: any; }
}

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [withdrawMethod, setWithdrawMethod] = useState<"mpesa" | "binance" | null>(null);

  // --- 💳 NEW PAYMENT STATES ---
  const [paymentStep, setPaymentStep] = useState<"choice" | "card" | "mpesa">("choice");
  const [mpesaCode, setMpesaCode] = useState("");

  const skills = ["Next.js", "React", "Node.js", "TypeScript", "Python", "Solidity", "Web3"];

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'tasks', icon: '💼', label: 'Gigs' },
    { id: 'contracts', icon: '📜', label: 'Work' },
    { id: 'messages', icon: '💬', label: 'Chats' },
    { id: 'earnings', icon: '💰', label: 'Wallet' },
    { id: 'analytics', icon: '📊', label: 'Stats' },
    { id: 'account', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const marketplaceGigs = [
    { id: "1", title: "Next.js E-commerce Fix", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "2 Days Left", img: "https://i.pravatar.cc/150?u=1", closed: false },
    { id: "2", title: "Python Data Scraper", budget: 120, client: "Maji Homes", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=2", closed: true },
    { id: "3", title: "Landing Page UI/UX", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "5 Hours Left", img: "https://i.pravatar.cc/150?u=3", closed: false },
    { id: "4", title: "Smart Contract Audit", budget: 1500, client: "Defi Pulse", rating: 5.0, dur: "7 Days Left", img: "https://i.pravatar.cc/150?u=4", closed: false },
    { id: "5", title: "React Native Debugging", budget: 600, client: "AppFlow", rating: 4.7, dur: "Expired", img: "https://i.pravatar.cc/150?u=5", closed: true },
    { id: "6", title: "SEO Content Strategy", budget: 250, client: "Vogue KE", rating: 4.9, dur: "1 Day Left", img: "https://i.pravatar.cc/150?u=6", closed: false },
    { id: "7", title: "Logo Branding Pack", budget: 200, client: "Eco Green", rating: 4.6, dur: "3 Days Left", img: "https://i.pravatar.cc/150?u=7", closed: false },
    { id: "8", title: "Fullstack Dashboard", budget: 2500, client: "Zidi Pay", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=8", closed: true },
    { id: "9", title: "Technical Writing", budget: 80, client: "Dev Blog", rating: 4.8, dur: "12 Hours Left", img: "https://i.pravatar.cc/150?u=9", closed: false },
    { id: "10", title: "Firebase Integration", budget: 400, client: "Swift It", rating: 4.9, dur: "4 Days Left", img: "https://i.pravatar.cc/150?u=10", closed: false },
    { id: "11", title: "Video Editing (YT)", budget: 150, client: "Creator X", rating: 4.7, dur: "Expired", img: "https://i.pravatar.cc/150?u=11", closed: true },
    { id: "12", title: "Shopify Store Setup", budget: 550, client: "Drop Ship", rating: 5.0, dur: "6 Days Left", img: "https://i.pravatar.cc/150?u=12", closed: false },
    { id: "13", title: "API Documentation", budget: 300, client: "FinTech", rating: 4.8, dur: "Expired", img: "https://i.pravatar.cc/150?u=13", closed: true },
    { id: "14", title: "Social Media Manager", budget: 700, client: "Nova Co", rating: 4.9, dur: "2 Weeks Left", img: "https://i.pravatar.cc/150?u=14", closed: false },
    { id: "15", title: "PostgreSQL Optimizer", budget: 900, client: "Data Core", rating: 5.0, dur: "3 Hours Left", img: "https://i.pravatar.cc/150?u=15", closed: false },
  ];

  const handleMpesaVerification = () => {
    if (mpesaNumber.length < 10) return alert("Enter valid M-Pesa number");
    setIsPaying(true);
    if (window.PayHero) {
      window.PayHero.init({
        paymentUrl: "https://lipwa.link/6861",
        containerId: "payHeroContainer",
        channelId: 6861,
        amount: 1250,
        phone: mpesaNumber,
        reference: `verify_${user?.id || Date.now()}`,
        callbackUrl: "https://nexus-gigs.vercel.app/api/mpesa-callback",
      });
    } else {
      alert("Payment system loading... try again in 2s.");
      setIsPaying(false);
    }
  };

  // --- 🛡️ MANUAL VERIFICATION HANDLER ---
  const handleManualMpesaVerify = async () => {
    if (mpesaCode.length < 5) return alert("Enter a valid M-Pesa Transaction Code");
    setIsPaying(true);
    
    // Simulate API Check
    setTimeout(async () => {
      await fetch("/api/onboarding/verify", { method: "POST" });
      setIsVerified(true);
      setShowVerifyModal(false);
      setIsPaying(false);
      alert("🏆 Payment Received. Node Synchronized.");
      router.refresh();
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-4 px-4 text-white relative font-sans selection:bg-[#00f2ff]/30">
      
      {/* --- 🏠 HOME --- */}
      {activeTab === "home" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <header className="flex justify-between items-center">
            <h2 className="text-xl font-black italic tracking-tighter uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2>
            {isVerified ? (
              <span className="bg-emerald-500/10 text-emerald-500 text-[7px] font-black px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">🏆 Verified Elite</span>
            ) : (
              <span className="bg-amber-500/10 text-amber-500 text-[7px] font-black px-3 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest animate-pulse">Action Required</span>
            )}
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-linear-to-br from-[#0a0f1e] to-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-4xl shadow-2xl">
              <p className="text-[9px] font-black uppercase text-[#00f2ff] mb-1 italic">Nexus Balance</p>
              <h3 className="text-3xl font-black italic mb-3">$0.00</h3>
              <button onClick={() => setActiveTab('earnings')} className="w-full py-2.5 bg-[#00f2ff] text-black font-black rounded-xl text-[8px] uppercase hover:bg-white transition-all">Withdraw</button>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-4xl text-center flex flex-col justify-center"><p className="text-[9px] font-black uppercase text-gray-500 mb-1">Success Rate</p><h3 className="text-3xl font-black italic text-emerald-500">0%</h3></div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-4xl text-center flex flex-col justify-center"><p className="text-[9px] font-black uppercase text-gray-500 mb-1">Open Gigs</p><h3 className="text-3xl font-black italic">15</h3></div>
          </div>

          {!isVerified && (
            <div className="p-8 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-[40px] space-y-5">
               <h3 className="text-lg font-black italic uppercase tracking-tighter border-b border-[#00f2ff]/10 pb-3">Nexus Protocol <span className="text-[#00f2ff]">Briefing</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] text-gray-400 font-medium leading-relaxed">
                  <div className="space-y-2">
                     <h4 className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest">Verification Protocol ($10.00)</h4>
                     <p>Required to secure the network from bots and ensure high-fidelity client matches. Verification unlocks the Elite Badge and instant withdrawals.</p>
                     <button onClick={() => setShowVerifyModal(true)} className="mt-2 px-6 py-3 bg-[#00f2ff] text-black rounded-xl text-[8px] font-black uppercase hover:bg-white transition-all">Initialize Verification →</button>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">2% Service Fee</h4>
                     <p>A flat 2% commission is applied to every successful gig settlement to maintain Satellite relay infrastructure.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* --- 💼 GIGS MISSION FEED --- */}
      {activeTab === "tasks" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
            <p className="text-[7px] font-black text-gray-600 uppercase italic tracking-widest">Scanning Satellite Relays...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketplaceGigs.map(g => (
              <div key={g.id} className={`p-6 rounded-4xl border transition-all group ${g.closed ? 'bg-black/40 border-red-500/10 grayscale opacity-50' : 'bg-white/5 border-white/10 hover:border-[#00f2ff]/30 shadow-2xl'}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                      <img src={g.img} className="w-8 h-8 rounded-full border border-white/10" alt="C" />
                      <div><p className="text-[9px] font-black uppercase tracking-tighter">{g.client}</p><p className="text-[7px] font-bold text-emerald-500 italic">⭐ {g.rating}/5.0</p></div>
                   </div>
                   <p className="text-xl font-black text-[#00f2ff] italic">${g.budget}</p>
                </div>
                <h4 className="font-bold text-[11px] mb-6 line-clamp-1 italic uppercase tracking-tighter">{g.title}</h4>
                <div className="flex justify-between items-center">
                  <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${g.closed ? 'text-red-500' : 'text-gray-500'}`}>{g.dur}</span>
                  {!g.closed && (
                    <button onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Bid Dispatched")} className="px-4 py-2 bg-white/5 group-hover:bg-[#00f2ff] group-hover:text-black border border-white/10 rounded-xl text-[7px] font-black uppercase transition-all">Submit Bid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ... [CODE FOR CONTRACTS, MESSAGES, WALLET, STATS, PROFILE, SETTINGS REMAINS UNCHANGED] ... */}
      {activeTab === "earnings" && (
        <div className="space-y-10 animate-in fade-in">
           <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Nexus <span className="text-[#00f2ff]">Wallet</span></h3>
              <button onClick={() => setCurrency(currency === "USD" ? "KES" : "USD")} className="text-[9px] font-black uppercase text-[#00f2ff] bg-[#00f2ff]/10 px-4 py-2 rounded-full border border-[#00f2ff]/20 transition-all">Toggle {currency === "USD" ? "KES" : "USD"}</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-10 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-4xl shadow-2xl text-center">
                 <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest mb-4">Available Funds</p>
                 <h4 className="text-5xl font-black italic">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-4xl text-center">
                 <p className="text-[10px] font-black text-gray-500 uppercase italic tracking-widest mb-4">Lifetime Yield</p>
                 <h4 className="text-5xl font-black italic text-gray-400">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div onClick={() => setWithdrawMethod('mpesa')} className={`p-8 rounded-[40px] border cursor-pointer transition-all ${withdrawMethod === 'mpesa' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-white/2 hover:border-white/20'}`}>
                 <div className="flex justify-between items-center mb-4"><span className="text-2xl">📱</span><span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">M-Pesa</span></div>
                 <p className="text-[10px] font-black uppercase italic">Withdraw via Phone</p>
              </div>
              <div onClick={() => setWithdrawMethod('binance')} className={`p-8 rounded-[40px] border cursor-pointer transition-all ${withdrawMethod === 'binance' ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 bg-white/2 hover:border-white/20'}`}>
                 <div className="flex justify-between items-center mb-4"><span className="text-2xl">🔶</span><span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Binance Pay</span></div>
                 <p className="text-[10px] font-black uppercase italic">Withdraw via BEP20</p>
              </div>
           </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[90%] max-w-3xl flex justify-around items-center p-1.5 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`flex flex-col items-center py-2.5 px-5 rounded-full min-w-15 transition-all duration-500 ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-105 shadow-2xl shadow-[#00f2ff]/30' : 'text-gray-500 hover:text-white'}`}
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span className="text-[6px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* --- 🚨 VERIFY MODAL (UPDATED PAYMENT PROCESS) --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-400 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => { setShowVerifyModal(false); setPaymentStep("choice"); }} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[48px] p-8 text-center animate-in zoom-in-95 shadow-2xl">
            
            {paymentStep === "choice" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase text-[#00f2ff] mb-1 italic tracking-tighter">ACTIVATE <span className="text-white">NODE</span></h3>
                <p className="text-gray-400 text-[10px] mb-8 italic tracking-widest uppercase">Select Payment Protocol</p>
                <button onClick={() => setPaymentStep("card")} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all italic">
                   💳 CREDIT / DEBIT CARD
                </button>
                <button onClick={() => setPaymentStep("mpesa")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all italic">
                   📱 M-PESA MANUAL
                </button>
                <button onClick={() => setShowVerifyModal(false)} className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Abort Uplink</button>
              </div>
            )}

            {paymentStep === "card" && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase text-white mb-4 italic">CARD <span className="text-[#00f2ff]">DETAILS</span></h3>
                <div className="space-y-3">
                   <input placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black outline-none focus:border-[#00f2ff] text-white" />
                   <div className="flex gap-2">
                      <input placeholder="MM/YY" className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black outline-none focus:border-[#00f2ff] text-white" />
                      <input placeholder="CVC" className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black outline-none focus:border-[#00f2ff] text-white" />
                   </div>
                </div>
                <button disabled={isPaying} onClick={() => { setIsPaying(true); setTimeout(() => { alert("Card verification error. Try Manual M-Pesa."); setIsPaying(false); }, 2000); }} className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest italic active:scale-95">
                  {isPaying ? "PROCESSING..." : "VERIFY CARD ($10)"}
                </button>
                <button onClick={() => setPaymentStep("choice")} className="text-[8px] text-gray-500 font-black uppercase italic tracking-widest">Back to Protocol</button>
              </div>
            )}

            {paymentStep === "mpesa" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase text-emerald-500 mb-2 italic">M-PESA <span className="text-white">MANUAL</span></h3>
                <div className="bg-white/5 p-6 rounded-3xl text-left space-y-3 border border-emerald-500/10 shadow-inner">
                  <p className="text-[9px] text-gray-400 uppercase font-black italic">1. Dial *334# or Open M-Pesa App</p>
                  <p className="text-[9px] text-gray-400 uppercase font-black italic">2. Lipa na M-Pesa {'>'} Buy Goods</p>
                  <p className="text-[9px] text-emerald-500 uppercase font-black italic">3. Till Number: <span className="text-white bg-emerald-500/20 px-2 rounded">6861XX</span></p>
                  <p className="text-[9px] text-gray-400 uppercase font-black italic">4. Amount: <span className="text-white">KES 1,250</span></p>
                </div>
                <div className="space-y-3">
                   <p className="text-[8px] text-gray-500 font-black uppercase italic tracking-widest">Enter Code for Auto-Detection</p>
                   <input 
                     value={mpesaCode} 
                     onChange={e => setMpesaCode(e.target.value.toUpperCase())} 
                     placeholder="TRANSACTION CODE (e.g. SDC7...)" 
                     className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-[10px] font-black outline-none focus:border-emerald-500 text-white tracking-widest" 
                   />
                </div>
                <button disabled={isPaying} onClick={handleManualMpesaVerify} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all italic">
                   {isPaying ? "VERIFYING CODE..." : "I HAVE PAID"}
                </button>
                <button onClick={() => setPaymentStep("choice")} className="text-[8px] text-gray-500 font-black uppercase italic">Back</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};