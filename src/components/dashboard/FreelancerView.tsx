"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();

  // --- 📟 SYSTEM STATES ---
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [paymentStep, setPaymentStep] = useState<"choice" | "card" | "mpesa">("choice");

  // --- 🚀 FIXED INTASEND UPLINK LOGIC ---
  const handleIntasendPayment = async (method: "M-PESA" | "CARD") => {
    if (method === "M-PESA" && mpesaNumber.length < 10) return alert("Invalid Format. Use 254...");
    if (!user?.id) return alert("Session Error: Please re-login.");

    setIsPaying(true);
    
    // Generate a clean, unique API Reference
    const uniqueRef = `node_v_${user.id.slice(-8)}_${Date.now()}`;

    try {
      const response = await fetch("/api/intasend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 910, // KES 910 ($7.00)
          phone: mpesaNumber.replace('+', ''), 
          email: user?.primaryEmailAddress?.emailAddress,
          firstName: user?.firstName || "Nexus",
          lastName: user?.lastName || "Node",
          method: method,
          api_ref: uniqueRef // Fixed unique reference
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Uplink Error: ${data.message || "Gateway rejected synchronization."}`);
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Gateway Error:", error);
      alert("📡 SIGNAL INTERRUPTED: Deployment cache may be old. Please redeploy on Vercel.");
      setIsPaying(false);
    }
  };

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

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Next.js Performance Audit", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "2 Days", img: "https://i.pravatar.cc/150?u=1" },
    { id: "3", title: "UI Engine Optimization", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "5 Hours", img: "https://i.pravatar.cc/150?u=3" },
    { id: "4", title: "Cyber Security Scan", budget: 1500, client: "Defi Pulse", rating: 5.0, dur: "7 Days", img: "https://i.pravatar.cc/150?u=4" },
    { id: "12", title: "Global Relay Setup", budget: 550, client: "Drop Ship", rating: 5.0, dur: "6 Days", img: "https://i.pravatar.cc/150?u=12" },
  ], []);

  const handleWithdrawal = () => {
    alert(`❌ INSUFFICIENT YIELD: Minimum withdrawal is $10.00. Current Balance: $0.00`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-4 px-4 text-white relative font-sans selection:bg-[#00f2ff]/30">
      
      {/* --- 🏠 TAB: HOME --- */}
      {activeTab === "home" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <header className="flex justify-between items-center bg-white/5 p-6 rounded-[35px] border border-white/10 shadow-2xl">
            <h2 className="text-xl font-black italic uppercase tracking-tighter underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-pulse shadow-[0_0_10px_#00f2ff]" />
               <span className="text-[8px] font-black uppercase tracking-widest">{isVerified ? "🏆 VERIFIED ELITE" : "SYNC PENDING"}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-8 bg-linear-to-br from-[#0a0f1e] to-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-[45px] shadow-2xl group hover:scale-[1.02] transition-all">
              <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2 italic tracking-widest">Yield Balance</p>
              <h3 className="text-4xl font-black italic mb-3">$0.00</h3>
              <button onClick={() => setActiveTab('earnings')} className="w-full mt-6 py-3 bg-white text-black font-black rounded-2xl text-[9px] uppercase hover:bg-[#00f2ff] transition-all shadow-xl tracking-[0.2em]">Settle Funds</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[45px] flex flex-col justify-center text-center shadow-xl">
               <p className="text-[10px] font-black uppercase text-gray-500 mb-2 italic">Relay Speed</p>
               <h3 className="text-4xl font-black italic text-[#00f2ff]">0.02<span className="text-xs text-gray-400">s</span></h3>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[45px] flex flex-col justify-center text-center shadow-xl">
               <p className="text-[10px] font-black uppercase text-gray-500 mb-2 italic">Success Index</p>
               <h3 className="text-4xl font-black italic text-emerald-500">100%</h3>
            </div>
          </div>

          {!isVerified && (
            <div className="p-10 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-[50px] relative overflow-hidden group shadow-2xl">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Protocol <span className="text-[#00f2ff]">Activation</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <p className="text-sm text-gray-400 italic leading-relaxed">Secure your standing on the Nexus grid. Verification unlocks high-ticket missions and cryptographic USD settlements.</p>
                     <button onClick={() => setShowVerifyModal(true)} className="px-10 py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[11px] italic hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/30 tracking-widest">Initialize Uplink ($7) →</button>
                  </div>
                  <div className="space-y-3 opacity-80">
                     {['Elite Badge Activation', 'Instant Payout Relay', '0% Marketplace Tax', 'Priority Mission Stream'].map(feat => (
                        <div key={feat} className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full shadow-[0_0_5px_#00f2ff]" />
                           <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">{feat}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* --- 💼 TAB: MISSION FEED --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
          <div className="flex justify-between items-end border-b border-white/5 pb-4 px-2">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Tactical <span className="text-[#00f2ff]">Missions</span></h3>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] animate-pulse italic">Scanning Satellite Relays...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceGigs.map(g => (
              <div key={g.id} className="p-8 rounded-[45px] bg-white/3 border border-white/10 hover:border-[#00f2ff]/40 group transition-all duration-500 shadow-2xl backdrop-blur-sm">
                <div className="flex justify-between items-start mb-8">
                   <img src={g.img} className="w-12 h-12 rounded-2xl border border-white/10 group-hover:rotate-6 transition-transform shadow-lg" alt="C" />
                   <p className="text-2xl font-black italic text-[#00f2ff] tracking-tighter">${g.budget}</p>
                </div>
                <h4 className="text-sm font-black italic uppercase mb-8 leading-tight tracking-tight min-h-10">{g.title}</h4>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <p className="text-[8px] font-black uppercase text-gray-500 italic tracking-widest">{g.dur}</p>
                   <button onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Bid Dispatched")} className="px-5 py-2.5 bg-white text-black text-[9px] font-black uppercase rounded-xl hover:bg-[#00f2ff] transition-all italic shadow-md">Bid Mission</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 📜 TAB: WORK (Contracts) --- */}
      {activeTab === "contracts" && (
        <div className="space-y-8 animate-in fade-in pt-10">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white text-center">Active <span className="text-amber-500">Engagements</span></h3>
          <div className="p-16 bg-white/2 border border-white/10 rounded-[60px] text-center space-y-8 shadow-2xl max-w-3xl mx-auto backdrop-blur-xl">
             <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-4xl text-amber-500 italic font-black animate-bounce shadow-2xl shadow-amber-500/10">!</div>
             <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] max-w-md mx-auto leading-loose italic">No active missions detected on your node. Your status is currently [UNVERIFIED]. Activation is required to build work history.</p>
             <button onClick={() => setShowVerifyModal(true)} className="px-12 py-5 bg-amber-500 text-black font-black rounded-2xl text-[10px] uppercase italic hover:scale-105 transition-all tracking-widest">Verify Node Now</button>
          </div>
        </div>
      )}

      {/* --- 💰 TAB: WALLET --- */}
      {activeTab === "earnings" && (
        <div className="space-y-10 animate-in fade-in">
           <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Nexus <span className="text-[#00f2ff]">Vault</span></h3>
              <button onClick={() => setCurrency(currency === "USD" ? "KES" : "USD")} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase italic hover:bg-white hover:text-black transition-all shadow-lg">Toggle {currency === "USD" ? "KES" : "USD"}</button>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="p-14 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[60px] text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ff]/5 blur-[80px] group-hover:bg-[#00f2ff]/10 transition-all" />
                 <p className="text-[11px] font-black text-[#00f2ff] uppercase italic tracking-[0.4em] mb-4">Available for Settle</p>
                 <h4 className="text-7xl font-black italic mb-2 tracking-tighter text-white">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
              </div>
              <div className="p-10 bg-white/2 border border-white/10 rounded-[60px] space-y-4 backdrop-blur-md shadow-2xl">
                 {['M-Pesa Settle', 'Direct Bank Relay', 'Web3 Token Swap'].map(m => (
                    <div key={m} onClick={handleWithdrawal} className="p-6 bg-black/40 border border-white/5 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-white/5 shadow-xl transition-all border-l-4 border-l-transparent hover:border-l-[#00f2ff]">
                       <span className="text-[10px] font-black uppercase italic text-gray-500 group-hover:text-white transition-all tracking-widest">{m}</span>
                       <span className="text-[#00f2ff] text-xl font-black italic group-hover:translate-x-2 transition-transform duration-300">›</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* --- 📊 TAB: ANALYTICS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95">
           <div className="p-12 bg-white/5 border border-white/10 rounded-[60px] flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl">
              <div className="flex items-end gap-3 h-32 mb-10">
                 {[25, 55, 35, 95, 70, 50].map((h, i) => <div key={i} className="w-5 bg-[#00f2ff]/20 rounded-t-lg group hover:bg-[#00f2ff] transition-all duration-700 shadow-[0_0_15px_rgba(0,242,255,0.1)]" style={{ height: `${h}%` }} />)}
              </div>
              <p className="text-[10px] font-black uppercase italic text-gray-500 tracking-[0.4em]">Global Performance Matrix</p>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {[
                { l: "Uplink Success", v: "100%", g: "ELITE" },
                { l: "Mission Bid Rate", v: "88%", g: "+12%" },
                { l: "Avg Relay Time", v: "0.02s", g: "FAST" }
              ].map(stat => (
                <div key={stat.l} className="p-7 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-[#00f2ff]/30 shadow-xl transition-all cursor-crosshair">
                   <p className="text-[11px] font-black uppercase italic text-gray-400 tracking-tighter">{stat.l}</p>
                   <div className="text-right"><p className="text-2xl font-black italic text-white tracking-tighter">{stat.v}</p><p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{stat.g}</p></div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION DOCK --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-2xl h-22 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex justify-around items-center px-6 border-t-white/20">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center p-3.5 rounded-2xl transition-all duration-500 group ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-110 shadow-[0_0_30px_rgba(0,242,255,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-[6px] font-black uppercase mt-1.5 tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* --- 🚨 MODAL: NODE ACTIVATION ($7.00 / KES 910) --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => !isPaying && setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[60px] p-12 text-center animate-in zoom-in-95 shadow-[0_0_100px_rgba(0,242,255,0.1)]">
            {paymentStep === "choice" ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-black italic uppercase text-[#00f2ff] mb-2 tracking-tighter">ACTIVATE <span className="text-white">NODE</span></h3>
                <p className="text-[11px] text-gray-500 font-black italic mb-10 uppercase tracking-widest leading-relaxed">Secure protocol uplink required for Elite standing on the grid.</p>
                <button onClick={() => setPaymentStep("card")} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[11px] italic shadow-xl hover:scale-105 transition-all">💳 SECURE CARD PORTAL</button>
                <button onClick={() => setPaymentStep("mpesa")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[11px] italic shadow-xl hover:scale-105 transition-all">📱 M-PESA UPLINK</button>
                <button onClick={() => setShowVerifyModal(false)} className="text-[10px] text-gray-700 font-black uppercase italic pt-8 hover:text-white transition-colors tracking-[0.3em]">Abort Sync</button>
              </div>
            ) : paymentStep === "mpesa" ? (
              <div className="space-y-7">
                <h3 className="text-xl font-black italic uppercase text-emerald-500 mb-2 tracking-tighter">M-PESA <span className="text-white">UPLINK</span></h3>
                <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-lg font-black outline-none focus:border-emerald-500 text-white tracking-[0.4em] shadow-inner" />
                <button disabled={isPaying} onClick={() => handleIntasendPayment("M-PESA")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[11px] italic shadow-2xl active:scale-95 transition-all">
                   {isPaying ? "ENCRYPTING..." : "PAY KES 910 ($7.00)"}
                </button>
                <button onClick={() => setPaymentStep("choice")} className="text-[10px] text-gray-500 font-black uppercase italic tracking-widest hover:text-white transition-colors">Back</button>
              </div>
            ) : (
              <div className="space-y-7">
                <h3 className="text-xl font-black italic uppercase text-[#00f2ff] mb-4 tracking-tighter">CARD <span className="text-white">ENCRYPTION</span></h3>
                <p className="text-[10px] text-gray-500 font-black uppercase italic mb-4 tracking-widest underline underline-offset-8 decoration-[#00f2ff]/20">Secure 256-bit Handshake</p>
                <button disabled={isPaying} onClick={() => handleIntasendPayment("CARD")} className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[11px] italic shadow-2xl active:scale-95 transition-all shadow-[#00f2ff]/20">
                  {isPaying ? "PROCESSING..." : "OPEN CHECKOUT ($7.00)"}
                </button>
                <button onClick={() => setPaymentStep("choice")} className="text-[10px] text-gray-500 font-black uppercase italic tracking-widest hover:text-white transition-colors">Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};