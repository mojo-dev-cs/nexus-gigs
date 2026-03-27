"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // --- 🛰️ MARKETPLACE DATA ---
  const sampleGigs = [
    { id: "1", title: "Next.js E-commerce Frontend", budget: 450, client: "Alpha Tech", rating: "4.9/5", category: "Web Dev" },
    { id: "2", title: "Python Automation Script", budget: 120, client: "Dr. K. Kamau", rating: "5.0/5", category: "Scripting" },
    { id: "3", title: "UI/UX Mobile App Design", budget: 800, client: "Maji Global", rating: "4.8/5", category: "Design" },
    { id: "4", title: "Technical Writing: API Docs", budget: 250, client: "DevStream", rating: "4.7/5", category: "Writing" },
    { id: "5", title: "Logo Branding Package", budget: 150, client: "Nexa Studio", rating: "5.0/5", category: "Branding" },
  ];

  // --- 📱 NAVIGATION ITEMS (MOVED INSIDE TO FIX YOUR ERROR) ---
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

  // --- ⚡ FUNCTIONAL HANDLERS ---
  const handleMpesaVerification = () => {
    if (mpesaNumber.length < 10) return alert("Enter valid M-Pesa number");
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsVerified(true);
      setShowVerifyModal(false);
      alert("Nexus Protocol Verified. Gigs Unlocked.");
    }, 2000);
  };

  const handleApply = (gigTitle: string) => {
    if (!isVerified) return setShowVerifyModal(true);
    alert(`Application for "${gigTitle}" submitted to client.`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-40 pt-6 px-4">
      
      {/* --- 🏠 HOME: 3D STATS --- */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <header><h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">HELLO, {user?.firstName}</h2></header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-10 bg-linear-to-br from-[#0a0f1e] to-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff] mb-4 italic">Live Balance</p>
              <h3 className="text-5xl font-black italic mb-8">$0.00</h3>
              <button onClick={() => alert("Withdrawal requires minimum $10.00")} className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Withdraw to M-Pesa</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col justify-center text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Proposal Win Rate</p>
              <h3 className="text-4xl font-black italic text-emerald-500">{isVerified ? "100%" : "0%"}</h3>
            </div>
            <div className={`p-8 border rounded-[40px] flex flex-col justify-center text-center ${isVerified ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Protocol Status</p>
              <h3 className="text-xl font-black italic uppercase tracking-tighter">{isVerified ? "Verified" : "Restricted"}</h3>
            </div>
          </div>
        </div>
      )}

      {/* --- 💼 GIGS: MARKETPLACE --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Nexus <span className="text-[#00f2ff]">Marketplace</span></h2>
            <div className="flex gap-2">
                <input type="text" placeholder="Filter skills..." className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl text-xs outline-none focus:border-[#00f2ff] w-full" />
                <button className="bg-[#00f2ff] text-black px-6 py-2 rounded-2xl font-black text-[10px] uppercase">Filter</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleGigs.map(g => (
              <div key={g.id} className="p-8 bg-white/2 border border-white/10 rounded-[40px] hover:border-[#00f2ff]/40 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px]">{g.client[0]}</div>
                    <div className="text-[8px] font-black text-emerald-500 uppercase italic">{g.client} • {g.rating}</div>
                  </div>
                  <p className="text-2xl font-black italic text-[#00f2ff]">${g.budget}</p>
                </div>
                <h4 className="text-lg font-bold mb-8 group-hover:text-[#00f2ff] transition-colors line-clamp-1">{g.title}</h4>
                <button onClick={() => handleApply(g.title)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase hover:bg-white/10 transition-all">Submit Proposal</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 📜 CONTRACTS / MESSAGES / ANALYTICS (Functional Placeholders) --- */}
      {(['contracts', 'messages', 'analytics', 'earnings', 'settings', 'account'].includes(activeTab)) && (
        <div className="space-y-8 animate-in fade-in">
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">{activeTab} <span className="text-[#00f2ff]">Protocol</span></h2>
           <div className="p-20 bg-white/2 border border-dashed border-white/10 rounded-[48px] text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 italic">Initializing Sub-system for {user?.firstName}...</p>
              <p className="text-xs text-gray-800 mt-4 uppercase font-bold">Encrypted data streams pending verification</p>
           </div>
        </div>
      )}

      {/* --- 🚨 VERIFICATION MODAL --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-black/90" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-[#00f2ff]/20 rounded-[48px] p-10 text-center animate-in zoom-in-95">
             <h3 className="text-2xl font-black italic tracking-tighter mb-4 text-white uppercase">ELITE <span className="text-[#00f2ff]">STATUS</span></h3>
             <p className="text-gray-500 text-xs mb-8 leading-relaxed italic">The Protocol requires a <span className="text-white font-bold">$10.00</span> verification to unlock high-tier <span className="text-white">gigs</span>.</p>
             <div className="space-y-4">
                <input 
                    value={mpesaNumber} 
                    onChange={e => setMpesaNumber(e.target.value)} 
                    placeholder="07XXXXXXXX" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-[#00f2ff] transition-all" 
                />
                <button 
                    disabled={isPaying}
                    onClick={handleMpesaVerification} 
                    className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-500 transition-all"
                >
                  {isPaying ? "ENCRYPTING..." : "VERIFY VIA M-PESA"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION PILL --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl overflow-x-auto no-scrollbar">
         {navItems.map(item => (
           <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`flex flex-col items-center py-3 px-5 rounded-full min-w-17.5 transition-all ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-110' : 'text-gray-500 hover:text-white'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[7px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
};