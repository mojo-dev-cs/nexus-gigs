"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ✅ Extend window for IntaSend SDK
declare global {
  interface Window { IntaSend: any; }
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

  // ✅ NEW: IntaSend Implementation
  const handleIntaSendPayment = () => {
    if (mpesaNumber.length < 10) return alert("Enter valid M-Pesa number");
    
    if (!window.IntaSend) {
      return alert("Payment relay initializing... wait 2s.");
    }

    const intasend = new window.IntaSend({
      publicAPIKey: process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY,
      live: true, // Switch to false for Sandbox
    });

    intasend.run({
      amount: 1250,
      currency: "KES",
      label: "Nexus Node Activation",
      phone_number: mpesaNumber,
      email: user?.emailAddresses[0].emailAddress,
      first_name: user?.firstName,
      last_name: user?.lastName,
      api_ref: `verify_${user?.id}`,
    })
    .on("COMPLETE", async (response: any) => {
      setIsVerified(true);
      setShowVerifyModal(false);
      setIsPaying(false);
      
      // ✅ Trigger Metadata Update
      await fetch("/api/onboarding/verify", { method: "POST" });
      alert("🏆 NODE ACTIVATED. Welcome to Nexus Elite.");
      router.refresh();
    })
    .on("FAILED", () => {
      setIsPaying(false);
      alert("Payment failed. Please try again.");
    })
    .on("IN-PROGRESS", () => {
      setIsPaying(true);
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 text-white relative font-sans selection:bg-[#00f2ff]/30">
      
      {/* --- 🏠 HOME --- */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <header className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2>
            {isVerified ? (
              <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">🏆 Verified Elite</span>
            ) : (
              <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest animate-pulse">Action Required</span>
            )}
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-linear-to-br from-[#0a0f1e] to-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2 italic">Nexus Balance</p>
              <h3 className="text-4xl font-black italic mb-2">$0.00</h3>
              <button onClick={() => setActiveTab('earnings')} className="w-full py-3 bg-[#00f2ff] text-black font-black rounded-xl text-[9px] uppercase hover:bg-white transition-all">Withdraw</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Success Rate</p><h3 className="text-4xl font-black italic text-emerald-500">0%</h3></div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Open Gigs</p><h3 className="text-4xl font-black italic">15</h3></div>
          </div>

          {!isVerified && (
            <div className="p-10 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-[48px] space-y-6">
               <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-[#00f2ff]/10 pb-4">Nexus Protocol <span className="text-[#00f2ff]">Briefing</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-gray-400 font-medium leading-relaxed">
                  <div className="space-y-3">
                     <h4 className="text-xs font-black text-[#00f2ff] uppercase italic tracking-widest">Verification Protocol ($10.00)</h4>
                     <p>Required to secure the network from bots and ensure high-fidelity client matches. Verification unlocks the Elite Badge and instant withdrawals.</p>
                     <button onClick={() => setShowVerifyModal(true)} className="mt-2 px-6 py-3 bg-[#00f2ff] text-black rounded-xl text-[9px] font-black uppercase hover:bg-white transition-all">Initialize Verification →</button>
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xs font-black text-white uppercase tracking-widest italic">2% Service Fee</h4>
                     <p>A flat 2% commission is applied to every successful gig settlement to maintain Satellite relay infrastructure.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* --- 💼 GIGS MISSION FEED --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
            <p className="text-[8px] font-black text-gray-600 uppercase italic tracking-widest">Scanning Satellite Relays...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceGigs.map(g => (
              <div key={g.id} className={`p-8 rounded-[40px] border transition-all group ${g.closed ? 'bg-black/40 border-red-500/10 grayscale opacity-50' : 'bg-white/5 border-white/10 hover:border-[#00f2ff]/30 shadow-2xl'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <img src={g.img} className="w-10 h-10 rounded-full border border-white/10" alt="C" />
                      <div><p className="text-[10px] font-black uppercase tracking-tighter">{g.client}</p><p className="text-[8px] font-bold text-emerald-500 italic">⭐ {g.rating}/5.0</p></div>
                   </div>
                   <p className="text-2xl font-black text-[#00f2ff] italic">${g.budget}</p>
                </div>
                <h4 className="font-bold text-sm mb-8 line-clamp-1 italic uppercase tracking-tighter">{g.title}</h4>
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${g.closed ? 'text-red-500' : 'text-gray-500'}`}>{g.dur}</span>
                  {!g.closed && (
                    <button onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Bid Dispatched")} className="px-5 py-2.5 bg-white/5 group-hover:bg-[#00f2ff] group-hover:text-black border border-white/10 rounded-xl text-[8px] font-black uppercase transition-all">Submit Bid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ... [CODE FOR CONTRACTS, MESSAGES, WALLET, STATS, PROFILE, SETTINGS REMAINS UNCHANGED] ... */}
      {/* (Skipping identical tab renders for brevity, apply the same UI from your original code) */}

      {/* --- 🚨 VERIFY MODAL (Updated for IntaSend) --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[56px] p-10 text-center animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-2xl font-black uppercase text-[#00f2ff] mb-2 italic tracking-tighter">ACTIVATE <span className="text-white">NODE</span></h3>
            <p className="text-gray-400 text-[11px] mb-10 italic">Secure Channel activation required ($10.00)</p>
            <div className="space-y-4">
              <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="07XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center font-black outline-none focus:border-[#00f2ff] text-white tracking-widest" />
              <div className="min-h-15 flex items-center justify-center">
                {!isPaying ? (
                  <button onClick={handleIntaSendPayment} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all italic">Pay via M-Pesa</button>
                ) : (
                   <p className="text-[10px] font-black text-[#00f2ff] animate-pulse uppercase tracking-widest italic">Authenticating Payload...</p>
                )}
              </div>
              <button onClick={() => alert("Send Exactly 10 USDT (BEP20) to: 0x3cd9f36bd42df9721eb5eb74daccdba32d31bb47")} className="w-full py-5 bg-[#F0B90B] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-amber-500/20 active:scale-95 transition-all italic">Binance USDT</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`flex flex-col items-center py-3.5 px-6 rounded-full min-w-17.5 transition-all duration-500 ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-110 shadow-2xl shadow-[#00f2ff]/30' : 'text-gray-500 hover:text-white'}`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};