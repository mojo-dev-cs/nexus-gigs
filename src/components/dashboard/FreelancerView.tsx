"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");

  // Navigation Items
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'tasks', icon: '💼', label: 'Gigs' },
    { id: 'contracts', icon: '📜', label: 'Contracts' },
    { id: 'messages', icon: '💬', label: 'Chats' },
    { id: 'earnings', icon: '💰', label: 'Wallet' },
    { id: 'analytics', icon: '📊', label: 'Stats' },
    { id: 'account', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-32 pt-2 px-4">
      
      {/* --- 🏠 HOME: COMMAND CENTER --- */}
      {activeTab === "home" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <header className="mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
               WELCOME BACK, {user?.firstName || "OPERATOR"}
            </h2>
          </header>

          {/* 3D Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-[#0a0f1e] to-[#020617] border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Live Balance</p>
              <h3 className="text-4xl font-black italic text-white mb-6">$0.00</h3>
              <button className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl text-[10px] uppercase hover:bg-emerald-500 transition-all">Withdraw to M-Pesa</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Proposal Win Rate</p>
              <h3 className="text-4xl font-black italic text-white">0%</h3>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Active Contracts</p>
              <h3 className="text-4xl font-black italic text-white">0</h3>
            </div>
          </div>
        </div>
      )}

      {/* --- 💼 BROWSE GIGS --- */}
      {activeTab === "tasks" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase italic italic tracking-tighter">Available <span className="text-[#00f2ff]">Gigs</span></h2>
            <input type="text" placeholder="Search Marketplace..." className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs outline-none focus:border-[#00f2ff]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.length > 0 ? jobs.map(j => (
              <div key={j.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-[30px]">
                <h4 className="font-bold mb-2">{j.title}</h4>
                <button onClick={() => setShowVerifyModal(true)} className="w-full py-3 bg-[#00f2ff] text-black font-black rounded-xl text-[9px] uppercase">Submit Proposal</button>
              </div>
            )) : <p className="text-gray-500 text-sm">Scanning for new gigs...</p>}
          </div>
        </div>
      )}

      {/* --- 📜 ACTIVE CONTRACTS --- */}
      {activeTab === "contracts" && (
        <div className="space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Project <span className="text-purple-500">Workspace</span></h2>
          <div className="p-20 border-2 border-dashed border-white/5 rounded-[40px] text-center text-gray-600 uppercase text-[10px] font-black tracking-widest">
            No Active Projects. Win a gig to start collaborating.
          </div>
        </div>
      )}

      {/* --- 👤 PROFILE TAB --- */}
      {activeTab === "account" && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
          <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#00f2ff] rounded-[24px] flex items-center justify-center text-3xl font-black text-black italic">V</div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase">{user?.fullName}</h3>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full ${isVerified ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                  {isVerified ? "VERIFIED PROTOCOL" : "UNVERIFIED ACCOUNT"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Skills</label>
                <input placeholder="React, Node.js, Python..." className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Hourly Rate ($)</label>
                <input placeholder="25.00" className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Languages</label>
                <input placeholder="English, Swahili..." className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Education</label>
                <input placeholder="BSc Computer Science..." className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-sm" />
              </div>
            </div>
            <button className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all hover:scale-105">Save Profile Changes</button>
          </div>
        </div>
      )}

      {/* --- 🚨 VERIFICATION GATE --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[40px] p-10 text-center animate-in zoom-in-95">
            <h3 className="text-2xl font-black uppercase italic text-white mb-2">Nexus <span className="text-[#00f2ff]">Verification</span></h3>
            <p className="text-gray-400 text-xs mb-8">Pay <span className="text-white">$10.00</span> to verify your account and unlock <span className="text-white font-bold">gigs</span>.</p>
            
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                <label className="text-[8px] font-black text-gray-500 uppercase mb-2 block">M-Pesa Number</label>
                <input 
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="07XXXXXXXX" 
                  className="bg-transparent w-full text-white font-bold outline-none" 
                />
              </div>
              <button onClick={() => {alert("STK Push Sent!"); setIsVerified(true); setShowVerifyModal(false);}} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px]">Verify via M-Pesa</button>
              <button className="w-full py-4 bg-white/5 text-white font-black rounded-2xl uppercase text-[10px] border border-white/10">Verify via Binance</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION PILL (MOBILE & DESKTOP) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl overflow-x-auto no-scrollbar">
         {navItems.map(item => (
           <button 
             key={item.id}
             onClick={() => setActiveTab(item.id)}
             className={`flex flex-col items-center py-2 px-4 rounded-full min-w-[60px] transition-all ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-110' : 'text-gray-500 hover:text-white'}`}
           >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[7px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
           </button>
         ))}
      </div>

    </div>
  );
};