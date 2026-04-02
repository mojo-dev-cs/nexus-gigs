"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [withdrawMethod, setWithdrawMethod] = useState<"mpesa" | "bank" | null>(null);

  const [paymentStep, setPaymentStep] = useState<"choice" | "card" | "mpesa">("choice");

  // --- 🛰️ INTASEND TIER-1 UPLINK (FIXED $7.00 / KES 910) ---
  const handleIntasendPayment = async (method: "M-PESA" | "CARD") => {
    if (method === "M-PESA" && mpesaNumber.length < 10) return alert("Enter valid M-Pesa number");
    
    setIsPaying(true);
    try {
      const response = await fetch("/api/intasend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // SET TO $7.00 (~910 KES) TO STAY UNDER YOUR TIER-1 KES 1,000 LIMIT
          amount: 910, 
          phone: mpesaNumber,
          email: user?.primaryEmailAddress?.emailAddress,
          firstName: user?.firstName || "Nexus",
          lastName: user?.lastName || "Operator",
          method: method,
          // Passing user ID as api_ref so the webhook knows who paid
          api_ref: user?.id 
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to live IntaSend secure environment
        window.location.href = data.url;
      } else {
        console.error("IntaSend Init Failed:", data);
        alert(`Uplink Error: ${data.message || "Invalid API Handshake"}`);
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Payment Gateway Error:", error);
      alert("📡 SIGNAL LOST: Could not connect to IntaSend. Check Vercel Environment Variables.");
      setIsPaying(false);
    }
  };

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

  // Logic to show marketplace gigs (remains same)
  const marketplaceGigs = [
    { id: "1", title: "Next.js E-commerce Fix", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "2 Days Left", img: "https://i.pravatar.cc/150?u=1", closed: false },
    { id: "3", title: "Landing Page UI/UX", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "5 Hours Left", img: "https://i.pravatar.cc/150?u=3", closed: false },
    { id: "4", title: "Smart Contract Audit", budget: 1500, client: "Defi Pulse", rating: 5.0, dur: "7 Days Left", img: "https://i.pravatar.cc/150?u=4", closed: false },
  ];

  const handleWithdrawal = (method: string) => {
    alert(`❌ INSUFFICIENT FUNDS: Minimum withdrawal is $10.00. Current Balance: $0.00`);
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
              <span className="bg-amber-500/10 text-amber-500 text-[7px] font-black px-3 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest animate-pulse">Verification Required</span>
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
                     <h4 className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest">Verification Protocol ($7.00)</h4>
                     <p>Required to secure the network and unlock the Elite Badge. Tier-1 limits apply: All transactions processed securely via IntaSend.</p>
                     <button onClick={() => setShowVerifyModal(true)} className="mt-2 px-5 py-2.5 bg-[#00f2ff] text-black rounded-xl text-[8px] font-black uppercase hover:bg-white transition-all shadow-lg shadow-[#00f2ff]/20">Initialize Verification →</button>
                  </div>
                  <div className="space-y-2 opacity-50">
                     <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic leading-tight">Elite Standing</h4>
                     <p>Verified nodes receive priority mission briefs and 0.02s relay speed on all financial settlements.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* --- 💼 GIGS MISSION FEED --- */}
      {activeTab === "tasks" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketplaceGigs.map(g => (
              <div key={g.id} className="p-6 rounded-4xl border bg-white/5 border-white/10 hover:border-[#00f2ff]/30 shadow-2xl group transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                      <img src={g.img} className="w-8 h-8 rounded-full border border-white/10" alt="C" />
                      <div><p className="text-[9px] font-black uppercase tracking-tighter">{g.client}</p></div>
                   </div>
                   <p className="text-xl font-black text-[#00f2ff] italic">${g.budget}</p>
                </div>
                <h4 className="font-bold text-[11px] mb-6 line-clamp-1 italic uppercase tracking-tighter">{g.title}</h4>
                <button onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Bid Dispatched")} className="w-full py-2 bg-white/5 group-hover:bg-white group-hover:text-black border border-white/10 rounded-xl text-[7px] font-black uppercase transition-all italic">Submit Bid</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 💰 WALLET --- */}
      {activeTab === "earnings" && (
        <div className="space-y-8 animate-in fade-in">
           <h3 className="text-3xl font-black uppercase italic tracking-tighter">Nexus <span className="text-[#00f2ff]">Wallet</span></h3>
           <div className="p-8 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-4xl shadow-2xl text-center">
              <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest mb-3">Available Balance</p>
              <h4 className="text-5xl font-black italic">$0.00</h4>
           </div>
           <div onClick={() => handleWithdrawal('mpesa')} className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center cursor-pointer hover:bg-white/10 transition-all">
              <p className="text-[10px] font-black text-gray-500 uppercase italic">Initiate Withdrawal</p>
              <span className="text-[8px] font-black text-[#00f2ff] uppercase tracking-[0.3em]">$10.00 MIN</span>
           </div>
        </div>
      )}

      {/* --- 👤 PROFILE --- */}
      {activeTab === "account" && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
           <div className="bg-white/2 border border-white/10 rounded-4xl p-10 flex flex-col items-center text-center">
              <img src={user?.imageUrl} className="w-24 h-24 rounded-full border-4 border-[#00f2ff]/20 mb-6 shadow-2xl" alt="Profile" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{user?.fullName}</h3>
              <p className="text-[8px] font-black text-[#00f2ff] uppercase tracking-[0.4em] mt-2 italic">NODE ID: {user?.id.slice(0,10)}</p>
              <div className="w-full mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                 <div className="text-left"><p className="text-[7px] text-gray-500 font-black uppercase italic">Role</p><p className="text-[10px] font-black uppercase">FREELANCE NODE</p></div>
                 <div className="text-right"><p className="text-[7px] text-gray-500 font-black uppercase italic">Sync Status</p><p className="text-[10px] font-black uppercase text-emerald-500">LIVE</p></div>
              </div>
           </div>
        </div>
      )}

      {/* --- ⚙️ SETTINGS --- */}
      {activeTab === "settings" && (
        <div className="max-w-md mx-auto space-y-4 animate-in fade-in">
           <div className="p-8 bg-white/2 rounded-4xl text-center border border-white/5 shadow-2xl">
              <SignOutButton><button className="w-full py-4 bg-red-900/10 border border-red-500/20 text-red-500 font-black rounded-2xl text-[9px] uppercase tracking-[0.3em] hover:bg-red-500/10 active:scale-95 transition-all italic">Terminate Satellite Session</button></SignOutButton>
           </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[90%] max-w-3xl flex justify-around items-center p-1.5 bg-[#0a0f1e]/95 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center py-2.5 px-5 rounded-full min-w-15 transition-all duration-500 ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-105' : 'text-gray-500 hover:text-white'}`}>
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span className="text-[6px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* --- 🚨 VERIFY MODAL ($7.00 / KES 910) --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-400 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => { if(!isPaying) setShowVerifyModal(false); }} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[48px] p-10 text-center animate-in zoom-in-95 shadow-2xl shadow-[#00f2ff]/5">
            
            {paymentStep === "choice" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase text-[#00f2ff] mb-1 italic tracking-tighter">ACTIVATE <span className="text-white">NODE</span></h3>
                <p className="text-gray-400 text-[9px] mb-8 italic tracking-widest uppercase">Encryption: Tier-1 Secure</p>
                <button onClick={() => setPaymentStep("card")} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-all italic shadow-xl shadow-white/5">
                    💳 SECURE CARD GATEWAY
                </button>
                <button onClick={() => setPaymentStep("mpesa")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-all italic shadow-lg shadow-emerald-600/10">
                    📱 M-PESA UPLINK
                </button>
                <button onClick={() => setShowVerifyModal(false)} className="text-[8px] text-gray-600 font-black uppercase tracking-widest italic pt-4">Abort Uplink</button>
              </div>
            )}

            {paymentStep === "mpesa" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase text-emerald-500 mb-2 italic tracking-tighter">M-PESA <span className="text-white">UPLINK</span></h3>
                <p className="text-[9px] text-gray-400 uppercase font-black italic mb-4">Enter Phone for STK Prompt</p>
                <input 
                   value={mpesaNumber} 
                   onChange={e => setMpesaNumber(e.target.value)} 
                   placeholder="2547XXXXXXXX" 
                   className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-[11px] font-black outline-none focus:border-emerald-500 text-white tracking-widest" 
                />
                <button disabled={isPaying} onClick={() => handleIntasendPayment("M-PESA")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all italic">
                   {isPaying ? "ENCRYPTING SIGNAL..." : "PAY KES 910 ($7.00)"}
                </button>
                <button onClick={() => setPaymentStep("choice")} className="text-[8px] text-gray-500 font-black uppercase italic">Back</button>
              </div>
            )}

            {paymentStep === "card" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase text-[#00f2ff] mb-4 italic tracking-tighter">CARD <span className="text-white">ENCRYPTION</span></h3>
                <p className="text-[9px] text-gray-400 uppercase font-black italic mb-8">Protocol: Secure 128-bit Handshake</p>
                <button disabled={isPaying} onClick={() => handleIntasendPayment("CARD")} className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest italic shadow-xl shadow-[#00f2ff]/20 active:scale-95 transition-all">
                  {isPaying ? "PROCESSING..." : "OPEN SECURE CHECKOUT ($7)"}
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